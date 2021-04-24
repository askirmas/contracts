import type { Strict2TS, TypePrimitive2TS } from "./json-schema.types"

desc("Strict2TS", () => {
  tscheck<Strict2TS<{const: 1}>>({
    "1": 1,
    //@ts-expect-error
    "2": 2,
  })

  tscheck<Strict2TS<{enum: [1, 2]}>>({
    "1": 1,
    "2": 2,
    //@ts-expect-error
    "3": 3,
  })

  tscheck<Strict2TS<{const: 1, enum: [2]}>>({
    "never": undefined as never,
    //@ts-expect-error
    "1": 1,
    //@ts-expect-error
    "2": 2,
  })

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

function desc(title: string, scope: () => any) {return {title, scope}}
function tscheck<T>(check: Record<string, T>) {return check}
