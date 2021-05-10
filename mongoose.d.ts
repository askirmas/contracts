///* <reference types="mongoose" />
/// <reference types="node" />

import type { Stringable } from "./types/ts-swiss.types"

declare module "mongoose" {
  import { Schema, SchemaDefinition } from "mongoose"
  import mongo from "mongodb"

  // import mongoose = require('mongoose');

  type VFn0<T> = T | (()  => T)

  namespace Declaration {

    type Boolean = BooleanConstructor | "Boolean" | "boolean"
    type Number = NumberConstructor | "Number" | "number" 
    type String = StringConstructor | "String" | "string"
    type Date = DateConstructor | "Date" | "date"
    type Buffer = globalThis.Buffer | "Buffer"
    type Map = MapConstructor | "Map"
    type Mixed = Record<never, never> | Schema.Types.Mixed | ObjectConstructor
    type Decimal128 = "Decimal128" | mongo.Decimal128
    type ObjectId = "ObjectId" | mongo.ObjectId
  }

  namespace SchemaExpression {
  // https://mongoosejs.com/docs/schematypes.html#schematype-options
    type Controls<T> = Partial<{
      /**  boolean or function, if true adds a required validator for this property */
      "required": VFn0<boolean>
      /** Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default. */
      "default": VFn0<T>
      /** specifies default projections for queries */
      "select": boolean
      /** function, adds a validator function for this property */
      "validate": (() => boolean) | Promise<boolean>
      /** function, defines a custom getter for this property using Object.defineProperty(). */
      "get": () => T
      /** function, defines a custom setter for this property using Object.defineProperty(). */
      "set": () => T
      /** string, mongoose >= 4.10.0 only. Defines a virtual with the given name that gets/sets this path. */
      "alias": string
      /** defines path as immutable. Mongoose prevents you from changing immutable paths unless the parent document has isNew: true. */
      "immutable": boolean
      /* Mongoose calls this function when you call Document#toJSON() function, including when you JSON.stringify() a document. */
      "transform": () => any
    }>

    type Enum<T> = Partial<{
      /** creates a validator that checks if the value is in the given array. */
      "enum": T[]
    }>

    type MinMax<T> = Partial<{
      /** creates a validator that checks if the value is greater than or equal to the given minimum. */
      "min": T
      /** creates a validator that checks if the value is less than or equal to the given maximum. */
      "max": T
    }>

    type Indexes = Partial<{
      /** whether to define an index on this property. */
      "index": boolean
      /** whether to define a unique index on this property. */
      "unique": boolean
      /** whether to define a sparse index on this property. */
      "sparse": boolean
    }>
  }

  namespace TypeSchema {
    type S<T, E = unknown> = T | ({"type": T} & E)

    type Boolean = S<Declaration.Boolean>
    type Number = S<Declaration.Number, SchemaExpression.Enum<number> & SchemaExpression.MinMax<number>>
    type Date = S<Declaration.Date, SchemaExpression.MinMax<globalThis.Date>>

    type String = S<Declaration.String, SchemaExpression.Enum<string> & {
      /** whether to always call .toLowerCase() on the value */
      "lowercase": boolean
      /** whether to always call .toUpperCase() on the value */
      "uppercase": boolean
      /** whether to always call .trim() on the value */
      "trim": boolean
      /** creates a validator that checks if the value matches the given regular expression */
      "match": RegExp
      /** creates a validator that checks if the value length is not less than the given number */
      "minlength": number
      /** creates a validator that checks if the value length is not greater than the given number   */
      "maxlength": number
    }>

    type Buffer = S<Declaration.Buffer>
    type Map = S<Declaration.Map, {"of": tSchemaExpression}>

    type Decimal128 = S<Declaration.Decimal128>
    type ObjectId = S<Declaration.ObjectId>
    type Array = [tSchemaExpression, ...tSchemaExpression[]]
  }

  type tSchemaExpression
  = TypeSchema.Boolean
  | TypeSchema.Number
  | TypeSchema.String
  | TypeSchema.Date
  | TypeSchema.Buffer
  | TypeSchema.Map
  | TypeSchema.Decimal128
  | TypeSchema.ObjectId
  | TypeSchema.Array
  type tSchemaDefinition = Record<string, tSchemaExpression>
  export interface SchemaDefinition extends tSchemaDefinition {}

  namespace ValueType {
    type True = true | "true" | 1 | "1" | "yes"
    type False = false | "false" | 0 | "0" | "no"
    type Boolean = True | False
    type Number = number | boolean | {valueOf: () => number} | "" 
    type String = string | Stringable
    type Buffer = string | number | {"type": "Buffer", "data": number[]}
    type Map<V = unknown> = Record<string, V>
    type Mixed = any
    // ObjectId
    // Schema
  }
    
}
