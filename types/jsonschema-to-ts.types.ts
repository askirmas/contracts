import { AnyObject, GetByPath, primitive } from "./ts-swiss.types";

export type JsonSchema2Ts<Schema, Root = Schema>
= Schema extends AnyObject ? (
  AllOf<[
    Schema extends {"$ref": string}
    ? string extends Schema["$ref"]
      ? unknown
      : Schema["$ref"] extends "#"
        ? JsonSchema2Ts<Root, Root>
        : Schema["$ref"] extends `#/${infer LocalPath}`
          ? JsonSchema2Ts<GetByPath<"/", Schema, LocalPath>, Root>
          : unknown
    : unknown,
    Schema extends {const: any} ? Schema["const"] : unknown,
    Schema extends {enum: any[]} ? Schema["enum"][number] : unknown,
    | Allowed<Schema, null, "null">
    | BoolProp<Schema, "nullable", null, never>
    | Allowed<Schema, boolean, "boolean">
    | Allowed<Schema, number, "number"|"integer">
    | Allowed<Schema, string, "string">
    | Allowed<Schema, BuildArray<Schema, Root>, "array">
    | Allowed<Schema, BuildObject<Schema, Root>, "object">
  ]>
)
: true extends Schema ? unknown
: false extends Schema ? never
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

type BuildArray<Schema, Root>
= CompileArray<
  Root,
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
    : true,
    Root
  >,
  Schema extends {minItems: number}
  ? number extends Schema["minItems"] ? 0 : Schema["minItems"]
  : 0,
  Schema extends {maxItems: number}
  ? Schema["maxItems"]
  : number
>

type CompileArray<
  Root,
  Base extends unknown[],
  additionalSchema,
  minLen extends number,
  maxLen extends number,
  Acc extends unknown[] = []
> = maxLen extends Acc["length"]
? Acc
: Base extends [infer Cur, ...infer NextBase]
? CompileArray<
  Root,
  NextBase,
  additionalSchema,
  minLen,
  maxLen,
  minLen extends Acc["length"]
  ? [...Acc,
      JsonSchema2Ts<Cur, Root>?
    ]
  : [...Acc, JsonSchema2Ts<Cur, Root>]
>
: (
  (
    [additionalSchema] extends [never]
    ? number extends maxLen
      ? true
      : false
    : false
  ) extends true
  ? Acc
  : CompileArray<
    Root,
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
)

type BuildObject<Schema, Root>
= CompileObject<
  Schema extends {properties: {[property in string]: unknown}}
  ? {[Property in keyof Schema["properties"]]: JsonSchema2Ts<Schema["properties"][Property], Root>}
  : Record<never, never>,
  Schema extends {required: string[]}
  ? string extends Schema["required"][number]
    ? never
    : Schema["required"][number]
  : never,
  Schema extends {propertyNames: unknown}
  ? string & JsonSchema2Ts<Schema["propertyNames"], Root>
  : string,
  Schema extends {additionalProperties: unknown}
  ? JsonSchema2Ts<Schema["additionalProperties"], Root>
  : unknown
>

type CompileObject<
  Source extends AnyObject,
  Required extends string,
  Allowed extends string,
  Additional
> = { [R in Required]:
  R extends Allowed
  ? ( R extends keyof Source ? Source[R] : Additional )
  : never
} & {
  [P in Exclude<keyof Source, Required>]?: 
    P extends Allowed
    ? Source[P]
    : never
} & (
  string extends Allowed 
  ? (
    [Additional] extends [never]
    ? unknown
    : { [indexing in string]: Additional | Source[keyof Source] }
  )
  : { [additional in Exclude<Allowed, keyof Source | Required>]?: Additional }
)

type AllOf<Expr extends any[]> = number extends Expr["length"]
? never
: Expr["length"] extends 0|1
? Expr[0]
: Expr extends [infer T0, infer T1, ...infer Etc]
? AllOf<[Intersect<T0, T1>, ...Etc]>
: never

type Intersect<T1, T2> =
unknown extends T1
? T2
: unknown extends T2
  ? T1
  : (
    Extract<T1, primitive> & Extract<T2, primitive> 
  ) | (
    Extract<T1, any[]> & Extract<T2, any[]> 
  ) | (
    Exclude<T1, primitive | any[]> & Exclude<T2, primitive | any[]> 
  )

type BoolProp<Source, Prop extends string, True = true, False = false>
= Source extends {[P in Prop]: boolean}
? Source extends {[P in Prop]: false} ? False : True
: False
