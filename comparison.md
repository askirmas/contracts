## Types

| Schema     | HTML | JS          | TS                                             | JSDoc | MySQL                                                        | mongoose                   |
| ----------- | ---------- | ---------------------------------------------- | ----- | ------------------------------------------------------------ | -------------------------- | ---------- |
| -          |           | `undefined` | `undefined`                                    |       |                                                              |                            |
| -          |           | -           | `never`                                        |       |                                                              |                            |
| `null`     |      | _`object`_  | `null`                                         |       |                                                              |                            |
| `boolean`  | `checkbox` | `boolean`   | `                                              |       | `TINYINT`                                                    | `Boolean`*                 ||||
| `integer`  | `number`<br />`range` | _`number`_  | _`number`_                                     |       | `INTEGER`<br>`INT`<br/>`SMALLINT`<br/>`MEDIUMINT`<br/>`BIGINT`<br />`BIT` |                            |
| `number`   | `number`<br />`range` | `number`    | `number`                                       |       | `DECIMAL`<br/>`NUMERIC`<br/>`FLOAT`<br/>`DOUBLE`             | `Number`<br />`Decimal128` |
| _`string`_ |  | _`string`_  | _`string`_                                     |       | `CHAR`                                                       |                            |
| `string`   | `text`<br />`search`<br />`url` | `string`    | `string`                                       |       | `VARCHAR`                                                    | `String`                   |
|            | `file`<br />`image` |             |                                                |       | `BINARY`<br />`VARBINARY`<br />`BLOB`            | ?`Buffer`                  |
| | `<textarea>` | | | | `TEXT` |  |
|            | `date`<br />`datetime`<br />`datetime-local`<br />`month`<br />`week`<br />`time` |             |                                                |       | `DATE`<br />`DATETIME`<br />`TIMESTAMP`<br />`TIME`<br />`YEAR` | `Date`                     |
| `object`   |    | `object`    | `{ ... }`<br />`Record<K,V>`<br />~~`object`~~ |       | `JSON`                                                       | `Map`<br />`Schema` |
| `array`    |     | _`object`_  | `T[]`<br />`Array<T>`                          |       | `JSON`                                                       |                            |
|            |            | `symbol`    | `symbol`                                       |       |                                                              |                            |
|            |            | `function`  | `(...args: any[]) => any`                      |       |                                                              |                            |
| `: true`,`: {}` |  | -           | `any`, `unknown`                               |       |                                                              | `Mixed`                    |

## Falsy and truthy

- Mongoose: `['false', 0, '0', 'no']`,  `['true', 1, '1', 'yes']`
- JS: `[undefined, null, '', 0]` , all other

## Logical
| Schema                 | HTML                             | JS   | TS                         | JSDoc | MySQL      | mongoose            |
| ---------------------- | -------------------------------- | ---- | -------------------------- | ----- | ---------- | ------------------- |
| `enum`                 | `<select>`                       | *    | `enum`, consts conjunction |       | `ENUM`     | `enum`              |
| *                      | `radio`<br />`<select multiple>` |      |                            |       | `SET`      |                     |
| `required: string[]`   | `required: boolean`              |      | `{[property]?: T}`         |       | `NOT NULL` | `required: boolean` |
| `propertyNames`        | -                                | -    | `K` for enum               |       | -          | ?-                  |
| `additionalProperties` |                                  |      |                            |       |            | `Map`+`of`          |




## Reference

- Schema `$ref`
- MySQL `foreignKey`
- Mongoose `ObjectId`