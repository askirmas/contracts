type IntegerSchema = {
  minimum: number
  maximum: number
  // multipleOf
  // exclusiveMinimum: number
  // exclusiveMaximum: number
}

export {
  integerPattern
}

function integerPattern({
  minimum,
  maximum
}: Partial<IntegerSchema> = {}) {
  return `${
    minimum! > 0 ? ""
    : maximum! < 0 ? "-"
    : `0|${
      minimum === 0 ? ""
      : maximum === 0 ? "-"
      : "-?"
    }`
  }[1-9][0-9]*`
}

