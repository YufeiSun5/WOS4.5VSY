# 后端插入单点调试记录

时间：20260627T191230
操作者：孙宇飞_code-ai

备份文件：
- MEMORY.before.md
- WOS4_deep_test_notes.before.md

本轮事实：
- 按用户要求，将后端启动调试链路收敛为 onCreate 只调用 CreateAssessmentRecord，不再在查询函数里插入。
- PageView.eval + SetRunInfo + Variant(StringMap) 调运行态 CreateAssessmentRecord 返回 ret=0，但 returndata 仍为 2026-06-24 旧占位 PAL_CREATED，说明运行包未加载当前编辑器真实 Create 代码。
- 编辑器中读取 CreateAssessmentRecord 源码，确认其已是 Create(param,input,output) 写 pal_assessment_record 的真实实现。
- 后端调试启动后进入 CreateAssessmentRecord，变量区可见 strmapPara/param/input/output 等；继续运行后调试器长时间不返回，未取得 createResult.ret。
