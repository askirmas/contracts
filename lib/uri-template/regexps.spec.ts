import { integerPattern as int } from "./regexps"

const {stringify: $stringify} = JSON
, {fromEntries: $fromEntries} = Object

describe("integer", () => {
  itMatch("any"   , int()               , [ 0,  1, -1], ["-0", 0.1])
  itMatch(">=0"   , int({minimum: 0})   , [ 2,  1, 0] , [-1, -2])
  itMatch(">=0.5" , int({minimum: 0.5}) , [ 2,  1]    , [0, -1, -2])
  itMatch(">=1"   , int({minimum: 1})   , [ 2,  1]    , [0, -1, -2])
  itMatch("<=0"   , int({maximum: 0})   , [-2, -1, 0] , [1, 2])
  itMatch("<=-0.5", int({maximum: -0.5}), [-2, -1]    , [0, 1, 2])
  itMatch("<=-1"  , int({maximum: -1})  , [-2, -1]    , [0, 1, 2])

  itMatch("=0" , int({minimum: 0 , maximum: 0}) , [0] , [-2, -1, 1, 2])
  itMatch("=-1", int({minimum: -1, maximum: -1}), [-1], [-2, 0, 1, 2])
  itMatch("=1" , int({minimum: 1 , maximum: 1}) , [1] , [-2, -1, 0, 2])
  it("=0.5", () => expect(() => int({minimum: 0.5, maximum: 0.5})).toThrow())

  itMatch(">=20" , int({minimum: 20})  , [1, 10, 100], [0, -1, -10, -100])
  itMatch(">=-20" , int({minimum: -20}), [1, 10, 100, 0, -1, -10, -100], [])
  itMatch("<=20" , int({maximum: 20})  , [1, 10, 100, 0, -1, -10, -100], [])
  
  itMatch("[-20,20]" , int({minimum: -20, maximum: 20}), [1, 10, 0, -1, -10], [100, -100])

  itMatch("[20,2000]" , int({minimum: 20, maximum: 2000}), [1, 10, 100, 500, 1000, 5000, 10000], [0,-1, -10, -100])
})

function itMatch(title: string, pattern: number|string, trues: any[], falses: any[]) {
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