# Paper Figure Drawing · cvpr-figure

交互式科研绘图 skill，用于 CVPR 风格的 teaser、method pipeline 和机制图，支持可编辑 PPTX / SVG 输出。

## 设计流程

1. 梳理「贡献—直觉—图的主张」，确认必须呈现的关系、可省略的过程与不能歪曲的含义。
2. Teaser 直觉优先，Method 关系优先；推荐一个具体方案，仅在有意义时给备选。
3. 确认核心草图，再补全内容、布局和阅读顺序。
4. 根据参考图落实整体风格，保持低饱和、非颜色冗余编码；避免无意义的微小样式选择。
5. 修复实质问题，交付可编辑文件，方便作者人工微调。

一根箭头能够清楚表达的关系，不展开成整套算法示意。已确认的设计沿用，反馈只回退到受影响的决策。

## 安装与使用

将仓库克隆到 Codex skills 目录下的 `cvpr-figure` 文件夹，例如：

```sh
git clone https://github.com/Junye-Chen/paper-figure-drawing.git ~/.codex/skills/cvpr-figure
```

如目标目录已有安装，请先备份已有修改。重新加载 skill 后使用：

> 请用 $cvpr-figure 帮我设计论文 teaser。先阅读方法，讨论重点和解释深度，不要直接画整图。

入口：[SKILL.md](SKILL.md)；完整流程：[workflow.md](references/workflow.md)。

## 文件与运行条件

- `references/`：流程、案例拆解、配色、校验与导出规范。
- `assets/`：公开来源记录、合成示例与风格参考素材。
- `scripts/`：共享场景渲染、PPTX 分组及导出检查。

导出脚本需要 Node.js、Python 3，以及运行环境提供的 `@oai/artifact-tool` 和配套 `skia-canvas`。该仓库不附带这些运行库；不是安装后即可在任意机器独立运行的绘图应用。参数与用法见 [export.md](references/export.md)。

PPTX 使用原生文字、图形和分组，照片仍为位图；连接线可编辑，但移动模块后不会自动吸附跟随。SVG/PPTX 手工修改不自动反向同步到场景 JSON。

## 案例与来源

[设计案例](references/design-cases.md)提供论文原文链接与图号，不打包第三方论文原图。不包含用户未公开论文、私人讨论案例或实验截图。

来源与借鉴说明见 [sources.md](references/sources.md)。候选配色的对比度检查不等同于色觉缺陷模拟或用户验证；相关限制见 [color-accessibility.md](references/color-accessibility.md)。
