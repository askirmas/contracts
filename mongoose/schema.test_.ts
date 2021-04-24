import odm, { Document, Schema, SchemaDefinition, SchemaOptions, tSchemaDefinition } from "mongoose"

// const blogShape = {
//   title:  {
//     type: "String"
//   },
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
//   }
// }

describe('first', () => {
  const NumberProps = Factory('NumberProps', {
    "Object": Number,
    "Number": "Number",
    "number": "number"
  }) 
  , doc = new NumberProps({
    "Object": 0,
    "Number": '0',
    "number": 0
  })
  
  it("first", () => expect(doc.validateSync()).toBe(undefined))
})

// additionalProperties: !SchemaOptions["strict"]
function Factory<T extends Document>(name: string, schema: tSchemaDefinition, options?: SchemaOptions) {
  return odm.model<T>(name, new Schema(schema as SchemaDefinition, options))
}