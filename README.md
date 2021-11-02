# AutoHeathCheckIn

南京大学自动健康打卡脚本。

- 支持多个账号
- 可设定在每天的几点打卡，脚本会每小时检测是否需要打卡并自动打卡

## 所需环境

- chromedriver
- Chrome，要与 chromedriver 匹配
- Node.js 16+

## 使用方法

1. 配置好上述的所需环境
2. 在项目根目录使用 yarn 安装所有依赖
3. 根据需要编辑 `src/CONFIG.ts` 中的配置项
4. `yarn build` 编译
5. `node dist/index.js` 运行