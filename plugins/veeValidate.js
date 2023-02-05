import Vue from 'vue'
import { extend, setInteractionMode, ValidationObserver, ValidationProvider, localize } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'

import pl from 'vee-validate/dist/locale/pl.json'
import en from 'vee-validate/dist/locale/en.json'

export default function({ app }) {
  Object.keys(rules).forEach((rule) => {
    extend(rule, {
      // eslint-disable-next-line import/namespace
      ...rules[rule]
    })
  })

  extend('password', {
    params: ['target'],
    validate(value, { target }) {
      return value === target
    },
    message: (_, values) => app.i18n.t('passwords_are_not_equal', values)
  })

  localize({
    en,
    pl
  })

  setInteractionMode('eager')

  Vue.component('ValidationObserver', ValidationObserver)
  Vue.component('ValidationProvider', ValidationProvider)

}


