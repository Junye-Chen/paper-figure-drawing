# 案例库：先选科学关系，再借鉴画法

2026-11-18 核对。以下是人工查看原论文图像后的设计解读，不是作者对设计意图的自述，也不是客观审美排名。三篇论文同时查看 teaser 与 method，另加画廊中一个机制主图。只记录分析和原文链接，不打包第三方论文图片。

## 检索入口与使用方式

[论文图画廊](https://github.com/qwdwqfwq/topconf-paper-figure-gallery)及其 data/figures.json 可用于发现候选。先按科学关系筛选，再核对原论文图号、图注和方法。画廊 score、pattern 不是设计质量结论。此次下载索引未匹配到下面三篇配对论文，它们是补充选例；LASP 是从该索引选出。LASP 索引作者字段含额外姓名，原论文只有 Adrian Bulat 与 Georgios Tzimiropoulos，不可盲信聚合元数据。Figure 1 也不一定在第一页或一定是 teaser。

使用：核心意图确认后，按下表挑 1–2 个相关案例，实际打开原图，解释借鉴的关系与不借鉴的部分。不能仅凭下面的文字声称已经看图，也不能把模板代替作者选择。

| 想解释的关系 | 优先看 | 不宜机械套用 |
|---|---|---|
| 少量输入产生丰富能力 | DreamBooth Fig.1；pixelNeRF Fig.1 | 机制是焦点时，仅展示结果不够 |
| 多路信息形成共同表示 | DUSt3R Fig.2 | 不要只画两条并行网络，丢掉共同坐标 |
| 查询如何取到对应信息 | pixelNeRF Fig.2 | 仅在方法实际涉及几何投影时采用射线示意 |
| 两种训练约束互补 | DreamBooth Fig.3 | 损失名称必须有对应的样本关系 |
| 新增监督关系是贡献 | LASP Fig.1 | 保留连接差异，不照搬符号密度 |

## 1–2. DUSt3R：从统一表示到共同坐标

CVPR 2024，Wang 等。[论文入口](https://openaccess.thecvf.com/content/CVPR2024/html/Wang_DUSt3R_Geometric_3D_Vision_Made_Easy_CVPR_2024_paper.html)；实际查看 [arXiv v3](https://arxiv.org/pdf/2312.14132v3)，Fig.1 PDF p.1，Fig.2 p.4。

**Fig.1 / teaser。** 上方压缩呈现图像集合→pointmaps→几何任务，下方用真实场景及重建结果证明覆盖范围。贡献的组织中心是共同中间表示，而不是各任务模块清单。白底和细线退后，让图像成为主要视觉重量。可借鉴“短概念带＋证据区”；不可将一枚模型框当作已经解释内部机制。

**Fig.2 / method。** 双输入与共享编码器建立对称性；解码器之间的连接表现信息交换；两个输出指向同一三维坐标系，说明共同参考系这一关键关系。几何对象比更多公式更能解释输出的含义。可借鉴“分支保持身份、终点展示关系”；原图红蓝高强度编码不直接作为本 skill 的配色模板。


## 3–4. DreamBooth：不变的主体与变化的语境

CVPR 2023，Ruiz 等。[论文入口](https://openaccess.thecvf.com/content/CVPR2023/html/Ruiz_DreamBooth_Fine_Tuning_Text-to-Image_Diffusion_Models_for_Subject-Driven_Generation_CVPR_2023_paper.html)；实际查看 [arXiv v3](https://arxiv.org/pdf/2208.12242v3)，Fig.1 p.1，Fig.3 p.4。

**Fig.1 / teaser。** 左侧少量同一主体照片，右侧同一主体进入不同环境；大图与小图组合，短场景标签辅助理解。身份不变、环境变化这一对照由图片本身承担。适用于能力型故事。缺点是它不负责解释训练机制，不能替代以机制解释为目的的方法图。照片本身鲜艳不等于图形标注也应高饱和。

**Fig.3 / method。** 主体重建与类别先验分为两支，样本图像、共享权重和损失回路共同说明约束来源。借鉴“每条损失连接到具体比较对象”，不要只摆损失列表。小幅图中回路和符号需要仔细辨认，放入自己的方法图时应简化非核心分支。


## 5–6. pixelNeRF：把条件信息的来源画出来

CVPR 2021，Yu 等。[论文入口](https://openaccess.thecvf.com/content/CVPR2021/html/Yu_pixelNeRF_Neural_Radiance_Fields_From_One_or_Few_Images_CVPR_2021_paper.html)；实际查看 [arXiv v3](https://arxiv.org/pdf/2012.02190v3)，Fig.1 p.1，Fig.2 p.4。该论文早于画廊标示的主要年份范围，作为补充案例。

**Fig.1 / teaser。** 输入和新视角结果固定位置对应，下方对比列揭示稀疏输入时的差异。对齐的行列降低来回寻找的负担。借鉴对比条件一致、对象身份持续可见；不要让结果网格挤掉被选为重点的机制。

**Fig.2 / method。** 查询点沿相机射线出现，投影到图像特征网格，再进入辐射场与渲染过程。空间线条解释“特征从哪里来”，示意曲线解释沿射线的输出。网格、相机、射线各有具体含义。借鉴“画出中间对应关系”，而不是画一个笼统的特征提取框；三维透视只适用于真正的几何关系。


## 7. LASP：让新增关系占据图的结构

CVPR 2023，Adrian Bulat、Georgios Tzimiropoulos。[原论文 PDF](https://openaccess.thecvf.com/content/CVPR2023/papers/Bulat_LASP_Text-to-Text_Optimization_for_Language-Aware_Soft_Prompting_of_Vision__CVPR_2023_paper.pdf)，Fig.1 PDF p.4；从画廊索引发现并核对原图。

左侧分组文本模板和右侧软提示分支通过 text-to-text 约束联系，图像分支提供 image-text 对照。图的贡献落在新增连接关系而非换名的模型框。分组的重复形式表达多个 prompt group。借鉴“新增约束连到真实参与者”；原图的阅读路线和符号负担较重，不是 teaser 排版的直接模板。区分结构优点与审美偏好，避免把收录当作全面优秀认证。

## 新增案例的最小记录

保存论文/版本/图号/页码/访问日期、实际查看状态、核心科学关系、读图路径、显著性分配、视觉映射、可迁移原则、误用风险与色觉风险。仅在看过原图后写视觉判断。不要只积累“简洁、美观、配色舒服”的形容词。
