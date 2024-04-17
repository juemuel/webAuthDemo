export default {

  /**
   * 输出当前的 `navigator.userAgent` 信息。
   */
  getUserAgentInfo (): string {
    return navigator.userAgent
  },
  /**
     * 获取当前的机型。返回一个简化的设备模型名称，如 "iPhone", "iPad", "Android", 或 "Unknown"。
     * 注意：这种方法仅提供基本的设备类型识别，具体型号可能无法准确获取，尤其是在 Web 环境中。
     * 更精确的设备识别可能需要借助更复杂的库或服务。
     */
  getDeviceModel (): string {
    const userAgent = navigator.userAgent.toLowerCase()

    if (/ipad|iphone/.test(userAgent)) {
      return 'iPhone/iPad'
    } else if (/android/.test(userAgent)) {
      return 'Android'
    } else {
      return 'Unknown'
    }
  },
  isWeChat () {
    return String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) === 'micromessenger'
  }
}
