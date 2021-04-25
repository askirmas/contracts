import type { Payload, SchemaKeys } from "./types"
import { configs, expParser } from "./consts"
import { escape4Regex } from "./encodes"
import type { Action } from "./utils"
import { parseAction } from "./utils"

export {
  parse,
  fullParser
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

function fullParser(uriTemplate: string) {
  const {length} = uriTemplate
  , chunks: any[] = []
  , expressions: [schemaKey: string, expression: string][] = []

  let parsed: ReturnType<RegExp["exec"]>
  , preEnd = 0

  while (parsed = expParser.exec(uriTemplate)) {
    const {index} = parsed
    if (index !== preEnd)
      chunks.push(`(?:${escape4Regex(
        uriTemplate.substring(preEnd, index)
      )})`)

    const {length} = parsed[0]
    , schemaKey = parsed[1]
    , expression = parsed[2]

    expressions.push([schemaKey, expression])
    chunks.push(`(${escape4Regex(schemaKey)}.+)?`)

    preEnd = index + length
  }

  if (preEnd < length)
    chunks.push(`(?:${escape4Regex(
      uriTemplate.substring(preEnd)
    )})`)

  return [
    new RegExp(`^${chunks.join("")}$`),
    expressions
  ] as const
}
