## areas

### href
- `"anchor"` identifies the link's context
- `"href"
   1. `"posts/{id}"`
   2. `"/users{?cursor}"`
- `"hrefSchema"`
   1. `{"id": {"$ref": "#/properties/id"}}`
- `"templateRequired"`
   1. `["id"]`
   2. `["cursor"]`
- `"templatePointers"`
   1. `"cursor": "/pagination/next_page_cursor"`
   2. `"childId": "0"`

### target
- `”targetMediaType"`
   1. `"application/json"`
- `"targetSchema": { "$ref": "#"}`
- `”targetHints"`
   1. `"allow": ["GET", "DELETE"]`
   2. `"allow": ["PATCH”], "accept-patch": ["application/merge-patch+json"]`
   3. `"allow": ["PATCH"], "accept-patch": ["application/vnd.api+json"]`

### submission
- `"submissionMediaType"`
   1. `"application/json"`
   2. `"multipart/alternative; boundary=ab2"`
- `"submissionSchema": {...}`

### header
- `"headerSchema"`
   1. `{"if-modified-since": { ... }}`

### etc?
- anchor: uri-template
- anchorPointer: json-pointer | relative-json-pointer
- "contextUri": "https://api.example.com/stuff"
- "contextPointer": "",
- "hrefInputTemplates": string[]
- "hrefPrepopulatedInput": flat object with props for hrefInputTemplates
- "attachmentPointer": ""

## docs

## etc
- "application/problem+json" https://json-schema.org/draft-07/json-schema-hypermedia.html#RFC7807

## class based

|                       | req.body                                                     | req.opts         | res.data      | obj       | class |
| --------------------- | ------------------------------------------------------------ | ---------------- | ------------- | --------- | ----- |
| POST /{entity}        | `ConstructorParameters<Entity>`<br />| `Omit<Entity, “readonly”>` | <-               | `Entity`      | .create   | `new` |
| GET /{entity}         | -                                                            | query+projection | `Entity[]`    | .findMany |       |
| PUT /{entity}/{id}    | `Omit<Entity, “readonly”>`                                   | -                | -             | .save     |       |
| GET /{entity}/{id}    | -                                                            | projection       | `Entity`      | .findById |       |
| DELETE /{entity}/{id} | -                                                            | ?conditions      | - \| `Entity` | .delete   |       |

## Resources

- https://json-schema.org/draft-07/json-schema-hypermedia.html

- https://json-schema.org/draft-07/json-hyper-schema-release-notes.html

- https://json-schema.org/draft/2019-09/json-schema-hypermedia.htm

- https://tools.ietf.org/id/draft-handrews-json-schema-hyperschema-00.html

- https://www.iana.org/assignments/media-types/media-types.xhtml

  