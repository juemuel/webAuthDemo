export default {
  hexToHsl: function (hex:any) {
    // 解析十六进制颜色值
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    // 计算最大值、最小值和差值
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min

    // 计算色相、饱和度和亮度
    let h
    let s
    const l = (max + min) / 2

    if (delta === 0) {
      h = 0 // 相同颜色时色相为0
      s = 0 // 饱和度也为0
    } else {
      if (l < 0.5) {
        s = delta / (max + min)
      } else {
        s = delta / (2 - max - min)
      }

      h = ((g - b) / delta) % 6
      if (b > g) {
        h += 6 // 确保h处于[0, 6)范围内
      }

      h *= 60 // 转换为度数
    }

    return { h: h || 0, s: s * 100 || 0, l: l * 100 || 0 }
  },
  realHslToHex (h: number, s: number, l: number) {
    l /= 100
    const a = s * Math.min(l, 1 - l) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0') // convert to Hex and prefix "0" if needed
    }
    return `#${f(0)}${f(8)}${f(4)}`
  },
  hslToHex: function (hslObject: any) {
    const { h, s, l } = hslObject
    return this.realHslToHex(h, s, l)
  },
  generateRandomThemeColors: function (baseColorHex: string) {
    // 将基础颜色转换为HSL格式
    const baseColor = this.hexToHsl(baseColorHex)

    // 定义背景色和前景色的色相、饱和度和亮度变化范围
    const bgHueRange = [-10, 10]
    const bgSaturationRange = [-10, 10]
    const bgLightnessRange = [-20, 20]

    const fgHueRange = [-10, 10]
    const fgSaturationRange = [-10, 10]

    const fgLightnessRange = [0, 50] // 前景色的亮度变化范围更大，以确保与背景色有足够的对比度
    // const fgLightnessRange = [maxBgLightness + minFgLuminosityDiff, 100 - minFgLuminosityDiff]

    // 限制前景色亮度范围，使其至少比背景色亮10%
    // const minFgLuminosityDiff = 5
    // const maxBgLightness = Math.min(100, baseColor.l + bgLightnessRange[1])
    // 生成随机背景色和前景色
    const randomBgHue = Math.random() * (bgHueRange[1] - bgHueRange[0]) + bgHueRange[0]
    const randomBgSaturation = Math.random() * (bgSaturationRange[1] - bgSaturationRange[0]) + bgSaturationRange[0]
    const randomBgLightness = Math.random() * (bgLightnessRange[1] - bgLightnessRange[0]) + bgLightnessRange[0]

    const randomFgHue = Math.random() * (fgHueRange[1] - fgHueRange[0]) + fgHueRange[0]
    const randomFgSaturation = Math.random() * (fgSaturationRange[1] - fgSaturationRange[0]) + fgSaturationRange[0]
    const randomFgLightness = Math.random() * (fgLightnessRange[1] - fgLightnessRange[0]) + fgLightnessRange[0]

    // 应用随机变化到基础颜色上，生成背景色和前景色
    const randomBgColor = this.hslToHex({
      h: (baseColor.h + randomBgHue) % 360,
      s: Math.max(0, Math.min(100, baseColor.s + randomBgSaturation)),
      l: Math.max(0, Math.min(100, baseColor.l + randomBgLightness))
    })

    const randomFgColor = this.hslToHex({
      h: (baseColor.h + randomFgHue) % 360,
      s: Math.max(0, Math.min(100, baseColor.s + randomFgSaturation)),
      l: Math.max(0, Math.min(100, baseColor.l + randomFgLightness))
    })

    return { backgroundColor: randomBgColor, foregroundColor: randomFgColor }
  }
}
