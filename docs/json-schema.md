[[_TOC_]]

## Core

| 2019-09                                        | 07            | 04     |
| ---------------------------------------------- | ------------- | ------ |
| `$schema`                                      | .             | .      |
| `$id`<br />`$anchor`<br />_`$recursiveAnchor`_ | `$id`         | `id`   |
| _`$recursiveRef`_                              | `$ref`        | `$ref` |
| `$defs`                                        | `definitions` |        |
| `$vocabulary`                                  | -             | -      |

## [Meta](https://json-schema.org/understanding-json-schema/reference/generic.html)

| 2019-09                                | 07                                                           | 04   |
| -------------------------------------- | ------------------------------------------------------------ | ---- |
| `title`                                | .                                                            |      |
| `description`                          | .                                                            |      |
| `$comment`                             | .                                                            | -    |
| `deprecated`                           |                                                              |      |
| `contentEncoding`<br />`contentSchema` | [.](https://json-schema.org/understanding-json-schema/reference/non_json_data.html) | -    |
|                                        | `examples`                                                   | -    |
|                                        | `default`                                                    |      |
|                                        | `readOnly`<br />`writeOnly`                                  |      |



## Logical

| 2019-09                                      | 07                                                           | 04   |
| -------------------------------------------- | ------------------------------------------------------------ | ---- |
| `anyOf`<br />`allOf`<br />`oneOf`<br />`not` | .                                                            | .    |
| `if`-`then`-`else`                           | [.](https://json-schema.org/understanding-json-schema/reference/conditionals.html) | -    |
| `maxContains`<br />`minContains`             | -?                                                           |      |
| `enum`                                       | .                                                            | .    |
| `const`                                      | .                                                            | -*   |

## Type specific

### `number`

| 2019-09 | 07                                         | 04   |
| ------- | ------------------------------------------ | ---- |
|         | `multipleOf`                               |      |
|         | `minimum`<br />`maximum`                   |      |
|         | `exclusiveMinimum`<br />`exclusiveMaximum` |      |

### `string`

| 2019-09 | 07                           | 04   |
| ------- | ---------------------------- | ---- |
|         | `minLength`<br />`maxLength` |      |
|         | `pattern`                    |      |



#### [`format`](https://json-schema.org/understanding-json-schema/reference/string.html)

| 2019-09    | 07 | 04 |
| ---------- | - | - |
|            | `date-time`<br />`date`<br />`time` | |
| | `email`<br />`idn-email` | |
| | `hostname`<br />`idn-hostname` | |
| | `ipv4`<br />`ipv6` | |
| | `uri`<br />`uri-reference`<br />`iri`<br />`iri-reference` | `uri*` |
| | `uri-template` |  |
| | `json-pointer`<br />`relative-json-pointer` |  |
| | `regex` | - |
| `duration` | - | |
| `uuid`     | - | |

### `array`

| 2019-09 | 07                         | 04   |
| ------- | -------------------------- | ---- |
|         | `items`                    |      |
|         | `additionalItems`          |      |
|         | `contains`                 | -    |
|         | `minItems`<br />`maxItems` |      |
|         | `uniqueItems`              |      |



### `object`

| 2019-09                                     | 07                                     | 04   |
| ------------------------------------------- | -------------------------------------- | ---- |
|                                             | `properties`                           |      |
|                                             | `patternProperties`                    |      |
|                                             | `required`                             |      |
|                                             | `propertyNames`                        | -    |
|                                             | `minProperties`<br />`maxProperties`   |      |
|                                             | `additionalProperties`                 |      |
| `dependentSchemas`<br />`dependentRequired` | `dependencies`<br />`dependencies`@`#` |      |
| `unelavatedProperties...`                   | -                                      |      |

## Hyper

| 2019-09                                                      | 07                                                           | 04                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------ |
|                                                              | [`describedBy`<br />`schema`<br />~~`profile`~~](https://json-schema.org/draft-07/json-schema-release-notes.html#linking-instances-and-schemas) | `describedBy`<br />`schema`<br />`profile` |
| URI Template resolved as for the 'href' keyword in the Link Description Object.  The resulting URI Reference is resolved against the current URI base and sets the new URI base for URI references within the instance | `base`                                                       |                                            |
|                                                              | `links`                                                      |                                            |

## `links`

|                                                              | 07                                                       |
| ------------------------------------------------------------ | -------------------------------------------------------- |
|                                                              | `title`<br />`description`<br />`$comment`               |
| Relation to the target resource of the link                  | `rel`                                                    |
| A URI template, as defined by RFC 6570<br />A schema for validating user input to the URI template, where the input is in the form of a JSON object with property names matching variable names in \"href\" | `href`<br />`hrefSchema`                                 |
|                                                              | `anchor`<br />`anchorPointer`                            |
|                                                              | `templatePointers`<br />`templateRequired`               |
| JSON Schema describing the link target<br />Media type (as defined by RFC 2046) describing the link target | `targetSchema`<br />`targetMediaType`<br />`targetHints` |
|                                                              | `headerSchema`                                           |
| Schema describing the data to submit along with the request<br />The media type in which to submit data along with the request | `submissionSchema`<br />`submissionMediaType`            |



## External Resources

- 04 http://json-schema.org/draft-04/schema
- 06 http://json-schema.org/draft-06/schema
- 07 http://json-schema.org/draft-07/schema

- 04 -> 06 https://json-schema.org/draft-06/json-schema-release-notes.html

- 06 -> 07 https://json-schema.org/draft-07/json-schema-release-notes.html

