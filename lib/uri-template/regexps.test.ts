import { integerPattern } from "./regexps"

const {stringify: $stringify} = JSON
, {fromEntries: $fromEntries} = Object

describe("integer", () => {
  itMatch("any", integerPattern(), [0, "0", 1, -1], ["-0", 0.1])
  itMatch(">=0", integerPattern({minimum: 0}), [2, 1, 0], [-1, -2])
  itMatch(">=0.5", integerPattern({minimum: 0.5}), [2, 1], [0, -1, -2])
  itMatch(">=1", integerPattern({minimum: 1}), [2, 1], [0, -1, -2])
  itMatch("<=0", integerPattern({maximum: 0}), [-2, -1, 0], [1, 2])
  itMatch("<=-0.5", integerPattern({maximum: -0.5}), [-2, -1], [0, 1, 2])
  itMatch("<=-1", integerPattern({maximum: -1}), [-2, -1], [0, 1, 2])
})

function itMatch(title: string, pattern: string, trues: any[], falses: any[]) {
  const regex = new RegExp(`^(${pattern})$`)
  , matcher = (x: unknown) => regex.test(`${x}`)

  it(title, () => {
    expect($fromEntries(
      [...trues, ...falses].map(v => [$stringify(v), matcher(v)])
    )).toStrictEqual($fromEntries([
      ...trues.map(v => [$stringify(v), true]),
      ...falses.map(v => [$stringify(v), false])
    ]))
  })
}