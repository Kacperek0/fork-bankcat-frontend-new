export default function({ app }) {

  console.log(app.i18n.locale)

  app.vuetify.framework.lang.current = app.i18n.locale
  app.i18n.onLanguageSwitched = (ـ, newLocale) => {

    console.log(app.i18n.locale)

    app.vuetify.framework.lang.current = newLocale
  }
}
