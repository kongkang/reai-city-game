# 斯坦福小镇风格游戏 - 场景元素设计文档

## 整体设计风格

本游戏采用简洁、清晰的像素艺术风格，使用有限的色彩搭配营造出温馨和谐的小镇氛围。所有场景元素设计都遵循以下原则：

- **像素精简**：每个元素使用最少的像素点表达最大的信息量
- **色彩和谐**：使用统一的色彩方案，避免过于鲜艳的对比
- **识别度优先**：确保玩家能够直观地识别每个元素的功能
- **风格一致**：所有元素保持相同的像素密度和细节水平

## 1. 房屋样式设计

### 基础住宅

**结构设计**：
- 单层小屋，带有标志性的三角形斜屋顶
- 屋顶采用砖红色，与墙体形成明显对比
- 整体比例约为宽5个图块，高4个图块（包括屋顶）

**材质表现**：
- 墙体采用米黄色木板纹理，使用横向短线条暗示木板的拼接
- 墙体底部有深色描边，增强立体感
- 墙角处使用稍深的阴影增加结构感

**门窗设计**：
- 门：带有简单门框的棕色矩形，顶部略微拱形
- 窗户：白色方格窗配以浅蓝色玻璃，表现为2x2像素的十字格窗格
- 夜间或室内有人时，窗户显示温暖的淡黄色光源

**细节元素**：
- 小型烟囱位于屋顶右侧，棕红色砖块结构，顶部偶尔冒出像素化的烟雾
- 门前有1-2级台阶，增加入口的可识别性
- 屋檐下有简单的装饰线条，增加建筑细节

### 商店建筑

**结构设计**：
- 略大于基础住宅，通常为两层结构
- 一层较高，用于商店空间；二层较矮，暗示为居住空间
- 正面有木质招牌，可根据商店类型显示不同图标

**材质表现**：
- 一层墙体使用浅棕色石砖纹理，二层使用木板纹理
- 每层之间有分隔线，使用深色描边
- 商店前区域铺设与道路相同的材质，但略微宽敞

**门窗设计**：
- 商店门：较大的双开木门，中心有分隔线
- 商店前窗：较大的展示窗，完整显示橱窗内的物品（简化为颜色块）
- 二层窗户：类似基础住宅的窗户设计，但尺寸略小

**细节元素**：
- 商店招牌在白天/夜晚有不同状态（夜晚发光）
- 门口可能有小型装饰物（如花盆、商品展示架）
- 屋顶可能有简单的风向标或装饰性尖塔

## 2. 室内/室外视觉区分

### 图块差异

**室外地面**：
- 草地：浅绿色基底，点缀深绿色小点暗示草叶
- 泥土路：棕黄色，带有不规则的细小纹理
- 石板路：灰色石块拼接，块与块之间有深色缝隙
- 水域：湛蓝色基底，表面有轻微波纹动画（简化为交替的两种蓝色）

**室内地板**：
- 木地板：温暖的浅棕色，带有规则的水平纹理线条
- 石板地：比室外石板略浅的灰色，排列更加整齐
- 地毯区域：红色、蓝色或绿色的简单图案，边缘有细微描边
- 瓷砖：规则的格子图案，颜色根据建筑类型变化（住宅米色，商店灰白色）

### 光照暗示

**室外光照**：
- 白天：整体亮度高，阴影少
- 黄昏：整体色调偏橙黄，长阴影
- 夜晚：整体色调偏深蓝，建筑窗户发出黄色光芒

**室内光照**：
- 整体亮度较室外低约20%
- 窗户边缘有亮度渐变，暗示自然光进入
- 光源（如灯具）周围有亮度提升
- 阴影朝向一致，增强空间感

**窗户表现**：
- 从室外看：白天显示为蓝色（玻璃），夜晚为黄色（室内灯光）
- 从室内看：显示为较亮的长方形，暗示室外光线
- 窗边可能有简单的窗帘元素，用1-2像素表示

### 墙体表现

**室外墙体**：
- 显示完整的外墙，包括门窗和装饰元素
- 墙体厚度通过顶部的细微阴影表现
- 墙角使用稍深的颜色增强立体感

**室内墙体**：
- 内墙显示内侧面，颜色比外墙浅约15%
- 墙体厚度在门窗处体现，通过1-2像素的描边
- 墙壁底部有细线条作为踢脚线
- 角落处有微小阴影增强空间感

## 3. 其他场景元素

### 植被元素

**树木**：
- 针叶树：三角形树冠（深绿色），细长树干（棕色）
- 阔叶树：圆形或椭圆形树冠（绿色），较粗树干（深棕色）
- 果树：小型圆形树冠，点缀不同颜色的果实像素点（红色或黄色）

**灌木和花卉**：
- 灌木：小型绿色圆球形，无明显树干
- 花丛：低矮绿色基底，点缀小型彩色方块代表花朵
- 草丛：比普通草地高且深的绿色小块，可随机分布

### 道路系统

**主要道路**：
- 宽度为3-4个图块
- 石板材质，灰色基底带有规则的分隔线
- 边缘有细微的描边增强边界感

**小径**：
- 宽度为1-2个图块
- 泥土或碎石质感，颜色比周围草地略深
- 随机点缀小石子（1像素白点）增加质感

**十字路口**：
- 在交汇处稍微扩大
- 可能有简单的路标或指示牌
- 铺设与周围道路相同的材质，但图案略有变化

### 装饰元素

**栅栏与围墙**：
- 木栅栏：棕色竖条，高度低于角色
- 石墙：灰色块状，带有规则的砖石纹理
- 装饰性围栏：可带有简单的重复图案

**街道设施**：
- 路灯：细长的灰色柱子，顶部为黄色光源
- 长椅：简单的棕色长条，支撑为深棕色
- 邮箱：蓝色小方块，带有信件图标
- 垃圾桶：深灰色小桶，可能带有盖子

**自然装饰**：
- 岩石：灰色不规则形状，边缘有亮色高光
- 水井：圆形石砌结构，中央为深蓝色水面
- 树桩：棕色圆形，带有年轮纹理
- 小溪：蓝色流动的线条，边缘有白色水花像素

### 特殊互动元素

**信息牌**：
- 木质框架，内有白色背景
- 可显示区域名称或简短提示
- 与角色互动时可能显示更详细信息

**可采集资源**：
- 浆果丛：低矮绿色灌木，点缀红色小方块
- 蘑菇：棕色柄，红色或棕色菌盖
- 简单农作物：规则排列的绿色小点，成熟时变为黄色或其他颜色

**季节性元素**：
- 春季：增加粉色和浅绿色花朵点缀
- 夏季：植被颜色更深，增加小型蝴蝶动画
- 秋季：树叶变为橙色和红色，地面有落叶
- 冬季：地面覆盖白色，树木无叶，窗户发出更温暖的光

## 实现建议

在技术实现上，建议：

1. 使用CSS sprite技术整合相同类型的元素到单个图片中，减少HTTP请求
2. 为动态元素（如水面波纹、烟囱烟雾）准备简单的帧动画
3. 利用CSS滤镜实现日/夜循环的色彩变化，而不必准备多套素材
4. 对于重复使用的元素（如树木、栅栏），创建可重用的组件
5. 保持每种元素的像素密度一致，推荐16x16或32x32像素为基本单位

通过这套场景元素设计，可以打造出既有像素游戏复古感，又不失现代游戏可玩性的小镇环境，为斯坦福小镇风格的AI角色提供一个生动的活动舞台。