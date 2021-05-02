import { AnyObject } from "./ts-swiss.types";

export type JsonSchema2Ts<S>
= S extends AnyObject ? (
  (S extends {const: any} ? S["const"] : unknown)
  & (S extends {enum: any[]} ? S["enum"][number] : unknown)
  & (
    | Allowed<S, null, "null">
    | (
      S extends {nullable: boolean}
      ? S["nullable"] extends false ? never : null
      : never
    )
    | Allowed<S, boolean, "boolean">
    | Allowed<S, number, "number"|"integer">
    | Allowed<S, string, "string">
    | Allowed<S, BuildArray<S>, "array">
    | Allowed<S, BuildObject<S>, "object">
  )
)
: true extends S ? unknown
: false extends S ? never
: unknown

type Allowed<Schema, Type, TypeName extends string>
= string extends Types<Schema>
? (
  Schema extends {examples: any[]}
  ? Extract<Schema["examples"][number], Type>
  : Type
)
: TypeName extends Types<Schema> ? Type : never

type Types<Schema> = Schema extends {type: string} ? Schema["type"]
: Schema extends {type: string[]} ? Schema["type"][number]
: string

type BuildArray<Schema>
= CompileArray<
  Schema extends {items: unknown[]}
  ? number extends Schema["items"]["length"]
    ? []
    : Schema["items"]
  : [],
  JsonSchema2Ts<
      Schema extends {items: unknown[]}
      ? number extends Schema["items"]["length"]
        ? (
          Schema["items"][number] | (
            Schema extends {additionalItems: unknown}
            ? Schema["additionalItems"]
            : never            
          )
        )
        : Schema extends {additionalItems: unknown}
          ? Schema["additionalItems"]
          : true
      : Schema extends {items: unknown}
    ? Schema["items"]
    : true
  >,
  Schema extends {minItems: number}
  ? number extends Schema["minItems"] ? 0 : Schema["minItems"]
  : 0,
  Schema extends {maxItems: number}
  ? Schema["maxItems"]
  : number
>

type CompileArray<
  Base extends unknown[],
  additionalSchema,
  minLen extends number,
  maxLen extends number,
  Acc extends unknown[] = []
> = maxLen extends Acc["length"]
? Acc
: Base extends [infer Cur, ...infer NextBase]
? CompileArray<
  NextBase,
  additionalSchema,
  minLen,
  maxLen,
  minLen extends Acc["length"]
  ? [...Acc, JsonSchema2Ts<Cur>?]
  : [...Acc, JsonSchema2Ts<Cur>]
>
: CompileArray<
  [],
  additionalSchema,
  minLen,
  maxLen,
  number extends maxLen
  ? [...Acc, ...additionalSchema[]]
  : minLen extends Acc["length"]
  ? [...Acc, additionalSchema?]
  : [...Acc, additionalSchema]
>

type BuildObject<Schema>
= CompileObject<
  Schema extends {properties: {[property in string]: unknown}}
  ? {[K in keyof Schema["properties"]]: JsonSchema2Ts<Schema["properties"][K]>}
  : Record<never, never>,
  Schema extends {required: string[]}
  ? string extends Schema["required"][number]
    ? never
    : Schema["required"][number]
  : never,
  Schema extends {propertyNames: unknown}
  ? string & JsonSchema2Ts<Schema["propertyNames"]>
  : string,
  Schema extends {additionalProperties: unknown}
  ? JsonSchema2Ts<Schema["additionalProperties"]>
  : unknown
>

// type Ever<T, D> = [T] extends [never] ? D : T

type CompileObject<
  Source extends AnyObject,
  Required extends string,
  Allowed extends string,
  Additional
> = { [K in Required]:
  K extends Allowed
  ? ( K extends keyof Source ? Source[K] : Additional )
  : never
} & {
  [K in Exclude<keyof Source, Required>]?: 
    K extends Allowed ? Source[K] : never
} & (
  string extends Allowed 
  ? { [K in string]: Additional | Source[keyof Source] }
  : { [K in Exclude<Allowed, keyof Source | Required>]?: Additional }
)
