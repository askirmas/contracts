import {
  desc,
  tscheck,
  tscompare
} from "../utils/checking";
import { JsonSchema2Ts } from "./jsonschema-to-ts.types";

desc("general", () => {
  tscompare<JsonSchema2Ts<false>, never>("=")
  tscompare<JsonSchema2Ts<true>, any>("=")
  tscompare<JsonSchema2Ts<{}>, any>("=")
})

desc("pre-defined", () => {
  tscompare<JsonSchema2Ts<{const: 1}>, 1>("=")
  tscompare<JsonSchema2Ts<{enum: [1, 2]}>, 1|2>("=")
  tscompare<JsonSchema2Ts<{const: 1, enum: [1, 2]}>, 1>("=")
  tscompare<JsonSchema2Ts<{const: 0, enum: [1, 2]}>, never>("=")
})

desc("primitive", () => {
  desc("boolean", () => {
    tscompare<boolean, JsonSchema2Ts<{type: "boolean"}>>("=")
    tscompare<boolean, JsonSchema2Ts<{examples: [boolean]}>>("=")
    tscompare<boolean, JsonSchema2Ts<{type: string[], examples: [boolean]}>>("=")
  })

  desc("null", () => {
    tscompare<JsonSchema2Ts<{type: "null"}>, null>("=")
    tscompare<JsonSchema2Ts<{type: ["null"]}>, null>("=")
    tscompare<JsonSchema2Ts<{examples: [null]}>, null>("=")
    //@ts-expect-error //TODO
    tscompare<JsonSchema2Ts<{example: null}>, null>("=")
  })

  desc("nullable", () => {
    tscompare<JsonSchema2Ts<{type: "string", nullable: false}>, string>("=")
    tscompare<JsonSchema2Ts<{type: "string", nullable: true}>, string|null>("=")
    tscompare<JsonSchema2Ts<{type: "string", nullable: boolean}>, string|null>("=")    
  })
})

desc("array", () => {
  desc("length-less", () => {
    tscompare<string[], JsonSchema2Ts<{
      type: "array",
      items: {type: "string"}
    }>>("=")
    
    tscompare<unknown[], JsonSchema2Ts<{
      type: "array",
      additionalItems: {type: "string"}
    }>>("=")
  
    // TODO Consider more Accuracy
    tscompare<("item"|"add")[], JsonSchema2Ts<{
      type: "array",
      items: {const: "item"}[],
      additionalItems: {const: "add"}
    }>>("=")

    tscompare<["0"?, "1"?, ...unknown[]], JsonSchema2Ts<{
      type: "array",
      items: [{const: "0"}, {const: "1"}]
    }>>("=")
    
    tscompare<["0"?, "1"?, ..."add"[]], JsonSchema2Ts<{
      type: "array",
      items: [{const: "0"}, {const: "1"}],
      additionalItems: {const: "add"}
    }>>("=")
  })

  desc("range length", () => {
    tscompare<["item", "item"?, "item"?], JsonSchema2Ts<{
      type: "array",
      items: {const: "item"},
      minItems: 1,
      maxItems: 3
    }>>("=")

    tscompare<["item", "item"?, "item"?], JsonSchema2Ts<{
      type: "array",
      items: {const: "item"}[],
      minItems: 1,
      maxItems: 3
    }>>("=")

    tscompare<["0", "1"?, unknown?], JsonSchema2Ts<{
      type: "array",
      items: [{const: "0"}, {const: "1"}]
      minItems: 1,
      maxItems: 3
    }>>("=")

    tscompare<["0", "1"?, "add"?], JsonSchema2Ts<{
      type: "array",
      items: [{const: "0"}, {const: "1"}],
      additionalItems: {const: "add"},
      minItems: 1,
      maxItems: 3
    }>>("=")

    tscompare<["0", "1"?, "2"?], JsonSchema2Ts<{
      type: "array",
      items: [{const: "0"}, {const: "1"}, {const: "2"}, {const: "3"}],
      additionalItems: {const: "add"},
      minItems: 1,
      maxItems: 3
    }>>("=")
  })
})

