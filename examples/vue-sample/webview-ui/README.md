# 智慧校园系统前端代码

## 一、项目介绍

本项目为智慧校园系统前端代码

## 二、相关文档

`pinia`引入持久化插件手册：<https://prazdevs.github.io/pinia-plugin-persistedstate/guide/>

`elementplus`手册：<https://element-plus.org/zh-CN/component/button.html>

`vue3`中引入例子特效说明文档：<https://github.com/tsparticles/vue3/#readme>

引入烟花特效说明文档：<https://dev.to/tsparticles/javascript-create-beautiful-fireworks-effects-with-tsparticles-1ali>

引入烟花特效需要安装`preset-firework`库，最新的安装命令为

```bash
npm i @tsparticles/preset-fireworks
```

然后引入`loadFireworksPreset()`方法，并在`init`方法中使用

```js
import { loadFireworksPreset } from '@tsparticles/preset-fireworks'

createApp(App)
    .use(Particles, {
        init: async engine => {
            // await loadFull(engine)
            await loadFireworksPreset(engine);
        },
    })

// 在具体组件中使用的时候
<vue-particles
    id="tsparticles"
    :particlesLoaded="particlesLoaded"
    :options="options"
/>

const options = {
    preset: "fireworks"
}

export default options
```

