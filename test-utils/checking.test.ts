import { desc, tscompare } from "./checking"

it("", () => expect(1).toBe(1))

desc("Object comparison", () => {
  tscompare<{}, {a?: string}>("<")

  tscompare<{
    readonly a: string
  }, {
    a: string
  }>("<")

  tscompare<
    Readonly<{a: string}>,
    {a: string}
  >("<")
})
