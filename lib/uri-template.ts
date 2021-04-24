import type { Payload, SchemaKeys, value } from "./uri-template.types"
import { configs } from "./uri-template.config"

type Action = ReturnType<typeof parseAction>

const {isArray: $isArray} = Array
, expParser = /\{([+#./;?&]?)([^\}]+)\}/g
, keyWithActionsParser = /^(.+)(\*|:(\d+))$/
, reserved = /[/!;,:]/g

export {
  stringify,
  parse
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify<UriTemplate extends string>(uriTemplate: UriTemplate, data: Payload<UriTemplate>): string
function stringify(uriTemplate: string, data: Payload<string>): string {
  return uriTemplate.replace(expParser, (_, schemaKey: keyof typeof configs, exp: string) => {
    const varSpecs: value[] = exp.split(",")
    , {length} = varSpecs
    , schema = configs[schemaKey]
    , {
      first = "",
      sep = ",",
      named = false,
      foremp =false,
      encode = false
    } = schema

    for (let i = length; i--;) {
      const action = parseAction(varSpecs[i] as string)
      , { key } = action
      , value_ = data[key as keyof typeof data]

      if (
        value_ === undefined
        || value_ === null
      ) {
        varSpecs[i] = undefined
        continue
      }

      const {
        last,
        explode
      } = action

      let value: value = undefined

      switch (typeof value_) {
        case "number": 
          value = value_
          break
        case "string":
          value = encoding(
            encode,
            last === undefined ? value_
            : value_.substring(0, last)
          )
          break
        case "object":
          if ($isArray(value_))
            value = encoding(encode, value_)
            .join(
              !explode ? ","
              : `${sep}${named ? `${key}=`: ""}`
            )
          else {
            const entries: string[] = []
            , kvDel = explode ? "=" : ","
  
            for (const key in value_)
              entries.push(`${
                key
              }${
                kvDel
              }${
                encode ? encoding(encode, value_[key]) : value_[key]
              }`)
  
            value = entries.join(explode ? sep : ",")
              
            if (value === "")
              value = undefined

            if (explode) {
              varSpecs[i] = value
              continue
            }
          }
      }

      varSpecs[i] = !named
      ? value
      : `${key}${
        value !== "" || foremp
        ? "="
        : ""
      }${value}`
    }

    const filtered = varSpecs.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 ? first : ""
    }${
      filtered.join(sep)
    }`
  })
}

function parse(uriTemplate: string, uri: string) {
  const $return: Payload<string> = {}

  let iter: ReturnType<RegExp["exec"]>
  , uriIndex = 0
  , preIndex = 0
  , hasExpressions = false

  while (iter = expParser.exec(uriTemplate)) {
    hasExpressions = true

    const {index, 1: schemaKey, 2: exp} = iter
    , conf = configs[schemaKey as SchemaKeys]
    , { first } = conf

    uriIndex += index - preIndex

    if (first !== "") {
      if (uri[uriIndex] !== first)
        continue

      uriIndex++
    }

    const exps = exp.split(",")
    , actions: Record<string, Action> = {}
    , {length} = exps

    for (let i = length; i--; ) {
      const action = parseAction(exps[i])
      actions[action.key] = action
    }

    const {
      sep,
      named
    } = conf
    , kvParser = new RegExp(`[^${sep}]+`, "g")
    
    kvParser.lastIndex = uriIndex

    let kv: ReturnType<RegExp["exec"]>

    while (kv = kvParser.exec(uri)) {
      const {0: record} = kv
      , eqPos = named ? record.indexOf("=") : -1
      , key = !named ? "..." : eqPos === -1 ? record : record.substr(0, eqPos)
      , value = !named ? record : eqPos === -1 ? "" : record.substr(1 + eqPos)

      $return[key] = value
    }
  }

  return hasExpressions ? $return : undefined
}

function parseAction(action: string) {
  const actionParsed = action.match(keyWithActionsParser)
  , key = actionParsed?.[1] ?? action
  , fn = actionParsed?.[2]
  , explode = fn === "*"
  , substrLast = actionParsed?.[3]

  return {
    key,
    explode,
    last: substrLast === undefined ? undefined : +substrLast
  }
}

function encoding(level: boolean, source: value): value
function encoding(level: boolean, source: value[]): value[] 
function encoding(level: boolean, source: value|value[]): value|value[] {
  if (source === undefined || source === null || typeof source === "number")
    return source
  if (typeof source === "string")
    return encodeComponent(level, source)
  
  const {length} = source
  , encoded: value[] = []

  for (let i = length; i--;) {
    const value = source[i]

    encoded[i] = typeof value !== "string"
    ? value
    : encodeComponent(level, value)
  }
    
  return encoded
}

function encodeComponent(level: boolean, input: string) {
  const encoded = encodeURI(input)

  if (!level)
    return encoded

  return encoded.replace(
    reserved,
    escaper
  )
}

function escaper(v: string) {
  return `%${v.charCodeAt(0).toString(16).toUpperCase()}`
}