// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
[...document.querySelectorAll("h2[id]:not(#contributing):not(see_also)")]
.map(({textContent: group, nextElementSibling}) =>
  [...nextElementSibling.querySelectorAll("dt")]
	.map(
    dt => {
      const {nextElementSibling: {textContent: title}} = dt
      , {href, textContent: name} = dt.querySelector("a")
      , $return = {
        name,
        href,
        group,
        title
      }
      , classList = [...new Set(
        [...dt.querySelectorAll("svg")]
        .map(({classList}) => [...classList])
        .flat()
      )]

      classList?.forEach(className => {
        if (className === "icon")
          return
        $return[className] = true
      })


      return $return
    }
  )
)
.flat()
.reduce(
  (schema, {name, href, group, title, ...etc}) => {
    const $id = name.toLowerCase()
    , header = {
      const: $id,
      title: `[${group}] ${title} ${href}`,
      ...etc
    }

    schema.definitions[$id] = header
    schema.oneOf.push({$ref: `#/definitions/${$id}`})
    return schema
  },
  {
    oneOf: [],
    definitions: {}
  }
)
