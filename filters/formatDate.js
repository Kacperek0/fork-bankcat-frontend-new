import Vue from 'vue'
import moment from 'moment-timezone'
import time from '@/config/time'

moment.locale('pl')

export default ({ store }) => {
  Vue.filter('formatDate', (value, filterFormat) => {

    return value
      ? moment(value)
        .tz(time.zone)
        .format(filterFormat || time.format || 'lll')
      : ''
  })
}
