import type {SchemaKeys, Config} from "./types"

const regexEscape = new RegExp(`[\\${
  "-[]/{}()*+?.\\^$|"
  .split("")
  .join("\\")
}]`, "g")
, reserved = /[/!;,:]/g
, expParser = /\{([+#./;?&]?)([^\}]+)\}/g
// TODO replace `.+` with var pattern and without `^$`
, keyWithActionsParser = /^(.+)(\*|:(\d+))$/
// , expSplit = /(?:(\{[+#./;?&]?[^\}]+\}))/
, configs: Record<SchemaKeys, Partial<Config>>= {
  "":  {                                                                      "encode": true},
  "+": {                                          "del": "=",                               },  
  ".": {"first": ".", "sep": ".",                 "del": "=",                 "encode": true},
  "/": {"first": "/", "sep": "/",                 "del": "=",                 "encode": true},
  ";": {"first": ";", "sep": ";", "named": true , "del": "=",                 "encode": true},  
  "?": {"first": "?", "sep": "&", "named": true , "del": "=", "foremp": true, "encode": true},
  "&": {"first": "&", "sep": "&", "named": true , "del": "=", "foremp": true, "encode": true},
  "#": {"first": "#",                             "del": "=", "foremp": true,               },
}

// "":  {"first": "" , "sep": ",", "named": false, "ifemp": "" , "allow": false},
// "+": {"first": "" , "sep": ",", "named": false, "ifemp": "" , "allow": true },
// ".": {"first": ".", "sep": ".", "named": false, "ifemp": "" , "allow": false},
// "/": {"first": "/", "sep": "/", "named": false, "ifemp": "" , "allow": false},
// ";": {"first": ";", "sep": ";", "named": true , "ifemp": "" , "allow": false},
// "?": {"first": "?", "sep": "&", "named": true , "ifemp": "=", "allow": false},
// "&": {"first": "&", "sep": "&", "named": true , "ifemp": "=", "allow": false},
// "#": {"first": "#", "sep": ",", "named": false, "ifemp": "=", "allow": true }

export {
  regexEscape,
  reserved,
  configs,
  expParser,
  keyWithActionsParser
}
