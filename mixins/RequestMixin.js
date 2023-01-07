import { transformNodeFormErrorsToVeeValidate } from '~/utils'

export default {
  methods: {
    dealWithFailedRequest(err) {
      const { response } = err

      if (response) {
        switch (response.status) {
          case 422:
            this.$refs.observer.setErrors(
              transformNodeFormErrorsToVeeValidate(response.data.detail)
            )
            break
          case 400:
            if (typeof response.data.detail === 'string') {
              this.$notifier.showMessage({
                content: response.data.detail,
                color: 'red'
              })
            }
            break
        }
      }
    }
  }
}
