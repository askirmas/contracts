import { desc, tscheck, tscompare } from "../utils/checking"
import { BuildObject, IsType, Strict2TS, TypePrimitive2TS } from "./json-schema.types"

desc("Strict2TS", () => {
  tscompare<
    Strict2TS<{const: 1}>,
    1
  >("=")

  tscompare<
    Strict2TS<{enum: [1, 2]}>,
    1|2
  >("=")

  tscompare<
    Strict2TS<{const: 1, enum: [1, 2]}>,
    1
  >("=")

  tscompare<
    Strict2TS<{const: 0, enum: [1, 2]}>,
    never
  >("=")
})

desc("Exampled2TS", () => {
  // TODO
})

desc("TypePrimitive2TS", () => {
  /** any means never */
  tscheck<TypePrimitive2TS<{type: string}>>({
    "never": undefined as never,
    //@ts-expect-error
    "null": null
  })

  tscheck<TypePrimitive2TS<{type: "null"}>>({
    "null": null,
    //@ts-expect-error
    "undefined": undefined
  })

  tscheck<TypePrimitive2TS<{type: "boolean"}>>({
    "true": true,
    "false": false,
    //@ts-expect-error
    "undefined": undefined
  })

  tscheck<TypePrimitive2TS<{type: "integer"}>>({
    "0": 0,
    "0.1": 0.1,
    //@ts-expect-error
    "'0'": "0",
    //@ts-expect-error
    "0n": 0n,
    //@ts-expect-error
    "undefined": undefined

  })

  tscheck<TypePrimitive2TS<{type: "number"}>>({
    "0": 0,
    "0.1": 0.1,
    //@ts-expect-error
    "'0'": "0",
    //@ts-expect-error
    "0n": 0n,
    //@ts-expect-error
    "undefined": undefined
  })
  
  tscheck<TypePrimitive2TS<{type: "string"}>>({
    "": "",
    "string": "string"
  })
})

desc("BuildObject", () => {
  desc("single", () => {
    tscheck<BuildObject<{required: ["a", "b"]}>>({
      "a+b": {"a": "a", "b": "b"},
      //@ts-expect-error
      "a": {"a": "a"},
      //@ts-expect-error
      "b": {"b": "b"},
    })

    tscheck<BuildObject<{propertyNames: {enum: ["a", "b"]}}>>({
      "a": {"a": "a"},
      "b": {"b": "b"},
      //TODO @ts-expect-error
      "c": {"c": "c"}
    })

    tscheck<BuildObject<{properties: {a: {type: "string"}, b: {type: "number"}}}>>({
      "a=a": {"a": "a"},
      "b=1": {"b": 1},
      //@ts-expect-error
      "a=1": {"a": 1},
      //@ts-expect-error
      "b=b": {"b": "b"},
      "c": {"c": true},
      "abc": {
        "a": "a",
        "b": 1,
        "c": true
      }
    })
    
    tscheck<BuildObject<{additionalProperties: {type: "string"}}>>({
      "string": {"a": "string"},
      //@ts-expect-error
      "number": {"a": 1}
    })

    tscompare<
      BuildObject<{additionalProperties: {type: "string"}}>,
      {[K in string]: string}
    >("=")
  })

  desc("properties+additionalProperties", () => {
    tscheck<BuildObject<{
      properties: {a: {type: "string"}, b: {type: "number"}},
      additionalProperties: {type: "boolean"}
    }>>({
      "a=a": {"a": "a"},
      "b=1": {"b": 1},
      "c": {"c": true},
      "abc": {
        "a": "a",
        "b": 1,
        "c": true
      },
      //TODO @ts-expect-error
      "d": {"d": "a"}
    })
  })

  desc("everything", () => {
    type AllTogether = BuildObject<{
      "required": [
        "p- r+ n-",
        "p- r+ n+",
        "p+ r+ n-",
        "p+ r+ n+",
      ],
      "propertyNames": {
        "enum": [
          "p- r- n+",
          "p- r+ n+",
          "p+ r- n+",
          "p+ r+ n+"
        ]
      },
      "properties": {
        "p+ r- n-": {"type": "string"},
        "p+ r- n+": {"type": "string"},
        "p+ r+ n-": {"type": "string"},
        "p+ r+ n+": {"type": "string"}
      },
      "additionalProperties": {
        "type": "null"
      }
    }>

    tscompare<
      AllTogether,
      {
        // "p+ r- n-"?: number,
        // "p+ r- n+"?: number,
        // "p+ r+ n-": number,
        "p+ r+ n+": string
      }
    >("-")

    // tscheck<AllTogether>({
    //   "a": {
    //     "p+ r+ n+": "string",
    //     "p+ r+ n-": 1,
    //     "p- r+ n+": 1,
    //     "p- r+ n-": undefined
    //   }
    // })
  })
})

desc("IsType", () => {
  tscompare<
    IsType<{type: "string"}, "string">,
    true
  >("=")

  tscompare<
    IsType<{type: "string"|"number"}, "string">,
    true
  >("=")

  tscompare<
    IsType<{type: ["string"]}, "string">,
    true
  >("=")

  tscompare<
    IsType<{type: ["string", "number"]}, "string">,
    true
  >("=")

  tscompare<
    IsType<{type: string}, "string">,
    true
  >("=")

  tscompare<
    IsType<{type: number}, "string">,
    true
  >("=")

  tscompare<
    IsType<{type: "number"}, "string">,
    false
  >("=")
})
