const leads = new Set([
 "#",
 ".",
 "/"
] as const)
, delimiters = new Set([
  "/",
  "."
] as const)

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(uri: string, data: Record<string, unknown>) {
  const parser = new RegExp(/\{([+#./?&]?)([^\}]+)\}/g)
  
  return uri.replace(parser, (_, schema, exp: string) => {
    const keys = exp.split(",")
    , {length} = keys

    for (let i = length; i--;) {
      const key = keys[i]
      // @ts-expect-error
      keys[i] = !(key in data)
      ? key
      : data[key]
    }
    
    const filtered = keys.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 && leads.has(schema) ? schema : ""
    }${
      filtered.join(
        !delimiters.has(schema) ? "," : schema
      )
    }`
  })
}

