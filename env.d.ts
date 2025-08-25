/// <reference types="vite/client" />

// 声明 postcss-pxtorem 模块
declare module 'postcss-pxtorem' {
  interface PxtoremOptions {
    rootValue?: number | ((file: string) => number)
    unitPrecision?: number
    propList?: string[]
    selectorBlackList?: (string | RegExp)[]
    replace?: boolean
    mediaQuery?: boolean
    minPixelValue?: number
    exclude?: RegExp | ((file: string) => boolean)
  }

  function pxtorem(options?: PxtoremOptions): any
  export = pxtorem
}
