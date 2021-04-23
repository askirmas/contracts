const schemas: Record<string, undefined|Partial<Record<"lead"|"delimiter",string>>>= {
  "/": {
    "lead": "/",
    "delimiter": "/",
  },
  ".": {
    "lead": ".",
    "delimiter": "."
  },
  "#": {
    "lead": "#"
  }
}

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(uri: string, data: Record<string, unknown>) {
  const parser = new RegExp(/\{([+#./?&]?)([^\}]+)\}/g)
  
  return uri.replace(parser, (_, schemaKey, exp: string) => {
    const keys = exp.split(",")
    , {length} = keys
    , schema = schemas[schemaKey]

    for (let i = length; i--;) {
      const key = keys[i]
      // @ts-expect-error
      keys[i] = !(key in data)
      ? key
      : data[key]
    }
    
    const filtered = keys.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 && schema?.lead || ""
    }${
      filtered.join(
        schema?.delimiter ?? ","
      )
    }`
  })
}

