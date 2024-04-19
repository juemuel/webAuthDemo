export default {
  replaceSpaces: function (str: string) {
    return str.replace(/ /g, '&nbsp;')
  },
  stringIsEmpty: function (obj: any) {
    if (typeof obj === 'undefined' || obj == null || obj === '') {
      return true
    } else {
      return false
    }
  }
}
