/// <reference lib="dom" />

(definitions => JSON.stringify({
  "description": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
  "$schema": "http://json-schema.org/draft-07/schema",
  "oneOf": Object.keys(definitions).map(def => ({
    "$ref": `#/definitions/${def}`
  })),
  "definitions": Object.keys(definitions)
  .reduce((acc, def, i) => {
    const {"definitions": items} = definitions[def]
    , groupRefs = Object.keys(items)
    .map(itemKey => {
      const itemName = `${itemKey}`
      acc[itemName] = items[itemKey]
      return {"$ref": `#/definitions/${itemName}`}
    })

    acc[def] = {
      "anyOf": groupRefs.concat({
        "type": "number",
        "minimum": (i + 1) * 100,
        "maximum": (i + 2) * 100 - 1  
      })
    }

    return acc
  }, {})
}, null, 2))(
Object.fromEntries(
  $$('#wikiArticle > h2')
  .slice(0, 5)
  .map(({id, "textContent": group, nextElementSibling}) =>[
    id,
    {
      "definitions": Object.fromEntries(
        $$('dt', nextElementSibling)
        .map(({textContent, nextElementSibling: {"textContent": description}}) => {
          const code = +textContent.slice(0, 3)
          , name = textContent.slice(4).trim()
          , title = `${group}: ${name}`

          return [
            name.replace(/[\s\(\)]+/g, '_'),
            {
              "default": code,
              "enum": [
                code,
                name,
                title
              ],
              title,
              description
            }
          ]
        })
      )  
    }
  ])
)
)