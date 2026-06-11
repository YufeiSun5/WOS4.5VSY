---
name: wechat-send-file-transfer
description: Use Windows Computer Use to send a local file through the already logged-in WeChat desktop client to WeChat File Transfer Assistant. Use when the user asks Codex to send, upload, forward, or share a local file to 文件传输助手 / File Transfer Assistant via WeChat, especially when the user wants visible desktop operation and the destination is the user's own WeChat file transfer chat.
---

# 微信文件传输助手发送

## 核心原则

使用 Computer Use 操作 Windows 微信客户端，把用户指定的本地文件发送到“文件传输助手”。

只发送用户明确指定的文件。目标必须是“文件传输助手”。如果目标不是文件传输助手，或文件路径不明确，先向用户确认。

不要用 PowerShell、SendKeys、批处理或其他绕过 Computer Use 的前台键鼠脚本控制微信。

## 工作流

1. 连接 Computer Use。
2. 用 `sky.list_apps()` 和 `sky.list_windows()` 查找微信窗口。
3. 优先选择已登录主窗口，不要误操作扫码登录窗口。
4. 进入“文件传输助手”会话。
5. 点击“发送文件”，在文件选择框里输入绝对路径。
6. 点击微信聊天框里的“发送”按钮。
7. 等待并验证不再显示“上传中”，聊天记录里出现目标文件名。

## 识别微信窗口

已登录主窗口的典型特征：

- 窗口较大，例如宽度接近 1500 到 1900。
- 可访问性树里有 `MainView`、`session_item_...`、`chat_input_field`。
- 左侧会话列表里可能有 `session_item_文件传输助手`。

登录壳或错误窗口的典型特征：

- 小窗口，常见大小约 282 x 381。
- 文本包含 `扫码登录`、`仅传输文件`、`进入微信`、`当前登录用户...`。
- 这不是发送文件的目标窗口。

处理规则：

- 如果已登录主窗口存在，只操作主窗口。
- 如果只有 `扫码登录` / `仅传输文件`，停止并告诉用户需要恢复已登录主微信窗口。
- 如果出现 `当前登录用户...` 和 `进入微信`，这通常是恢复本机已登录账号；可以点击 `进入微信`，但不要点击 `仅传输文件`。
- 如果点击 `进入微信` 后出现 `该账号已登录`，点击 `我知道了`，然后等待主窗口恢复。

## 进入文件传输助手

优先使用会话列表中已经存在的条目：

1. 在主微信窗口抓取可访问性树。
2. 查找包含 `session_item_文件传输助手` 的列表项。
3. 点击该列表项。
4. 验证聊天标题出现 `文件传输助手`。

如果会话列表里没有直接出现：

1. 聚焦左侧 `搜索` 编辑框。
2. 输入 `文件传输助手`。
3. 只选择联系人/会话结果，不要点击网络搜索结果。
4. 如果误打开了微信搜索网页或视频结果，关闭该子窗口，回到主微信窗口重新选择会话列表结果。

## 发送文件

在“文件传输助手”会话中：

1. 点击 `发送文件` 按钮。
2. 等待 Windows 文件选择对话框出现；有时对话框会被合并在微信窗口的可访问性树里。
3. 找到 `文件名(N):` 编辑框。
4. 如果 `set_value` 不可用，使用点击编辑框、`Control_L+a`、`type_text(绝对路径)`、`Return`。
5. 文件进入微信待发送区后，聊天框里的 `发送` 按钮会从 disabled 变为可用。
6. 点击可用的 `发送` 按钮。

文件路径必须使用绝对路径，例如：

```text
D:\DEV_D\WOS4.5\WOS4_automation_architecture_and_backup.txt
```

## 验证

发送后等待几秒，再抓取微信主窗口可访问性树。

成功标准：

- 聊天对象仍是 `文件传输助手`。
- 聊天记录中出现目标文件名。
- 文件记录不再显示 `上传中` 或 `进度: ...`。
- 没有出现 `发送失败`。

示例成功文本：

```text
文件 WOS4_automation_architecture_and_backup.txt 10.8K 微信电脑版
```

## 防错要点

- 不要向当前聊天窗口直接发送，必须先确认标题是 `文件传输助手`。
- 不要点击微信搜索里的网络结果、视频结果或公众号文章。
- 不要点击 `仅传输文件`，除非用户明确要求走扫码文件传输模式。
- 文件选择后还不算完成，必须点击微信聊天框里的 `发送`。
- 显示 `上传中` 时还不算完成，必须等待上传完成后再回复用户。
