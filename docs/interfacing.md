## Resources

|         | HTTP | JS                      | TS      | CLI            | fs     | SQL        | noSQL      |
| ------- | ---- | ----------------------- | ------- | -------------- | ------ | ---------- | ---------- |
| Block   |      | module                  | `class` | Script Program | Folder | Table      | Collection |
| Element |      | `function`<br />`const` | `new`   | Command        | File   | Record Row | Document   |

## Compare

### Element

|                 | HTTP     | CLI    | fs        | SQL                        | Mongo  |
| --------------- | -------- | ------ | --------- | -------------------------- | ------ |
| Info            | OPTIONS  | --help | `.stat()` | DESCRIBE DESC<br />EXPLAIN |        |
| Create          | POST     |        |           | INSERT                     |        |
| Read            | GET HEAD |        |           | SELECT                     |        |
| Update (Save)   | PUT      |        |           | UPDATE                     |        |
| Update (Modify) | PATCH    |        |           | UPDATE                     | `$set` |
| Delete          | DELETE   |        |           | DELETE                     |        |

