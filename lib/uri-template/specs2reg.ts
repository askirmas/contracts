import type { Config } from "./types";
import { parseAction } from "./utils";

const errors = {
  "NotMatch": Error("Not match")
}

export type JsonSchema = {
  properties: {
    [property: string]: {
      type: "string"|"integer"
    }
  }
}

export {
  errors,
  groupBased
}

function groupBased(
  {
    sep = ",",
    foremp = false
  }: Partial<Config>,
  varSpecs: string,
  {properties}: JsonSchema
) {
  const tokens: string[] = []
  , specs = varSpecs.split(",")
  , {length} = specs
  , actioned = new Set<string>()

  for (let i = 0; i< length; i++) {
    const action = specs[i]
    , captured = actioned.has(action)
    , {key} = parseAction(action)
    , {type} = properties[key]
    

    tokens.push(
      `(${key}=${foremp ? "" : "?"}(${
        captured
        ? `\\k<${key}>`
        : `?<${key}>${
          type === "integer" ? "\\d*" : `[^${sep}]*`
        }`
      })(${sep}|$))?`
    )

    actioned.add(action)
  }

  const parser = new RegExp(`^${tokens.join("")}$`)
  , processor = (input: string) => {
    const groups = input.match(parser)?.groups
    
    if (groups === undefined)
      throw errors.NotMatch

    const out: Record<string, any> = {}

    for (const key in groups) {
      const value = groups[key]
      if (value === undefined)
        continue
      
      out[key] = properties[key].type === "integer" ? +value : value
    }

    return out
  }
  
  return processor
}
