import { localize } from 'vee-validate'

export default function({ app }) {
  app.vuetify.framework.lang.current = app.i18n.locale
  localize(app.i18n.locale)

  app.i18n.onLanguageSwitched = (ـ, newLocale) => {
    app.vuetify.framework.lang.current = newLocale
    localize(newLocale)
  }
}
