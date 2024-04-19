export default {
  getUrlParam (name: string) {
    const url = decodeURIComponent(window.location.href.split('#')[0]) //  获取当前页面 URL，并使用 split 方法按照 # 分割，取分割后的第一个部分
    const search = url.split('?')[1] // 将 URL 按照 ? 分割，并取分割后的第二个部分
    if (search) {
      const params = new URLSearchParams(search)
      const paramValue = params.get(name)
      console.log(paramValue)
      return paramValue || null
    } else {
      return null
    }
  }
  // getUrlCode (name: string) {
  //   return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
  // }
}
