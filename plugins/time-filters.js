import Vue from 'vue'

import {formatDistanceToNow} from 'date-fns'
import { ja } from 'date-fns/locale'

Vue.filter('publishedTimeToNow', date => {
  const distanceToNow = formatDistanceToNow(new Date(date), {
    locale: ja
  })
  return `${distanceToNow}前`
})


Vue.filter('commentTimeToNow', timestamp => {
  const timeElapsed = formatDistanceToNow(new Date(timestamp), {
    includeSeconds: true,
    locale: ja
  })
  return `${timeElapsed}前`
})

