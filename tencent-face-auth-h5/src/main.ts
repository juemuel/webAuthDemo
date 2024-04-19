import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
const app = createApp(App)
const doc = window.document // 文档对象
const docEl = doc.documentElement // 文档对象元素

// 根据视窗宽度，设置根字体大小
// const refreshRem = () => {
//   if (docEl.getBoundingClientRect().width > 250 && docEl.getBoundingClientRect().width < 400) {
//     const rem = docEl.getBoundingClientRect().width / 23.4375
//     docEl.style.fontSize = rem + 'px'
//   }
//   console.log('FONT SIZE', docEl.style.fontSize)
// }
// refreshRem() // 首次加载设置根字体模块

// 监听resize事件，设置根字体大小
// window.addEventListener('resize', () => {
//   refreshRem()
// })

document.addEventListener('DOMContentLoaded', function () {
  const pageFooter = document.querySelector('html')
  if (pageFooter) {
  // 设置样式
  // pageFooter.style = 'font-size: 5.2083333333333336vw;' // 如果让1rem=100px，且设计稿宽1920px时，1vw=19.2px，那么font-size: 5.208vw
  // pageFooter.style = 'font-size: 13.3vw;' // 如果让1rem=100px，且设计稿宽750px时，1vw=7.5px，那么font-size: 13.3vw
  // pageFooter.style = 'font-size: 18px;' // 如果让1rem=18px，且设计稿宽750px时，1vw=7.5px，那么font-size: 2.4vw
    // console.log('当前fontSize', pageFooter.style.fontSize)
  } else {
    // console.error('未找到html元素。')
  }
})
app.use(store).use(router).use(Vant).mount('#app')