desc("object", () => {
  desc("one rule", () => {
    tscompare<{a: unknown, b: unknown}, JsonSchema2Ts<{
      type: "object",
      required: ["a", "b"]
    }>>("=")
  
    tscompare<{a?: unknown, b?: unknown}, JsonSchema2Ts<{
      type: "object",
      propertyNames: {enum: ["a", "b"]}
    }>>("=")
  
    tscompare<{a?: string, b?: number}, JsonSchema2Ts<{
      type: "object",
      properties: {
        a: {type: "string"},
        b: {type: "number"}
      }
    }>>("=")
  
    tscompare<Record<string, string>, JsonSchema2Ts<{
      type: "object",
      additionalProperties: {type: "string"} 
    }>>("=")
  })

  desc("doubles", () => {
    {tscompare<
      JsonSchema2Ts<{
        type: "object",
        required: ["a", "b"],
        propertyNames: {enum: ["a", "c"]}
      }>,
      {
        a: unknown
        b: never
        c?: unknown
      }
    >("=")}

    {tscompare<
      JsonSchema2Ts<{
        type: "object",
        required: ["a", "b"],
        properties: {
          a: {type: "string"},
          c: {type: "number"}  
        }
      }>,
      {
        a: string
        b: unknown
        c?: number
      }
    >("=")}

    {tscompare<
      JsonSchema2Ts<{
        type: "object",
        required: ["a", "b"],
        additionalProperties: {type: "string"}
      }>,
      {
        a: string
        b: string
        [etc: string]: string
      }
    >("=")}

    {tscompare<
      JsonSchema2Ts<{
        type: "object",
        propertyNames: {enum: ["a", "b"]},
        properties: {
          a: {type: "string"},
          c: {type: "number"}  
        }
      }>,
      {
        a?: string
        b?: unknown
        c?: never
      }
    >("=")}

    {tscompare<
      JsonSchema2Ts<{
        type: "object",
        propertyNames: {enum: ["a", "b"]},
        additionalProperties: {type: "string"}
      }>,
      {
        a?: string
        b?: string
      }
    >("=")}
    
    {tscompare<
      JsonSchema2Ts<{
        type: "object",
        properties: {
          a: {type: "string"},
          c: {type: "number"},
        },
        additionalProperties: {type: "boolean"}
      }>,
      {
        a?: string,
        c?: number
      } & {
        [k: string]: string|number|boolean
      }
    >("=")}
  })

  desc("3", () => {
    tscompare<JsonSchema2Ts<{
      type: "object",
      propertyNames: {enum: ["a", "b"]},
      required: ["a", "c"],
      additionalProperties: {type: "string"}
    }>, {
      a: string,
      b?: string
      c: never
    }>("=")

    tscompare<JsonSchema2Ts<{
      type: "object",
      propertyNames: {enum: ["a", "b"]},
      required: ["a", "c"],
      properties: {
        b: {type: "string"},
        c: {type: "number"}
      }
    }>, {
      a: unknown,
      b?: string
      c: never
    }>("=")

    tscompare<JsonSchema2Ts<{
      type: "object",
      propertyNames: {enum: ["a", "b"]},
      properties: {
        b: {type: "string"},
        c: {type: "number"}
      }
      additionalProperties: {type: "boolean"}
    }>, {
      a?: boolean,
      b?: string
    }>("=")    

    tscompare<JsonSchema2Ts<{
      type: "object",
      required: ["a", "b"],
      properties: {
        b: {type: "string"},
        c: {type: "number"}
      }
      additionalProperties: {type: "boolean"}
    }>, {
      a: boolean,
      b: string
      c?: number
    }>("=")    
  })

  desc("4", () => {
    tscompare<JsonSchema2Ts<{
      type: "object",
      propertyNames: {enum: [
        "n+ r- p-",
        "n+ r- p+",
        "n+ r+ p-",
        "n+ r+ p+",
      ]},
      required: [
        "n- r+ p-",
        "n- r+ p+",
        "n+ r+ p-",
        "n+ r+ p+",
      ],
      properties: {
        "n- r- p+": {type: "string"},
        "n- r+ p+": {type: "string"},
        "n+ r- p+": {type: "string"},
        "n+ r+ p+": {type: "string"},
      },
      additionalProperties: {type: "number"}
    }>, {
      // "n- r- p-"?: never,
      // "n- r- p+"?: never,
      "n- r+ p-": never,
      "n- r+ p+": never,
      "n+ r- p+"?: string,
      "n+ r+ p+": string,
      "n+ r- p-"?: number,
      "n+ r+ p-": number,
    }>("=")
  })
})

desc("$ref", () => {
  tscompare<string, JsonSchema2Ts<{
    $ref: "#/definitions/str"
    definitions: {
      str: {type: "string"}
    }
  }>>("=")

  desc("List", () => {
    type List = null | {next: List}
    type JList = JsonSchema2Ts<{
      type: ["object", "null"],
      required: ["next"],
      additionalProperties: false,
      properties: {
        "next": {
          "$ref": "#"
        }
      }
    }>

    tscompare<List, JList>("=")
    
    tscheck<JList>({
      "empty": null,
      //@ts-expect-error
      "{}": {},
      "next": {"next": null},
      // TODO @ts-expect-error null works
      "next+": {"next": {"next": null}, "a": null},
      //@ts-expect-error
      "next &": {"next": {"next": null, "length": 1}},
      "deep": {"next": {"next": {"next": null}}}
    })
  })


})