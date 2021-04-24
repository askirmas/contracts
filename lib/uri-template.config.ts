import type {SchemaKeys, Config} from "./uri-template.types"

const configs: Record<SchemaKeys, Partial<Config>>= {
  "":  {                                                          "encode": true},
  "+": {                                                                        },  
  ".": {"first": ".", "sep": ".",                                 "encode": true},
  "/": {"first": "/", "sep": "/",                                 "encode": true},
  ";": {"first": ";", "sep": ";", "named": true ,                 "encode": true},  
  "?": {"first": "?", "sep": "&", "named": true , "foremp": true, "encode": true},
  "&": {"first": "&", "sep": "&", "named": true , "foremp": true, "encode": true},
  "#": {"first": "#",                             "foremp": true,               },
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
  configs,
}
