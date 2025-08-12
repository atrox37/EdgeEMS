// 响应式工具使用示例

import { pxToResponsive, pxToRem, getCurrentScale, getCurrentFontSize } from './responsive'

/**
 * 响应式工具使用示例
 */
export class ResponsiveExample {
  /**
   * 示例：将设计稿中的100px转换为当前响应式下的px值
   */
  static examplePxToResponsive(): void {
    const designPx = 100
    const responsivePx = pxToResponsive(designPx)
    console.log(`设计稿${designPx}px -> 当前响应式${responsivePx}px`)
  }

  /**
   * 示例：将设计稿中的100px转换为rem值
   */
  static examplePxToRem(): void {
    const designPx = 100
    const remValue = pxToRem(designPx)
    console.log(`设计稿${designPx}px -> ${remValue}`)
  }

  /**
   * 示例：获取当前屏幕缩放比例
   */
  static exampleGetScale(): void {
    const scale = getCurrentScale()
    console.log(`当前屏幕缩放比例: ${scale}`)
  }

  /**
   * 示例：获取当前根字体大小
   */
  static exampleGetFontSize(): void {
    const fontSize = getCurrentFontSize()
    console.log(`当前根字体大小: ${fontSize}px`)
  }

  /**
   * 示例：批量转换设计稿尺寸
   */
  static exampleBatchConvert(): void {
    const designSizes = [100, 200, 300, 400, 500]

    console.log('批量转换示例:')
    designSizes.forEach((size) => {
      const responsivePx = pxToResponsive(size)
      const remValue = pxToRem(size)
      console.log(`设计稿${size}px -> 响应式${responsivePx}px -> ${remValue}`)
    })
  }
}

// 使用示例：
// ResponsiveExample.examplePxToResponsive()
// ResponsiveExample.examplePxToRem()
// ResponsiveExample.exampleGetScale()
// ResponsiveExample.exampleGetFontSize()
// ResponsiveExample.exampleBatchConvert()
