import { build } from 'vite'

async function main() {
  // 构建生产版本
  await build({
    // 设置项目根目录
    root: './',
    build: {
      // 设置输出目录
      outDir: './dist',
      // 是否启用代码压缩
      minify: true,
      // 是否开启 CSS 提取
      cssMinify: true
    },
    // 开启生产模式
    mode: 'production',
  })

  console.log('Build completed')
}

// 执行构建
main().catch(err => {
  console.error(err)
  process.exit(1)
})

// 监听文件变化，自动执行构建
import chokidar from 'chokidar'
chokidar.watch('./src').on('all', async () => {
  console.log('File change detected, rebuilding...')
  await main()
})
