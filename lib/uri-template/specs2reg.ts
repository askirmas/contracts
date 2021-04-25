import type { Config } from "./types";

export type JsonSchema = {
  properties: {
    [property: string]: {
      type: "string"|"integer"
    }
  }
}

export {
  groupBased as groupBased  
}

function groupBased(
  {
    sep = ",",
    foremp = false
  }: Partial<Config>,
  _: string,
  {properties}: JsonSchema
) {
  const tokens: string[] = []

  for (const key in properties) {
    const {type} = properties[key]

    tokens.push(
      `((?:${key}=${foremp ? "" : "?"})(?<${key}>${
        type === "integer" ? "\\d+" : `[^${sep}]+`
      })?(?:${sep}|$))?`
    )
  }

  const parser = new RegExp(`^${tokens.join("")}$`)
  , processor = (input: string) => {
    const groups = input.match(parser)?.groups
    
    if (groups === undefined)
      throw Error("Not match")

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
