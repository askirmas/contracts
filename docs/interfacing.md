## Resources

|         | HTTP | JS                      | TS      | CLI            | fs     | SQL        | noSQL      |
| ------- | ---- | ----------------------- | ------- | -------------- | ------ | ---------- | ---------- |
| Block   |      | module                  | `class` | Script Program | Folder | Table      | Collection |
| Element |      | `function`<br />`const` | `new`   | Command        | File   | Record Row | Document   |

## Compare

| C/D  | HTTP Method | [Mongo](http://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html) | Mongoose                                                     | SQL  |
| ---- | ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| D    | HEAD        | [...](https://stackoverflow.com/a/47671042/9412937)          | `"createdAt"`<br />`ObjectId.getTimestamp()`<br />`"updatedAt"` |      |
| D    | GET         | `.findOne`<br />`"projection"`                               |                                                              |      |
| D    | OPTIONS     |                                                              |                                                              |      |
| D    | POST        |                                                              |                                                              |      |
| D    | PUT         | `.replaceOne`<br />`.findOneAndReplace`                      | `findOneAndUpdate`                                           |      |
| D    | PATCH       | `.updateOne`<br />`.findOneAndUpdate`                        | `new: true`                                                  |      |
| D    | DELETE      | `.deleteOne`<br />`.findOneAndDelete`                        |                                                              |      |
|      | HEAD        |                                                              |                                                              |      |
|      | GET         | `.find`                                                      |                                                              |      |
|      | OPTIONS     |                                                              |                                                              |      |
|      | POST        | `.insertOne`                                                 |                                                              |      |
|      | PUT         |                                                              |                                                              |      |
|      | PATCH       |                                                              |                                                              |      |
|      | DELETE      |                                                              |                                                              |      |


### Element

|                 | HTTP     | CLI    | fs        | SQL                        | Mongo  |
| --------------- | -------- | ------ | --------- | -------------------------- | ------ |
| Info            | OPTIONS  | --help | `.stat()` | DESCRIBE DESC<br />EXPLAIN |        |
| Create          | POST     |        |           | INSERT                     |        |
| Read            | GET HEAD |        |           | SELECT                     |        |
| Update (Save)   | PUT      |        |           | UPDATE                     |        |
| Update (Modify) | PATCH    |        |           | UPDATE                     | `$set` |
| Delete          | DELETE   |        |           | DELETE                     |        |

