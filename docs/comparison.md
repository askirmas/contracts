## Types

| [Schema](http://json-schema.org/understanding-json-schema/reference/type.html) | [OpenApi3](https://swagger.io/specification/) | [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types) | [JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#description) | [TS](https://www.typescriptlang.org/docs/handbook/basic-types.html#never) | JSDoc | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/data-types.html) | [mongodb](https://docs.mongodb.com/manual/reference/bson-types/) | [mongoose](https://mongoosejs.com/docs/schematypes.html) |
| ----------- | ---------- | ---------------------------------------------- | ----- | ------------------------------------------------------------ | -------------------------- | ---------- | ---------- | ---------- |
| -          |           |           | `undefined` | `undefined`                                    |       |                                                              |                            |                            |
| -          |           |           | _`undefined`_ | `never`, `void`                             |       |                                                              | ~~`"undefined"`~~ |                            |
| `"null"`   | `"nullable": true` |      | _`object`_  | `null`                                         |       | `NULL` | `"null"` |                            |
| `"boolean"` |  | `checkbox` | `boolean`   | `                                            boolean`        ||`BOOLEAN*=TINYINT(1)`|`"bool"`||
| `"integer"`<br />_`"number"+multipleOf: 1`_ |  | `number`<br />`range` | _`number`_<br />`bigint` | _`number`_                                     |       | `TINYINT`<br />`INTEGER`<br>`INT`<br/>`SMALLINT`<br/>`MEDIUMINT`<br/>`BIGINT`<br />`BIT` | `"int"`<br />`"long"`<br />`"decimal"` |                            |
| `"number"` |  | `number`<br />`range` | `number`    | `number`                                       |       | `DECIMAL`<br/>`NUMERIC`<br/>`FLOAT`<br/>`DOUBLE`             | `"double"` | `Number`<br />`Decimal128` |
| `"string"+maxLength` |  |  | _`string`_  | _`string`_                                     |       | `CHAR`                                                       |                            |                            |
| `"string"` |  | `text`<br />`search`<br />`url` | `string`    | `string`                                       |       | `VARCHAR`                                                    | `"string"` | `String`                   |
|            | `"format": "byte"`<br/>`"format": "binary"` | `file`<br />`image` |             |                                                |       | `BINARY`<br />`VARBINARY`<br />`BLOB`            | `"binData"` | `Buffer`                  |
| |  | `<textarea>` | | | | `TEXT` | _`"string"`_ | `string`<br />`Buffer` |
| `"string"+format` |  | `date`<br />`datetime`<br />`datetime-local`<br />`month`<br />`week`<br />`time` |             |                                                |       | `DATE`<br />`DATETIME`<br />`TIMESTAMP`<br />`TIME`<br />`YEAR` | `"date"`<br />`"timestamp"` | `Date`                     |
| `"object"` |    |    | `object`    | `{ ... }`<br />`Record<K,V>`<br />~~`object`~~ |       | `JSON`                                                       | `"object"` | `Map`<br />`Schema` |
| `"array"`  |     |     | _`object`_  | `T[]`<br />`Array<T>`                          |       | `JSON`                                                       | `"array"` |                            |
|            |            |            | `symbol`    | `symbol`                                       |       |                                                              | ~~`"symbol"`~~ |                            |
|            |            |            | `function`  | `(...args: any[]) => any`                      |       |                                                              | `"javascript"`<br />~~`"javascriptWithScope"`~~ |                            |
| `"string"+format` | | |  |  | | | `"regex"` | |
| `: true`,`: {}` |  |  | -           | `any`, `unknown`                               |       |                                                              |                     | `Mixed`                    |

### Falsy and truthy

- Mongoose: `['false', 0, '0', 'no']`,  `['true', 1, '1', 'yes']`
- JS: `[undefined, null, '', 0]` , all other

## Value
| Schema                                                       | HTML                                  | TS                         | JSDoc | MySQL      | mongoose                                         |
| ------------------------------------------------------------ | ------------------------------------- | -------------------------- | ----- | ---------- | ------------------------------------------------ |
| `enum`                                                       | _`radio`_<br />`<select>`             | `enum`, consts conjunction |       | `ENUM`     | `enum`                                           |
| *                                                            | _`checkbox`_<br />`<select multiple>` | _`Set`_                    |       | `SET`      | *                                                |
| `minLength`<br />`maxLength`                                 |                                       |                            |       |            |                                                  |
| `pattern`                                                    |                                       |                            |       |            |                                                  |
| `format`                                                     |                                       |                            |       |            |                                                  |
| `minimum`,<br />`exclusiveMinimum`<br />`maximum`<br />`exclusiveMaximum` |                                       |                            |       |            |                                                  |
| `multipleOf`                                                 |                                       |                            |       |            |                                                  |
| `required: string[]`                                         | `"required": boolean`                 | `{[property]?: T}`         |       | `NOT NULL` | `required: boolean`                              |
| `properties`                                                 |                                       |                            |       |            |                                                  |
| `propertyNames`                                              | -                                     | `K` for enum               |       | -          | ?-                                               |
| `minProperties`<br />`maxProperties`                         |                                       |                            |       |            |                                                  |
| `additionalProperties`                                       |                                       |                            |       | -          | - `Schema({}, {strict: true})`<br />+ `Map`+`of` |
| `items`                                                      |                                       |                            |       |            |                                                  |
| `minItems`<br />`maxItems`                                   |                                       |                            |       |            |                                                  |
| `uniqueItems`                                                |                                       |                            |       |            |                                                  |
| `additionalItems`                                            |                                       |                            |       |            |                                                  |

## Logical

| Schema         | TS                                                        |
| -------------- | --------------------------------------------------------- |
| `oneOf`        | `|`<br />[`oneOf`]((http://github.com/askirmas/ts-swiss)) |
| `anyOf`        | [`X | Y | X & Y` ](http://github.com/askirmas/ts-swiss)   |
| `allOf`        | `&`                                                       |
| `if then else` | `X extends C ? T : E`                                     |
| `dependencies` |                                                           |

## Controls

### Instance

| Schema                        | HTML                       | JS                           | TS            | MySQL                                                        |
| ----------------------------- | -------------------------- | ---------------------------- | ------------- | ------------------------------------------------------------ |
|                               |                            | `Object.create`<br />`Proxy` | `constructor` | Trigger/Insert                                               |
|                               |                            |                              |               | Trigger/Delete                                               |
|                               |                            |                              |               | Trigger/Update                                               |
| `writeOnly`                   | `"password"`               |                              |               |                                                              |
| `readOnly`                    | `"hidden"`<br />`disabled` | `Object.freeze`              | `Readonly`    | *[lock](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html) |
| `additionalProperties: false` |                            | `Object.seal`                |               |                                                              |



### Property

| Schema      | JS class                                                     | [JS Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) | TS                        | Mongoose                                               | MongoDB    | MySQL                                                        |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------- | ------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
| `writeOnly` |                                                              | `set %()`                                                    | `set %()`                 | `virtual`                                              |            |                                                              |
| `readOnly`  |                                                              | `get %()`<br />`writable`                                    | `get %()`<br />`readonly` | `immutable`<br />`virtual`                             |            | [`GENERATED`](https://dev.mysql.com/doc/refman/5.7/en/create-table-generated-columns.html) |
|             | `static`                                                     |                                                              | `static`                  |                                                        |            |                                                              |
|             | [`#%`](https://babeljs.io/docs/en/babel-plugin-proposal-private-methods) |                                                              | `private`                 |                                                        |            |                                                              |
|             |                                                              |                                                              | `protected`               |                                                        |            |                                                              |
| `default`   |                                                              | `value`                                                      |                           | [`default`](https://mongoosejs.com/docs/defaults.html) |            | `DEFAULT`                                                    |
|             |                                                              | `configurable`                                               |                           |                                                        |            |                                                              |
|             |                                                              | `enumerable`                                                 |                           |                                                        |            |                                                              |
| `$ref`      |                                                              |                                                              |                           | `ObjectId`                                             | `ObjectId` | `FOREIGN KEY`                                                |

### Method


## External Resources

- Schema `$ref`
- MySQL `foreignKey`
- Mongos `ObjectId`