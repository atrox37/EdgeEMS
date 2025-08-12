import autoprefixer from 'autoprefixer'
import pxtorem from 'postcss-pxtorem'

export default {
  plugins: [
    // 自动添加浏览器前缀
    autoprefixer(),
    // px 转 rem
    pxtorem({
      rootValue: 100,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [
        '.no-rem', // 不转换的类名
      ],
      replace: true, // 是否替换原来的值
      mediaQuery: false, // 是否转换媒体查询中的 px
      minPixelValue: 1, // 小于这个值的 px 不转换
      exclude: /node_modules/i, // 排除 node_modules 文件夹
    }),
  ],
}
