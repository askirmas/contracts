type NumberSchema = {
  minimum: number
  maximum: number
  // multipleOf
  // exclusiveMinimum: number
  // exclusiveMaximum: number
}

const {floor: $floor, ceil: $ceil, max: $max, sign: $sign} = Math

export {
  integerPattern,
  integerStats
}

function integerPattern({
  minimum,
  maximum
}: Partial<NumberSchema> = {}) {
  const min = minimum && $ceil(minimum)
  , lenOfMin = notLeadDigits(min)
  , max = maximum && $floor(maximum)
  , lenOfMax = notLeadDigits(max)

  if (min! > max!)
    throw Error(`Min>Max: '${min}' '${max}'`)

  if (min !== undefined && min === max)
    return min

  return `${
    min! > 0 ? ""
    : max! < 0 ? "-"
    : `0|${
      min === 0 ? ""
      : max === 0 ? "-"
      : "-?"
    }`
  }[1-9][0-9]${
    min === undefined && max === undefined ? "*"
    : min! < 0 && max! > 0 ? `{0,${$max(lenOfMin!, lenOfMax!)}}`
    : "*"
  }`
}

function integerStats({
  minimum,
  maximum
}: Partial<NumberSchema> = {}) {
  const min = $ceil(minimum!)
  , max = $floor(maximum!)

  if (min > max)
    throw Error(`${min}>${max}`)

  if (min === max)
    return min
  
  const signOfMin = $sign(min)
  , signOfMax = $sign(max)
  , withZero = !(signOfMin === 1 || signOfMax === -1 || signOfMin === signOfMax)

  return {
    min: undefOnNan(min),
    max: undefOnNan(max),
    withZero: undefOnNan(withZero),
  }
}

function undefOnNan(x: unknown) {
  //@ts-expect-error
  return isNaN(x) ? undefined : x
}

function notLeadDigits(integer: undefined|number) {
  return integer && `${integer}`.length - 1 - (integer < 0 ? 1 : 0)
}
