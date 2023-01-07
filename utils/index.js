export function stringToBoolean(string) {
  return string === 'false' ? false : !!string
}

export function transformNodeFormErrorsToVeeValidate(errors) {
  const result = {}

  errors.forEach((error) => {
    if (error.loc) {
      if (error.loc.length === 2) {
        const fieldName = error.loc[1]
        const message = error.msg

        result[fieldName] = result[fieldName] || []
        result[fieldName].push(message)
      }
    }
  })

  return result
}
