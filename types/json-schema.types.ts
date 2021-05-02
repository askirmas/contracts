import { AnyObject } from "./ts-swiss.types"

interface PrimitiveTypes {
  "null": null
  "boolean": boolean
  "integer": number
  "number": number
  "string": string
}

export type Schema2TS<S = unknown>
= [S] extends [never] ? unknown
: unknown extends S ? unknown
: S extends false ? never
: S extends undefined ? any
: S extends true ? any
: S extends AnyObject
  ? (
    [keyof S] extends [never] ? any
    : Strict2TS<S>
    & (
      TypePrimitive2TS<S>
      | BuildObject<S>
    )
  )
  : never

export type Strict2TS<S> = (
  S extends {const: any}
  ? S["const"]
  : unknown
) & (
  S extends {enum: any[]}
  ? S["enum"][number]
  : unknown
)

export type Exampled2TS<S> = (
  S extends {default: any}
  ? S["default"]
  : never
) | (
  S extends {example: any}
  ? S["example"]
  : never
) | (
  S extends {examples: any[]}
  ? S["examples"][number]
  : never
)

export type TypePrimitive2TS<S> = (
  S extends {type: keyof PrimitiveTypes}
  ? PrimitiveTypes[S["type"]]
  : S extends {type: (keyof PrimitiveTypes)[]}
  ? PrimitiveTypes[S["type"][number]]
  : never
)

export type BuildObject<S> = S extends {
  required?: string[]
  propertyNames?: unknown
  properties?: {[property: string]: unknown}
  additionalProperties?: unknown
  // patternProperties?: {[pattern: string]: unknown}
} 
? (
  (
    S extends {required: string[]}
    ? (
      string extends S['required'][number]
      ? unknown
      : { [P in S['required'][number]]: unknown }
    )
    : unknown
  ) 
) & (
  S extends { properties: {[property: string]: unknown} }
  ? {[P in keyof S["properties"]]?: Schema2TS<S["properties"][P]>}
  : unknown
) & (
  Record<string,
    Schema2TS<S["additionalProperties"]>
    | (
      S extends { properties: {[property: string]: unknown} }
      ? {[P in keyof S["properties"]]: Schema2TS<S["properties"][P]>}[keyof S["properties"]]
      : never
    )
  >
)
: never
// Schema2TS

export type ExtractType<T extends AnyObject> = keyof T extends "type" ? (
  Extract<T["type"], string>
  | Extract<T["type"], string[]>[Extract<keyof T["type"], number>]
)
: unknown

export type IsType<S, Type extends string> = Type extends (
  S extends {type: string} ? S["type"]
  : S extends {type: string[]} ? S["type"][number]
  : unknown
)
? true
: false
