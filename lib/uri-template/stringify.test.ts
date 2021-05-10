import { stringify } from "./stringify";

describe(stringify.name, () => {
  describe("select", () => {
    const config = {
      "<SELECT>": {
        "first": "SELECT ",
        "named": true,
        "sep": ", ",
        "valuefirst": true,
        "del": " AS ",
        "foremp": false,
        "encode": false
      },
    }

    it("1", () => expect(stringify(
      config,
      '{<SELECT>select*}',
      {
        "select": {
          "id": "",
          "name": "`user`.`firstname`"
        }
      }
    )).toBe("SELECT id, `user`.`firstname` AS name"))
  })
})