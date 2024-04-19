/**
 * 日期格式化工具类
 *
 * @author : fankey 2022-03-22
 */
export default {

  /**
   * 格式化日期
   *
   * @param date 日期
   * @param format 格式
   * @returns 格式化后的日期字符串
   */
  formatDate (date: Date, format: string): string {
    if (!this.isValidDate(date)) {
      return ''
    }

    const padZero = (num: number, len: number) => {
      return num.toString().padStart(len, '0')
    }

    const formatObj: { [key: string]: number } = {
      yyyy: date.getFullYear(),
      MM: date.getMonth() + 1,
      dd: date.getDate(),
      HH: date.getHours(),
      mm: date.getMinutes(),
      ss: date.getSeconds(),
      SSS: date.getMilliseconds()
    }

    return format.replace(/(yyyy|MM|dd|HH|mm|ss|SSS)/g, (match: string) => {
      return padZero(formatObj[match], match.length)
    })
  },

  /**
   * 将字符串转换为日期
   *
   * @param dateString 日期字符串
   * @param format 格式
   * @returns 转换后的日期
   */
  parseDate: function (dateString: string, format: string): Date {
    const formatObj: { [key: string]: string } = {
      yyyy: '',
      MM: '',
      dd: '',
      HH: '',
      mm: '',
      ss: '',
      SSS: ''
    }

    let index = 0
    format.replace(/(yyyy|MM|dd|HH|mm|ss|SSS)/g, (match: string) => {
      formatObj[match] = dateString.substr(index, match.length)
      index += match.length
      return match
    })

    const year = parseInt(formatObj.yyyy)
    const month = parseInt(formatObj.MM) - 1
    const day = parseInt(formatObj.dd)
    const hour = parseInt(formatObj.HH)
    const minute = parseInt(formatObj.mm)
    const second = parseInt(formatObj.ss)
    const millisecond = parseInt(formatObj.SSS)

    return new Date(year, month, day, hour, minute, second, millisecond)
  },

  /**
   * 格式化日期字符串
   *
   * @param dateString 日期字符串
   * @param format 格式，默认'-'，还可以'/'
   * @returns 格式化后的日期字符串
   */
  // formatDateStr (dateString: string, separator = '-') {
  //   const date = new Date(dateString)
  //   const year = date.getFullYear()
  //   const month = date.getMonth() + 1
  //   const day = date.getDate()
  //   const formattedDate = `${year}${separator}${(month < 10 ? '0' : '')}${month}${separator}${(day < 10 ? '0' : '')}${day}`
  //   return formattedDate
  // },
  /**
   * 检测是否是合法的日期
   *
   * @param date 日期
   * @returns boolean
   */
  isValidDate: function (date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime())
  }
}
