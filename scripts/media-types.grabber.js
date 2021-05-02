// https://www.iana.org/assignments/media-types/media-types.xhtml
[{
  $id: "*/*",
  href: "https://www.iana.org/assignments/media-types/media-types.xhtml"
}].concat(
  [...document.querySelectorAll("table[id]")]
  .map(table => {
    const family = table.id.substring("table-".length)
    
    return [
      {
        $id: `${family}/*`,
        href: `https://www.iana.org/assignments/media-types/media-types.xhtml#${family}`
      }
    ].concat(
      [...table.querySelectorAll("tbody tr")]
      .map(({children: {0: {textContent: name}, 1: template, 2: reference}}) => {
        const {
          href,
          textContent: $id = `${family}/${name}`
        } = template.querySelector("a") ?? {}
        , references = [...reference.querySelectorAll("a:not([href^='#'])")].join(" ")

        return {
          $id,
          href,
          references
        }
      })
    )
  })
)
.flat()
.reduce(
  (schema, {$id, href, references}) => {
    const key = $id.replace(/\//g, "--")
    , mediaType = {
      const: $id,
      ...href && {title: href},
      ...references && {description: references}
    }

    schema.definitions[key] = mediaType
    schema.oneOf.push({$ref: `#/definitions/${key}`})
    
    return schema
  },
  {
    oneOf: [],
    definitions: {}
  }
)