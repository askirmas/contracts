import type { AllowedObject } from "./uri-template.types"
import { configs } from "./uri-template.config"

const {isArray: $isArray} = Array
, expParser = /\{([+#./;?&]?)([^\}]+)\}/g
, keyWithActionsParser = /^(.+)(\*|:(\d+))$/
, escapes = [
  /[% ;,]/g,
  /[% ;,:/!]/g
] as const

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(
  uri: string,
  data: AllowedObject
) {
  return uri.replace(expParser, (_, schemaKey: keyof typeof configs, exp: string) => {
    const keys: (number|string|null|undefined)[] = exp.split(",")
    , {length} = keys
    , schema = configs[schemaKey] ?? {}
    , {
      first = "",
      sep = ",",
      named = false,
      foremp =false,
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
              : `${sep}${named ? `${key}=`: ""}`
            )
            break
          }

          const entries: string[] = []
          , kvDel = fn === "*" ? "=" : ","

          for (const key in value_)
            entries.push(`${
              key
            }${
              kvDel
            }${
              encoding(encode, value_[key])
            }`)

          keys[i] = entries.join(sep)
          continue
      }

      if (!named) {
        keys[i] = value
        continue
      }

      keys[i] = `${key}${
        value !== "" || foremp
        ? "="
        : ""
      }${value}`
    }

    const filtered = keys.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 ? first : ""
    }${
      filtered.join(sep)
    }`
  })
}

function encoding(level: boolean, source: number|string): number|string
function encoding(level: boolean, source: (number|string)[]): (number|string)[] 
function encoding(level: boolean, source: number|string|(number|string)[]): number|string|(number|string)[] {
  switch(typeof source) {
    case "number":
      return source
    case "string":
      return encodeComponent(level, source)
  }

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
  return input.replace(
    escapes[level ? 1 : 0],
    escaper
  )
}

function escaper(v: string) {
  return `%${v.charCodeAt(0).toString(16).toUpperCase()}`
}