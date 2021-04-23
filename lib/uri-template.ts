const delimiters = new Set([
  "/",
  ".",
  "#"
])

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(uri: string, data: Record<string, unknown>) {
  const parser = new RegExp(/\{([+#./?&]?)([^\}]+)\}/g)
  
  return uri.replace(parser, (_, schema, exp: string) => {
    const keys = exp.split(",")
    , {length} = keys
    , delSpecial = delimiters.has(schema) 
    , delimiter = delSpecial ? schema : ","

    for (let i = length; i--;) {
      const key = keys[i]
      // @ts-expect-error
      keys[i] = !(key in data)
      ? key
      : data[key]
    }
    
    const filtered = keys.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 && delSpecial ? delimiter : ""
    }${
      filtered.join(delimiter)
    }`
  })
}

