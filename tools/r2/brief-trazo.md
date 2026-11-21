# 迁移需求：handdrawn-map-kit 官网（英文为主，可中英混排）

**产品：** handdrawn-map-kit，一个 AI/Agent 驱动的手绘人文地图引擎（Node.js）。灵感来自 Mizielinski 夫妇的《地图（人文版）》。用 YAML/JSON 声明一张地图，CLI 渲染出铅笔、针管笔、水彩晕染风格的人文地图；自带 Natural Earth 地理数据（国家、省级、河流、湖泊、城市、山峰），65 个手绘插图元素（熊猫、长城、饺子、风车……），中日韩手写体排版，自动布局避让，复古地图装饰（斑马纹边框、罗盘、旗帜标题框）。附带 Agent Skill，可以让 AI agent 直接画图并读诊断 JSON 迭代。

**目标用户：** 想让 agent 画漂亮地图的开发者、做文旅/教育内容的人。

**页面必须有：**
1. 首屏：产品名 + 一句话定位 + 主按钮「GitHub」+ 次按钮「Quick Start」；用作品图做主视觉。
2. 作品展示：至少 2 张示例地图（用提供的 japan / korea 两张图）。
3. 怎么用：一个 YAML 规格示例 → 一条渲染命令 → 出图，三步，代码块可复制。
4. 功能点：至少 6 个（声明式规格+CLI、Natural Earth 数据、65 个插图元素、CJK 手写排版、自动布局避让、Agent Skill + 诊断 JSON）。
5. 致谢与许可（引擎源自 statechart-art，MIT；字体 ZCOOL XiaoWei，OFL）+ 页脚。

**可交互状态：** 按钮 hover；代码块「复制」按钮的已复制状态；作品图点击放大。

**素材：** assets/ 里的 japan_cultural_map.png、korea_cultural_map.png 可以直接用；不用其他外部图片。

**说明：** 这一项更看「意向」：原站的气质和设计语言要能感觉到，但内容和结构按本产品来。

**验收：** 5 个区块都在、讲的是本产品；两张地图图片正确显示；代码块能复制。
