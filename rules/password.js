import { extend } from 'vee-validate'
extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target
  },
  message: 'Passwords are not equal'
})
