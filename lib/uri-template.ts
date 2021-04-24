export type AllowedObject<K extends string = string> = Record<K,
  null
  |string|number
  |(string|number)[]
  |Record<string, string|number>
>

const {isArray: $isArray} = Array
, schemas: Record<string, undefined|Partial<{
  "lead": string
  "delimiter": string
  "withKeys": boolean
  "kvOnEmpty": boolean
  "encode": boolean
}>>= {
  "": {
    "encode": true
  },
  "+": {
    "encode": false
  },  
  ".": {
    "lead": ".",
    "delimiter": ".",
    "encode": false
  },
  "/": {
    "lead": "/",
    "delimiter": "/",
    "encode": true
  },
  ";": {
    "lead": ";",
    "delimiter": ";",
    "withKeys": true,
    "kvOnEmpty": false,
    "encode": false
  },  
  "#": {
    "lead": "#",
    "encode": false
  },
  "?": {
    "lead": "?",
    "delimiter": "&",
    "withKeys": true,
    "kvOnEmpty": true,
    "encode": false
  },
  "&": {
    "lead": "&",
    "delimiter": "&",
    "withKeys": true,
    "kvOnEmpty": true,
    "encode": false
  },
}

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(
  uri: string,
  data: AllowedObject
) {
  const expParser = /\{([+#./;?&]?)([^\}]+)\}/g
  , keyWithActionsParser = /^(.+)(\*|:(\d+))$/

  return uri.replace(expParser, (_, schemaKey, exp: string) => {
    const keys: (number|string|null|undefined)[] = exp.split(",")
    , {length} = keys
    , schema = schemas[schemaKey] ?? {}
    , {
      lead = "",
      delimiter = ",",
      withKeys = false,
      kvOnEmpty = false,
      encode = false
    } = schema

    for (let i = length; i--;) {
      const action = keys[i] as string
      , actionParsed = action.match(keyWithActionsParser)
      , key = actionParsed?.[1] ?? action
      , value_ = data[key]

      if (
        value_ === undefined
        || value_ === null
      ) {
        keys[i] = value_
        continue
      }

      const fn = actionParsed?.[2]
      , substrLast = actionParsed?.[3]

      let value: string|number = ""

      switch (typeof value_) {
        case "number": 
          value = value_
          break
        case "string":
          value = encoding(
            encode,
            substrLast === undefined ? value_
            : value_.substring(0,
              //@ts-expect-error
              substrLast
          ))
          break
        case "object":
          if ($isArray(value_)) {
            value = encoding(encode, value_)
            .join(
              fn !== "*"
              ? ","
              : `${delimiter}${withKeys ? `${key}=`: ""}`
            )
            break
          }
          break
      }

      if (!withKeys) {
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

function encoding(level: boolean, source: number|string): number|string
function encoding(level: boolean, source: (number|string)[]): (number|string)[] 
function encoding(level: boolean, source: number|string|(number|string)[]): number|string|(number|string)[] {
  if (typeof source === "number")
    return source
  if (typeof source === "string")
    return encodeComponent(level, source)

  const {length} = source
  , encoded = new Array<string|number>(length)

  for (let i = length; i--;) {
    const value = source[i]
    encoded[i] = typeof value !== "string"
    ? value
    : encodeComponent(level, value)
  }
    
  return encoded
}

function encodeComponent(level: boolean, input: string) {
  // if (typeof input === "number")
  //   return input
  
  return input.replace(
    level === false
    ? /[% ;]/g
    : /[% ;:/!]/g,
    v => `%${v.charCodeAt(0).toString(16).toUpperCase()}`
  )

}