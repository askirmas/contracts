type IntegerSchema = {
  minimum: number
  maximum: number
  // multipleOf
  // exclusiveMinimum: number
  // exclusiveMaximum: number
}

const {floor: $floor, ceil: $ceil, max: $max} = Math

export {
  integerPattern
}

function integerPattern({
  minimum,
  maximum
}: Partial<IntegerSchema> = {}) {
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

function notLeadDigits(integer: undefined|number) {
  return integer && `${integer}`.length - 1 - (integer < 0 ? 1 : 0)
}