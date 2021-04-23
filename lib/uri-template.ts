export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(uri: string, data: Record<string, unknown>) {
  const parser = new RegExp(/\{([+#./?&]?)([^\}]+)\}/g)
  
  return uri.replace(parser, (_, __, exp) => {
    const keys = exp.split(",")
    , {length} = keys

    for (let i = length; i--;) {
      const key = keys[i]
      keys[i] = !(key in data)
      ? key
      : data[key] ?? ""
    }
    
    return keys.join(",")
  })
}

