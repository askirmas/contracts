import { escapeVar } from "./encodes";
import type { Config } from "./types";
import { Action, parseAction } from "./utils";

const errors = {
  "NotMatch": Error("Not match")
}

export type JsonSchema = {
  properties: {
    [property: string]: {
      type: "string"|"integer"|"array"
    }
  }
}

export {
  errors,
  groupBased
}

function groupBased(
  {
    named,
    sep,
    foremp
  }: Config,
  varSpecs: string,
  schema: JsonSchema
) {
  const {properties} = schema
  , tokens: string[] = []
  , specs = varSpecs.split(",")
  , {length} = specs
  , group2action = new Map<string, Action>()

  for (let i = 0; i < length; i++) {
    const spec = specs[i]
    , escaped = escapeVar(spec)
    , captured = group2action.has(escaped)

    let action: Action
    if (captured)
      action = group2action.get(escaped)!
    else {
      action = parseAction(spec)
      group2action.set(escaped, action)
    }

    const {
      key,
      last
    } = action
    , {
      type
    } = properties[key]
    , keyInPattern = !named ? "" : `${key}=${foremp ? "" : "?"}`
    , charPattern = `[^${sep}]`
    , endPattern = `(${sep}|$)`
    , groupPattern = captured ? `\\k<${escaped}>`
    : `?<${escaped}>${
      type === "integer"
      ? "\\d+"
      : `${charPattern}${
        last === undefined ? "*" : `{0,${last}}`
      }`
    }`

    tokens.push(
      `(${keyInPattern}(${groupPattern})${endPattern})?` // ?? vs ?
    )
  }

  const config2proc = {sep}

  return (input: string) => processor(
    input,
    schema,
    config2proc,
    new RegExp(`^${tokens.join("")}$`),
    group2action
  )
}

function processor(
  input: string,
  {properties}: JsonSchema,
  _: Pick<Config, "sep">,
  parser: RegExp,
  escapes: Map<string, Action>,
) {
  const groups = input.match(parser)?.groups
    
  if (groups === undefined)
    throw errors.NotMatch

  const out: Record<string, any> = {}

  for (const groupName in groups) {
    const value = groups[groupName]

    if (value === undefined)
      continue
    
    const {
      key,
      // explode
    } = escapes.get(groupName)!
    , {type} = properties[key]
    
    switch (type) {
      case "integer": 
        out[key] = +value
        break
      case "array":
        out[key] = value.split(
          /* explode
           ? `${sep}${key}=`
          :*/ ","
        )
        break
      default:
        out[key] = value    
    }
  }

  return out  
}