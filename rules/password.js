import { extend } from 'vee-validate'
extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target
  },
  message: (_, values) => i18n.$t('passwords_are_not_equal', values)
})
