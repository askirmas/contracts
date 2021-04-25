import { keyWithActionsParser } from "./consts"

export type Action = ReturnType<typeof parseAction>

export {
  parseAction
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
