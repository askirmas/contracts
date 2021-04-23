const delimiters = new Set(["/"])

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(uri: string, data: Record<string, unknown>) {
  const parser = new RegExp(/\{([+#./?&]?)([^\}]+)\}/g)
  
  return uri.replace(parser, (_, schema, exp) => {
    const keys = exp.split(",")
    , {length} = keys
    , delSpecial = delimiters.has(schema) 
    , delimiter = delSpecial ? schema : ","

    for (let i = length; i--;) {
      const key = keys[i]
      keys[i] = !(key in data)
      ? key
      : data[key] ?? ""
    }
    
    return `${
      delSpecial ? delimiter : ""
    }${
      keys.join(delimiter)
    }`
  })
}

