
// https://www.iana.org/assignments/link-relations/link-relations.xhtml
[...document.querySelectorAll('table > tbody > tr')]
.map(
  /** @returns {[string, Record<string, any>]} */
  ({children: {
    0: {textContent: value},
    1: {textContent: title},
    3: {textContent: notes},
    2: {childNodes}
  }
  }) => [value, {
    "const": value,
    title,
    description: `${
      notes
    }${
      notes ? " " : ""
    }${
      [...childNodes]
      .map(el =>
        el.nodeType === 3
        ? el.textContent?.replace(/(\[|\])/, "")
        : el.href
      )
      .filter(Boolean)
      .join("")
    }`
  }]
)
.reduce((acc, [key, schema]) => {
  const {enum: $enum, definitions} = acc
  
  $enum.push(key)
  definitions[key] = schema

  return acc
}, {
  "title": document.querySelector('h1')?.textContent,
  "description": location.href,
  "type": "string",
  /** @type {string[]} */
  "enum": [],
  /** @type {Record<string, Record<string, any>>} */
  "definitions": {}
})