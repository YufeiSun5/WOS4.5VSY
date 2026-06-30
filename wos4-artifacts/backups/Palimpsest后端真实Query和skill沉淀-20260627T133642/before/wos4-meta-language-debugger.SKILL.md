---
name: wos4-meta-language-debugger
description: Use when debugging WOS4 / WellinOS4.5 meta-language custom calculation functions in the worker-space editor, including setting breakpoints, starting debug, reading Variables / Stack / Breakpoints panels, using step-over / continue buttons, saving browser-harness evidence, or verifying that a custom calculation returns the expected JSON protocol.
---

# WOS4 元语言断点调试

## 用途

在 WOS4 自定义计算编辑器里按人类方式调试：打断点、启动调试、读取左侧 `变量 / 监视 / 堆栈 / 断点`，必要时点击右侧单步按钮，并保存可审计证据。

本 skill 只覆盖已验证的 `browser-harness` 路径。不要把“启动后出现编译成功”当成完整调试通过；必须至少确认断点停住、变量区不再是 `暂无数据`，并能读取堆栈和断点行。

## 前置检查

1. 按项目规则声明当前 AI 身份，并读取对应 `.ai/agents/<身份>.md`。
2. 运行 WOS4 preflight：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts\scripts\ai-preflight.ps1 -Wos4 -TaskPath wos4-artifacts\tasks\<任务目录>
```

3. 按 `wos4-browser-harness` 运行：

```powershell
$env:Path = 'C:\Users\SunYufei\.local\bin;' + $env:Path
browser-harness --doctor
```

4. 只在已通过人类导航进入自定义计算 `worker-space/index.html?...type=1005` 后操作。动态 URL 只能作为证据，不作为入口。

## 定位调试编辑器

用递归 iframe 查找精确的 worker-space 编辑器，不要误匹配外层 `worker-space-model`：

```javascript
function collectFrames() {
  const frames = [];
  function walk(win, path, chain) {
    let doc;
    try { doc = win.document; } catch(e) { return; }
    frames.push({win, path, chain, href: String(win.location.href)});
    Array.from(doc.querySelectorAll('iframe'))
      .forEach((f, i) => walk(f.contentWindow, path + '.' + i, chain.concat(f)));
  }
  walk(window, 'top', []);
  return frames;
}

function getTarget() {
  const hit = collectFrames().find(f => /\/worker-space\/index\.html/.test(f.href));
  if (!hit) throw new Error('worker editor frame missing');
  let gx = 0, gy = 0;
  for (const fr of hit.chain) {
    const r = fr.getBoundingClientRect();
    gx += r.x;
    gy += r.y;
  }
  return {win: hit.win, doc: hit.win.document, gx, gy, href: hit.href, path: hit.path};
}
```

## 断点流程

1. 如果 `.wos-editor-debug-stop` 存在，先点击停止，并等待 `.wos-editor-debug-start` 恢复。停止后会短暂显示 `停止中`，不要立刻重新启动。
2. 在 Monaco 代码区通过 `.line-numbers` 按文本找行号，再点 `.glyph-margin` 中心位置打断点。不要依赖 DOM 顺序，行号元素可能按可视布局乱序返回。
3. 打断点后必须确认：
   - 代码行侧边出现 `.cgmr.codicon.breakpoint`；
   - 左侧断点区出现 `.breakpoint-item-line`，文本类似 `onCreate / <id>-0: 4`。
4. 点击 `.wos-editor-debug-start` 启动调试。
5. 等待断点暂停。成功暂停的最低证据：
   - `.wos-editor-debug-stop` 存在；
   - 左侧变量区出现变量名，例如 `strmapPara: Array(1)`；
   - 代码区出现 `.debug-interrupt-arrow` 和 `.debug-interrupt-line`；
   - 右侧调试按钮出现 `.debug-continue-run`、`.debug-step-over`、`.debug-stop`。

## 单步验证

断点停住后，点击 `.debug-step-over` 执行下一步。再次读取 `document.body.innerText` 和调试区 DOM：

- `resultText:` 应出现函数返回值；
- 统一后端协议应至少包含 `ok`、`code`、`message`、`traceId`、`data`；
- 如果验证 CRUD 后端，检查 `data.records`、`data.methods`、`data.tables` 是否和设计一致；
- 如果 `resultText` 为空，只能说明断点停在赋值前，继续单步或把断点移到赋值后一行。

已验证示例：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC` 在 `onCreate` 第 4 行断点暂停后，单步一次可读出：

```text
resultText: {"ok":true,"code":"OK","message":"success","traceId":"pal-20260624-backend","data":{...}}
```

其中 `data.tables` 包含 8 张业务事表：`pal_menu_node / pal_department / pal_mentor / pal_intern_student / pal_assessment_batch / pal_assessment_record / pal_assessment_score_detail / pal_operation_log`。

## 证据要求

每次调试至少保存：

- `wos4-artifacts/snapshots/<任务>_debug_breakpoint_<日期>.json`
- `wos4-artifacts/screenshots/<任务>_debug_breakpoint_<日期>.png`

结构化快照建议包含：

```json
{
  "summary": {
    "hasVariables": true,
    "hasResultText": true,
    "hasStack": true,
    "hasBreakpointLine": true,
    "hasDebugInterrupt": true,
    "hasStop": true
  },
  "body": "...",
  "panels": {
    "breakpointItems": [],
    "debugMarks": []
  }
}
```

调试结束后必须停止调试，并保存停止后的快照，确认 `.wos-editor-debug-start` 恢复。

## 常见失败

- 只看到 `编译成功`，但变量区仍是 `暂无数据`：没有断点命中，不能算调试通过。
- 启动后长时间显示 `启动中`：继续轮询；如果断点命中，变量区和 `.debug-interrupt-*` 会出现。
- 点击断点后左侧断点区没出现行号：点击位置不在 `.glyph-margin`，按行号文本重新定位。
- `line-numbers` 返回顺序是 `10,11,12,7,8,9,4,5,6,1,2,3` 这类乱序：必须按 `txt` 精确找目标行，不能按数组下标。
- 中文出现在 browser-harness ASCII 临时脚本里会变成 `????`：脚本里避免中文正则，或使用 Unicode 转义/UTF-8 文件读取。
