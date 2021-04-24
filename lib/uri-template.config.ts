const schemas: Record<string, undefined|Partial<{
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
  },  
  ".": {
    "lead": ".",
    "delimiter": ".",
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
  },
  "&": {
    "lead": "&",
    "delimiter": "&",
    "withKeys": true,
    "kvOnEmpty": true,
  },
}
export {schemas}