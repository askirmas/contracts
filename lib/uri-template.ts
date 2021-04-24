const schemas: Record<string, undefined|Partial<{
  "lead": string
  "delimiter": string
  "withKeys": boolean
  "kvOnEmpty": boolean
}>>= {
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
  },
  "?": {
    "lead": "?",
    "delimiter": "&",
    "withKeys": true,
    "kvOnEmpty": true,
  },
  "&": {
    "lead": "&",
    "delimiter": "&",
    "withKeys": true,
    "kvOnEmpty": true,
  },
  ";": {
    "lead": ";",
    "delimiter": ";",
    "withKeys": true,
    "kvOnEmpty": false,
  }  
}

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(uri: string, data: Record<string, unknown>) {
  const parser = new RegExp(/\{([+#./;?&]?)([^\}]+)\}/g)
  
  return uri.replace(parser, (_, schemaKey, exp: string) => {
    const keys: (string|null|undefined)[] = exp.split(",")
    , {length} = keys
    , schema = schemas[schemaKey] ?? {}
    , {
      lead = "",
      delimiter = ",",
      withKeys = false,
      kvOnEmpty = false
    } = schema

    for (let i = length; i--;) {
      const key = keys[i] as string
      , value = data[key]

      if (
        value === undefined
        || value === null
        || !withKeys
      ) {
        //@ts-expect-error
        keys[i] = value
        continue
      }

      keys[i] = `${key}${
        !kvOnEmpty && value === "" 
        ? ""
        : `=${value}`
      }`
    }

    const filtered = keys.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 ? lead : ""
    }${
      filtered.join(delimiter)
    }`
  })
}

