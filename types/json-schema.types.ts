import { AnyObject, EmptyObject } from "./ts-swiss.types"

interface PrimitiveTypes {
  "null": null
  "boolean": boolean
  "integer": number
  "number": number
  "string": string
}

export type Schema2TS<S = unknown>
= S extends false ? never
: S extends true ? any
: S extends EmptyObject ? any
: S extends AnyObject
  ? (
    Strict2TS<S>
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
  // propertyNames?: unknown
  properties?: {[property: string]: unknown}

  required?: string[]

  additionalProperties?: unknown
  patternProperties?: {[pattern: string]: unknown}
} 
? (
  S extends {required: string[]}
  ? (
    string extends S['required'][number] ? unknown : {
      [P in S['required'][number]]: (
        S extends {properties: {[p in P]: unknown}}
        ? Schema2TS<S["properties"][P]>
        : (
          Schema2TS<S["additionalProperties"]>
          | S["patternProperties"][keyof S["patternProperties"]]
        )
      )
    }
  )
  : unknown
) & {
  [P in keyof S['properties']]?: S['properties'][P]
}
: never
// Schema2TS

export type ExtractType<T extends AnyObject> = keyof T extends "type" ? (
  Extract<T["type"], string>
  | Extract<T["type"], string[]>[Extract<keyof T["type"], number>]
)
: unknown

