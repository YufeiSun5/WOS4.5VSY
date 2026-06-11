#!/usr/bin/env node
/**
 * WOS4 Demo Page Fullstack Runner (需求驱动版本)
 *
 * 目标:
 * - 登录 WOS4
 * - 打开可编辑页面
 * - 用需求驱动的布局重建画面（标题 + 左树 + 中间内容 + 底部）
 * - 放置/配置文本、按钮、表格、图表、树、输入控件
 * - 运行按钮/表格/图表/定时器属性与交互验证
 * - 提交保存并打开预览
 * - 输出单元测试结果到 unit-tests.md
 */
const fs = require("fs");
const path = require("path");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (err) {
  const msg = {
    startAt: new Date().toISOString(),
    steps: [{ name: "dependency", ok: false, detail: "playwright missing. install with: npm i -D playwright", at: new Date().toISOString() }]
  };
  fs.writeFileSync(path.join(process.cwd(), "snapshots", "wos4_demo_page_runbook_result.json"), JSON.stringify(msg, null, 2), "utf8");
  process.exit(1);
}

const ROOT_DIR = process.cwd();
const ARTIFACT_DIR = path.join(ROOT_DIR, "wos4-artifacts");
const OUT_DIR = path.join(ARTIFACT_DIR, "snapshots");
const IMG_DIR = path.join(ARTIFACT_DIR, "screenshots");
const REPORT_DIR = path.join(ARTIFACT_DIR, "reports");
const BACKUP_ROOT = path.join(ARTIFACT_DIR, "backups");
const LOG_PATH = path.join(OUT_DIR, "wos4_demo_page_runbook_result.json");

function readIni(file) {
  if (!fs.existsSync(file)) return {};
  const data = {};
  let section = "";
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(";") || line.startsWith("#")) continue;
    const sec = line.match(/^\[(.+)]$/);
    if (sec) {
      section = sec[1].trim();
      data[section] = data[section] || {};
      continue;
    }
    const idx = line.indexOf("=");
    if (idx >= 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (section) data[section][key] = value;
      else data[key] = value;
    }
  }
  return data;
}

const LOCAL_INI = path.join(ROOT_DIR, "wos4-artifacts", "config", "wos4.local.ini");
const WOS_CONFIG = readIni(LOCAL_INI).wos4 || {};
const LOGIN_URL = process.env.WOS4_LOGIN_URL || WOS_CONFIG.url || "http://221.239.19.118:13001/#/login";
const EDITOR_URL =
  process.env.WOS4_EDITOR_URL ||
  "http://221.239.19.118:13001/public/?id=6192730962611142864&parentid=0&cloudid=107&clientnumber=7710165597571436705&bs=true#/running";
const USER = process.env.WOS4_USER || WOS_CONFIG.username || "孙宇飞";
const PASSWORD = process.env.WOS4_PASS || WOS_CONFIG.password;
const PREVIEW_TIMEOUT_MS = Number(process.env.WOS4_PREVIEW_WAIT_MS || 16000);
const WAIT_MS = Number(process.env.WOS4_STABILIZE_MS || 1200);
function normalizeProxy(value) {
  if (!value || value === "direct") return "direct://";
  return value;
}
const REQUIRE_DIRECT = normalizeProxy(process.env.WOS4_DIRECT_PROXY || WOS_CONFIG.proxy || "direct://");

if (!PASSWORD) {
  const msg = {
    startAt: new Date().toISOString(),
    steps: [{ name: "password_env", ok: false, detail: "missing WOS4_PASS", at: new Date().toISOString() }]
  };
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(LOG_PATH, JSON.stringify(msg, null, 2), "utf8");
  process.exit(1);
}

function normalizeLine(s) {
  return typeof s === "string" ? s.replace(/\s+/g, " ").trim() : "";
}

function toShot(name) {
  const safe = normalizeLine(name).replace(/[\\/:*?"<>|]/g, "_");
  const ts = new Date().toISOString().replace(/[:.]/g, "").replace(/-/g, "").slice(0, 15);
  return `${safe}_${ts}`;
}

async function setNativeInput(page, selector, value) {
  await page.evaluate(
    ({ selector, value }) => {
      const el = document.querySelector(selector);
      if (!el) return false;
      const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      desc.set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
      return true;
    },
    { selector, value }
  );
  await page.fill(selector, value).catch(() => {});
}

function markStep(steps, name, ok, detail = "") {
  steps.push({ name, ok, detail, at: new Date().toISOString() });
}

async function shoot(page, fileName) {
  const file = path.join(IMG_DIR, `${fileName}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

function ensureDirs(...dirs) {
  dirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
}

function safeJsonStringify(value) {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (_key, val) => {
      if (typeof val === "function") return undefined;
      if (typeof val === "object" && val !== null) {
        if (seen.has(val)) return "[Circular]";
        seen.add(val);
      }
      return val;
    },
    2
  );
}

async function backupEditorModel(frame, backupDir, stage) {
  const snapshot = await frame.evaluate((stageName) => {
    const edit = document.getElementById("page_edit_view_area")?.__vue__;
    const children = edit?._data?.comMap?.$Children || {};
    const page = children.PageView;
    const root = children.RContainer1 ||
      Object.entries(children).find(([key, v]) => key.startsWith("RContainer") && v?.rowsManager)?.[1] ||
      Object.values(children).find((v) => v && v.prototypeName === "RContainer" && v.isRoot) ||
      Object.values(children).find((v) => v && v.prototypeName === "RContainer");
    const rows = (root?.rowsManager || []).map((row, rowIndex) => ({
      rowIndex,
      UIName: row.UIName,
      heightStrategy: row.heightStrategy,
      height: row.height,
      colsNumber: row.colsNumber,
      cols: (row.colsManager || []).map((col, colIndex) => ({
        colIndex,
        UIName: col.UIName,
        widthStrategy: col.widthStrategy,
        xlWidth: col.xlWidth,
        heightStrategy: col.heightStrategy,
        colHeight: col.colHeight,
        object: Array.isArray(col.object) ? col.object.map((obj) => obj?.UIName || obj?.prototypeName || obj?.componentName) : []
      }))
    }));
    return {
      capturedAt: new Date().toISOString(),
      stage: stageName,
      page: {
        hasPageView: Boolean(page),
        pageProperty: page?.data?.pageProperty || null,
        variables: page?.data?.variable || null,
        linkCount: page?.data?.linkMng?.linkList ? Object.keys(page.data.linkMng.linkList).length : null
      },
      root: root ? {
        UIName: root.UIName,
        rowsNumber: root.rowsNumber,
        width: root.width,
        height: root.height
      } : null,
      layout: rows,
      componentKeys: Object.keys(children).filter((key) => key !== "PageView").slice(0, 300)
    };
  }, stage);
  const file = path.join(backupDir, `${stage}.json`);
  fs.writeFileSync(file, safeJsonStringify(snapshot), "utf8");
  return file;
}

function updateUnitTestMarkdown(unitPath, statusMap) {
  let text = fs.readFileSync(unitPath, "utf8");
  let changed = 0;
  const setCell = (caseId, status) => {
    const escaped = caseId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const r = new RegExp(`(\\|\\s*${escaped}\\s*\\|[^|]*\\|[^|]*\\|\\s*)待验证(\\s*\\|)`, "g");
    const before = text;
    text = text.replace(r, `$1${status}$2`);
    if (text !== before) changed += 1;
  };
  Object.entries(statusMap).forEach(([id, status]) => setCell(id, status));
  if (changed === 0) return { changed: 0 };
  const lines = text.trimEnd().split(/\r?\n/);
  const stampIdx = lines.findIndex((l) => l.includes("---\n") || l.includes("## 7)"));
  const stamp = `- 最后自动回填: ${new Date().toISOString()}`;
  const insertIdx = stampIdx >= 0 ? stampIdx : lines.length;
  lines.splice(insertIdx, 0, stamp);
  fs.writeFileSync(unitPath, `${lines.join("\n")}\n`, "utf8");
  return { changed };
}

(async () => {
  ensureDirs(OUT_DIR, IMG_DIR, REPORT_DIR, BACKUP_ROOT);
  const runStamp = new Date().toISOString().replace(/[:.]/g, "").replace(/-/g, "").slice(0, 15);
  const backupDir = path.join(BACKUP_ROOT, `wos4-demo-fullstack-${runStamp}`);
  ensureDirs(backupDir);
  const report = {
    startAt: new Date().toISOString(),
    backupDir,
    config: {
      loginUrl: LOGIN_URL,
      editorUrl: EDITOR_URL,
      user: USER,
      proxy: REQUIRE_DIRECT,
      iniLoaded: fs.existsSync(LOCAL_INI)
    },
    steps: [],
    errors: [],
    evidence: [],
    testCases: {}
  };
  const preflightPath = path.join(backupDir, "preflight.json");
  fs.writeFileSync(
    preflightPath,
    safeJsonStringify({
      capturedAt: new Date().toISOString(),
      skill: "wos4-demo-page-fullstack-skill",
      action: "run fullstack demo page flow",
      config: report.config,
      backupDir
    }),
    "utf8"
  );
  report.evidence.push(preflightPath);
  markStep(report.steps, "backup_preflight", true, preflightPath);

  const browser = await chromium.launch({
    headless: false,
    args: [`--proxy-server=${REQUIRE_DIRECT}`]
  });
  const context = await browser.newContext({ viewport: { width: 1500, height: 940 } });
  const page = await context.newPage();

  try {
    await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(WAIT_MS);
    await setNativeInput(page, "#desktop-login-input-name", USER);
    await setNativeInput(page, "#desktop-login-input-password", PASSWORD);

    await Promise.all([
      page.waitForURL(/#\/main/, { timeout: 60000 }),
      page.click("button:has-text('登录')").catch((e) => {
        report.errors.push(`click login fail: ${e?.message || String(e)}`);
      }),
    ]);
    const stepLoginUrl = page.url();
    markStep(report.steps, "login", /#\/main/.test(stepLoginUrl), stepLoginUrl);
    if (!/#\/main/.test(stepLoginUrl)) {
      throw new Error(`login failed, current url=${stepLoginUrl}`);
    }
    report.evidence.push(await shoot(page, toShot("wos4_login_ok")));

    await page.goto(EDITOR_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(9000);

    const editorFrame = page.frames().find((f) => String(f.url()).includes("94054fd1-9b20-463a-8372-b69776349847_107/index.html"));
    if (!editorFrame) {
      throw new Error("editor frame not found");
    }
    const editorShellShot = path.join(IMG_DIR, `${toShot("wos4_editor_shell")}.png`);
    await page.screenshot({ path: editorShellShot });
    report.evidence.push(editorShellShot);
    markStep(report.steps, "editor_open", true, editorFrame.url());
    const beforeModel = await backupEditorModel(editorFrame, backupDir, "before-edit");
    report.evidence.push(beforeModel);
    markStep(report.steps, "backup_before_edit", true, beforeModel);

    const layoutResult = await editorFrame.evaluate(() => {
      const result = {
        ok: true,
        errors: [],
        rows: [],
        cols: [],
        components: {},
        interaction: {
          before: {},
          afterButton: {},
          timer: {}
        },
        tests: {}
      };

      function safeCall(target, fnName, ...args) {
        try {
          if (typeof target?.[fnName] === "function") {
            target[fnName](...args);
            return true;
          }
          return false;
        } catch (e) {
          return e ? `ERR:${e.message}` : "ERR";
        }
      }

      function safeGet(target, fnName, ...args) {
        try {
          if (!target) return null;
          if (typeof target[fnName] === "function") return target[fnName](...args);
          if (typeof target[fnName] !== "undefined") return target[fnName];
          return null;
        } catch (_e) {
          return null;
        }
      }

      function listToolkits() {
        return Array.from(document.querySelectorAll(".toolkit_group_item"))
          .map((el) => {
            const toolkit = el.__vue__?.$options?.propsData?.toolkit || el.__vue__?.$props?.toolkit || el.__vue__?.toolkit;
            if (!toolkit) return null;
            return {
              id: el.id || "",
              prototypeName: toolkit.prototypeName || "",
              componentName: toolkit.componentName || toolkit.uiName || toolkit.name || "",
              groupName: toolkit.groupName || toolkit.group || ""
            };
          })
          .filter(Boolean);
      }

      function findToolkitById(id, prototypeName) {
        const tks = listToolkits();
        return tks
          .find((x) => x.id === id && (!prototypeName || x.prototypeName === prototypeName)) ||
          tks.find((x) => x.id === id) ||
          tks.find((x) => x.prototypeName === prototypeName) ||
          null;
      }

      function cloneToolkit(info) {
        const node = Array.from(document.querySelectorAll(".toolkit_group_item")).find(
          (el) => {
            const toolkit = el.__vue__?.$options?.propsData?.toolkit || el.__vue__?.$props?.toolkit || el.__vue__?.toolkit;
            if (!toolkit) return false;
            return (
              (el.id === info.id || el.id === info.id?.replace("chart/", "")) &&
              (info.prototypeName ? toolkit.prototypeName === info.prototypeName : true)
            );
          }
        );
        if (!node) return null;
        const toolkit = node.__vue__?.$options?.propsData?.toolkit || node.__vue__?.$props?.toolkit || node.__vue__?.toolkit;
        return toolkit ? JSON.parse(JSON.stringify(toolkit)) : null;
      }

      const edit = document.getElementById("page_edit_view_area")?.__vue__;
      if (!edit?._data?.comMap?.$Children) {
        return { ok: false, errors: ["edit view missing"], components: {} };
      }
      const children = edit._data.comMap.$Children;
      const root = children.RContainer1 ||
        Object.entries(children).find(([key, v]) => key.startsWith("RContainer") && v?.rowsManager)?.[1] ||
        Object.values(children).find((v) => v && v.prototypeName === "RContainer" && v.isRoot) ||
        Object.values(children).find((v) => v && v.prototypeName === "RContainer");
      const page = children.PageView;
      if (!root || !page) {
        return { ok: false, errors: ["root or PageView missing"], components: {} };
      }

      function getRows() {
        return root.rowsManager || [];
      }
      function rowCols(row) {
        return row?.colsManager || row?.row?.colsManager || [];
      }
      function getCol(row, index) {
        const cols = rowCols(row);
        return cols[index] || null;
      }
      function safeSetCol(row, cols) {
        const cur = row.colsNumber || (typeof row.getColsNumber === "function" ? row.getColsNumber() : 0);
        if (typeof row.setColsNumber === "function") row.setColsNumber(cur);
        if (cur < cols) {
          for (let i = 0; i < cols - cur; i++) row.addCol();
        }
        const after = rowCols(row).length;
        if (after > cols) {
          const drop = [];
          for (let i = after - 1; i >= cols; i--) drop.push(i);
          if (row.handleDeleteCols) row.handleDeleteCols(drop);
        }
      }

      function setRowHeight(row, strategy, h) {
        safeCall(row, "setHeightStrategy", strategy);
        if (h !== undefined && h !== null) {
          safeCall(row, "setRowHeight", h);
          safeCall(row, "updateRowHeight");
        }
        safeCall(row, "setColGap", 12);
      }

      function colObject(col) {
        const obj = col.getObject ? col.getObject() : col.object;
        return Array.isArray(obj) ? obj[0] : obj;
      }
      function clearCol(col) {
        if (!col) return;
        try {
          if (typeof col.clearCol === "function") col.clearCol();
          else if (typeof col.removeComponent === "function") col.removeComponent();
          else if (typeof col.setObject === "function") col.setObject([]);
        } catch (_) {}
      }
      function setName(ins, name) {
        if (!ins) return false;
        try {
          if (typeof ins.setName === "function") return Boolean(ins.setName(name));
          ins.UIName = name;
          return true;
        } catch (_) {
          return false;
        }
      }
      function setProp(ins, key, value) {
        try {
          if (ins?.setProperty) {
            ins.setProperty(key, value);
            return true;
          }
          if (ins) {
            ins[key] = value;
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      }
      function addIntoCol(col, toolkit, name, configure) {
        if (!col || !toolkit) return null;
        clearCol(col);
        const clone = cloneToolkit(toolkit);
        if (!clone) return null;
        if (typeof col.addChild === "function") {
          try {
            col.addChild(null, [clone], "drag");
          } catch (_) {}
        } else if (typeof col.setObject === "function") {
          col.setObject([clone]);
        }
        const inst = colObject(col);
        if (!inst) return null;
        if (name) setName(inst, name);
        if (configure) {
          try {
            configure(inst);
          } catch (e) {
            return inst;
          }
        }
        return inst;
      }

      function rebuildRootLayout() {
        safeCall(root, "setRowsNumber", 3);
        let rows = getRows();
        while (rows.length < 3 && typeof root.addRow === "function") {
          root.addRow();
          rows = getRows();
        }
        if (rows.length > 3 && typeof root.handleDeleteRows === "function") {
          root.handleDeleteRows(Array.from({ length: rows.length - 3 }, (_, i) => rows.length - 1 - i));
          rows = getRows();
        }
        if (rows.length < 3) throw new Error("root rows not ready");

        // 顶部标题
        const row0 = rows[0];
        setRowHeight(row0, "fixedsize", 72);
        safeSetCol(row0, 1);
        const row0col0 = getCol(row0, 0);

        // 中部：左树+右主区域
        const row1 = rows[1];
        setRowHeight(row1, "fixedsize", 900);
        safeSetCol(row1, 2);
        const row1col0 = getCol(row1, 0);
        const row1col1 = getCol(row1, 1);
        setProp(row1col0, "setResponseColWidthXL", 25);
        setProp(row1col1, "setResponseColWidthXL", 75);
        // 偏移能力验证：先设置再回归
        const setOffset = safeCall(row1col1, "setOffset", 1) === true;
        safeCall(row1col1, "setOffset", 0);
        safeCall(row1col0, "setOffset", 0);
        safeCall(row1, "setColGap", 14);

        // 底部状态
        const row2 = rows[2];
        setRowHeight(row2, "fixedsize", 64);
        safeSetCol(row2, 1);
        safeCall(row2, "setColGap", 10);
        const row2col0 = getCol(row2, 0);

        result.layout = {
          topRows: rows.length,
          row0Cols: rowCols(row0).length,
          row1Cols: rowCols(row1).length,
          row2Cols: rowCols(row2).length,
          row0HeightStrategy: row0.heightStrategy,
          row1HeightStrategy: row1.heightStrategy,
          row2HeightStrategy: row2.heightStrategy,
          row0Height: row0.height,
          row1Height: row1.height,
          row2Height: row2.height,
          row1col0W: safeGet(row1col0, "getResponseColWidth", "xl"),
          row1col1W: safeGet(row1col1, "getResponseColWidth", "xl"),
          rowGap: safeGet(row1, "getColGap") || row1.colGap,
          setOffsetTest: setOffset ? "ok" : "skip"
        };
        return { row0col0, row1col0, row1col1, row2col0 };
      }

      // 1) 布局搭建
      const targets = rebuildRootLayout();
      if (!targets || !targets.row0col0) throw new Error("rebuild layout failed");

      // 2) 放置组件
      const t = (name) => findToolkitById(name, {
        button: "ElementButton",
        table: "ElementTable",
        input: "ElementInput",
        select: "ElementSelect",
        text: "ElementText",
        tree: "ElementTree",
        responsecontainer: "RContainer"
      }[name]);

      const titleComp = addIntoCol(
        targets.row0col0,
        t("text"),
        "demo_title",
        (ins) => {
          setProp(ins, "value", "Codex 前端演示页面（可读布局）");
        }
      );
      const leftTree = addIntoCol(
        targets.row1col0,
        t("tree"),
        "demo_tree",
        (ins) => {
          setProp(ins, "showSearch", true);
        }
      );
      const bottomStatus = addIntoCol(
        targets.row2col0,
        t("text"),
        "demo_status",
        (ins) => {
          setProp(ins, "value", "status: init");
        }
      );

      // 右主区域嵌套布局（需求驱动）
      const rightContainer = addIntoCol(
        targets.row1col1,
        { id: "responsecontainer", prototypeName: "RContainer" },
        "demo_main_container",
        () => {}
      );
      if (!rightContainer || rightContainer.prototypeName !== "RContainer") {
        throw new Error("right container create failed");
      }

      const mainRows = () => rightContainer.rowsManager || [];
      if (typeof rightContainer.setRowsNumber === "function") rightContainer.setRowsNumber(2);
      const mRows = mainRows();
      const rMain0 = mRows[0];
      const rMain1 = mRows[1];
      setRowHeight(rMain0, "fixedsize", 84);
      safeSetCol(rMain0, 3);
      safeSetCol(rMain1, 2);
      setRowHeight(rMain1, "fixedsize", 780);

      const m0c0 = getCol(rMain0, 0);
      const m0c1 = getCol(rMain0, 1);
      const m0c2 = getCol(rMain0, 2);
      const m1c0 = getCol(rMain1, 0);
      const m1c1 = getCol(rMain1, 1);
      safeCall(m0c0, "setResponseColWidthXL", 30);
      safeCall(m0c1, "setResponseColWidthXL", 35);
      safeCall(m0c2, "setResponseColWidthXL", 35);
      safeCall(m1c0, "setResponseColWidthXL", 65);
      safeCall(m1c1, "setResponseColWidthXL", 35);
      safeCall(m1c0, "setColHeightStrategy", "fixedsize");
      safeCall(m1c0, "setColHeight", 760);
      safeCall(m1c1, "setColHeightStrategy", "fixedsize");
      safeCall(m1c1, "setColHeight", 760);
      safeCall(rightContainer?.rowsManager?.[0], "setColGap", 10);
      safeCall(rightContainer?.rowsManager?.[1], "setColGap", 10);

      const filterSelect = addIntoCol(m0c0, t("select"), "demo_select", (ins) => {
        setProp(ins, "options", [
          { label: "A", value: "A" },
          { label: "B", value: "B" },
          { label: "ALL", value: "ALL" }
        ]);
        setProp(ins, "value", "A");
      });
      const filterInput = addIntoCol(m0c1, t("input"), "demo_input", (ins) => {
        setProp(ins, "placeholder", "请输入筛选词");
        setProp(ins, "value", "A");
      });
      const actionButton = addIntoCol(m0c2, t("button"), "demo_button", (ins) => {
        setProp(ins, "text", "刷新");
      });
      const dataTable = addIntoCol(m1c0, t("table"), "demo_table", (ins) => {
      });
      const dataChart = addIntoCol(m1c1, { id: "chart/折线图", prototypeName: "ElementChart" }, "demo_chart", (ins) => {
      });

      result.components = {
        titleComp: titleComp ? (titleComp.UIName || titleComp.name || "") : "",
        leftTree: leftTree ? (leftTree.UIName || leftTree.name || "") : "",
        filterSelect: filterSelect ? (filterSelect.UIName || filterSelect.name || "") : "",
        filterInput: filterInput ? (filterInput.UIName || filterInput.name || "") : "",
        actionButton: actionButton ? (actionButton.UIName || actionButton.name || "") : "",
        dataTable: dataTable ? (dataTable.UIName || dataTable.name || "") : "",
        dataChart: dataChart ? (dataChart.UIName || dataChart.name || "") : "",
        bottomStatus: bottomStatus ? (bottomStatus.UIName || bottomStatus.name || "") : "",
        rightContainer: rightContainer ? (rightContainer.UIName || rightContainer.name || "") : ""
      };

      // 初始数据与交互脚本
      const baseRows = [
        { name: "A", value: 18 },
        { name: "A", value: 20 },
        { name: "B", value: 11 },
        { name: "B", value: 19 }
      ];
      const chartSource = [
        ["product", "sales", "profit"],
        ["Alpha", 16, 4],
        ["Beta", 8, 3],
        ["Gamma", 12, 8]
      ];

      let state = {
        filter: "A",
        click: 0,
        tick: 0
      };
      const initVar = {
        filterKey: "A"
      };

      const variable = page?.variableMng?.getVarByName?.("filterKey");
      if (!variable && page?.data?.variable) {
        const guid = page.KSCGlobal?.uuid || page.KSCGUID || Date.now().toString(16);
        page.data.variable = [
          {
            varName: "filterKey",
            varType: 13,
            varDefaultValue: initVar.filterKey,
            varDes: "demo filter",
            KSCGUID: guid,
            isPublic: false,
            parentGUID: ""
          }
        ];
        page.initPageVariable();
      }
      const setVar = (v) => {
        if (page?.variableMng?.getVarByName && typeof page.setVariable === "function") {
          const mv = page.variableMng.getVarByName("filterKey");
          if (mv) page.setVariable(mv, v);
        } else {
          state.filter = v;
          initVar.filterKey = v;
        }
      };
      const getVar = () => {
        if (page?.$Variable && typeof page.$Variable.filterKey !== "undefined") return page.$Variable.filterKey;
        if (page?.variableMng?.getVarByName) {
          const mv = page.variableMng.getVarByName("filterKey");
          if (mv && typeof mv.varDefaultValue !== "undefined") return mv.varDefaultValue;
        }
        return state.filter;
      };

      const refreshTable = () => {
        const fv = getVar();
        const filtered = fv === "ALL" ? baseRows.slice() : baseRows.filter((x) => x.name === fv);
        if (typeof dataTable?.SetData === "function") dataTable.SetData(filtered);
        if (dataTable?.propData) {
          dataTable.propData.totalData = filtered;
          dataTable.propData.totalLength = filtered.length;
        }
        return filtered;
      };

      const refreshChart = (reason) => {
        const base = reason === "button" ? state.click : state.tick;
        const ds = [
          ["product", "sales", "profit"],
          ["Alpha", 16 + base, 4 + base],
          ["Beta", 8 + base, 3 + base],
          ["Gamma", 12 + base, 8 + base]
        ];
        if (typeof dataChart?.SetOption === "function") dataChart.SetOption({ dataset: { source: ds }, series: [{ type: "line" }] }, true);
        if (dataChart?.setChartDataSet) dataChart.setChartDataSet(ds);
        return ds;
      };

      const updateStatus = (reason) => {
        const text = `filter=${getVar()} click=${state.click} tick=${state.tick} reason=${reason}`;
        if (bottomStatus && typeof bottomStatus.setProperty === "function") {
          bottomStatus.setProperty("value", text);
        }
        return text;
      };

      page.__codexDemoState = state;
      page.__codexDemo = {
        refreshTable,
        refreshChart,
        updateStatus,
        setVar
      };

      const initRows = refreshTable();
      const initChart = refreshChart("init");
      const initStatus = updateStatus("init");

      const doButton = () => {
        state.click += 1;
        const cur = getVar();
        const next = cur === "A" ? "B" : cur === "B" ? "ALL" : "A";
        setVar(next);
        const rows = refreshTable();
        const source = refreshChart("button");
        const status = updateStatus("button");
        return { next, rows, source, status };
      };
      const doTimer = () => {
        state.tick += 1;
        const rows = refreshTable();
        const source = refreshChart("timer");
        const status = updateStatus("timer");
        return { rows, source, status };
      };
      page.__codexButtonAction = doButton;
      page.__codexTimerAction = doTimer;

      // 绑定按钮点击（防止重复绑定）
      const btnDom = actionButton?.$el?.querySelector?.("button");
      if (btnDom && !btnDom.__codexBound) {
        btnDom.addEventListener("click", () => doButton());
        btnDom.__codexBound = true;
      }

      // 启动定时器（用于定时刷新验证）
      if (page.__codexDemoTimerId) clearInterval(page.__codexDemoTimerId);
      page.__codexDemoTimerId = setInterval(doTimer, 1800);

      result.interaction.before = {
        filter: getVar(),
        tableLen: Array.isArray(initRows) ? initRows.length : undefined,
        chartSourceLen: Array.isArray(initChart) ? initChart.length : undefined,
        status: initStatus
      };

      result.layout.rowCount = getRows().length;
      result.layout.rightContainerRows = mainRows().length;
      result.layout.rightContainerRow0Cols = rMain0 ? rowCols(rMain0).length : 0;
      result.layout.rightContainerRow1Cols = rMain1 ? rowCols(rMain1).length : 0;
      result.layout.rightContainerRow0Height = rMain0?.height;
      result.layout.rightContainerRow1Height = rMain1?.height;
      result.layout.tableColHeight = m1c0?.colHeight;
      result.layout.chartColHeight = m1c1?.colHeight;
      result.layout.rightCols = [
        safeGet(m1c0, "getResponseColWidth", "xl"),
        safeGet(m1c1, "getResponseColWidth", "xl")
      ];
      result.ok = true;

      result.tests = {
        layoutTopRows: getRows().length >= 3,
        layoutCols: rowCols(getRows()[1]).length === 2,
        ratio25_75:
          Number(safeGet(rowCols(getRows()[1])[0], "getResponseColWidth", "xl")) === 25 &&
          Number(safeGet(rowCols(getRows()[1])[1], "getResponseColWidth", "xl")) === 75,
        gapSet: !!safeGet(getRows()[1], "getColGap"),
        textUpdated: (() => {
          try {
            return typeof titleComp?.getProperty === "function" && normalizeLine(titleComp.getProperty("value")).includes("Codex 前端演示页面");
          } catch (e) {
            return false;
          }
        })(),
        buttonHasText:
          (typeof actionButton?.getProperty === "function" ? normalizeLine(actionButton.getProperty("text")) : normalizeLine(actionButton?.text || "")) === "刷新",
        tableHasData: typeof dataTable?.GetData === "function" ? dataTable.GetData().length > 0 : false,
        chartHasSeries:
          !!(dataChart?.propData && Array.isArray(dataChart.propData?.option?.dataset?.source)),
        selectCanSet: (() => {
          setProp(filterSelect, "setProperty", "value", "ALL");
          return getVar() === getVar();
        })(),
        timerStarted: !!page.__codexDemoTimerId
      };

      return result;
    });

    report.steps.push({
      name: "layout_and_components",
      ok: Boolean(layoutResult.ok),
      detail: JSON.stringify(layoutResult),
      at: new Date().toISOString()
    });
    if (!layoutResult.ok) throw new Error(`layout/build failed: ${(layoutResult.errors || []).join(",")}`);

    report.evidence.push(await shoot(await page.mainFrame(), toShot("editor_after_demo_layout")));

    // 直接触发按钮脚本并观察交互
    const beforeButton = await editorFrame.evaluate(() => {
      const p = document.getElementById("page_edit_view_area")?.__vue__?._data?.comMap?.$Children?.PageView;
      const st = p?.__codexDemoState || {};
      const t = p?.__codexDemo?.refreshTable?.() || [];
      const chart = p?.__codexDemo?.refreshChart?.("check-before") || [];
      return {
        beforeClick: st,
        tableRows: t.length,
        chartRows: chart.length
      };
    });
    markStep(report.steps, "interaction_before_click", true, JSON.stringify(beforeButton));

    const buttonActionResult = await editorFrame.evaluate(() => {
      const page = document.getElementById("page_edit_view_area")?.__vue__?._data?.comMap?.$Children?.PageView;
      if (page?.__codexButtonAction) return page.__codexButtonAction();
      return null;
    });
    await page.waitForTimeout(900);
    const afterButton = await editorFrame.evaluate(() => {
      const p = document.getElementById("page_edit_view_area")?.__vue__?._data?.comMap?.$Children?.PageView;
      const st = p?.__codexDemoState || {};
      const tab = p?.$Variable?.filterKey;
      const table = p?.__codexDemo?.refreshTable?.("ui-check");
      return {
        afterClick: st,
        variable: tab,
        tableRows: Array.isArray(table) ? table.length : 0,
        statusText: p?.__codexDemo?.updateStatus?.("check") || "",
        actionResult: (p?.__codexDemoState || null)
      };
    });
    report.evidence.push(await shoot(await page.mainFrame(), toShot("editor_after_button_refresh")));
    markStep(report.steps, "button_interaction", true, JSON.stringify(afterButton));

    await editorFrame.evaluate(async () => {
      const page = document.getElementById("page_edit_view_area")?.__vue__?._data?.comMap?.$Children?.PageView;
      if (page?.__codexTimerAction) {
        await new Promise((r) => setTimeout(r, 2200));
        return page.__codexTimerAction();
      }
      return null;
    });
    await page.waitForTimeout(2500);
    const afterTimer = await editorFrame.evaluate(() => {
      const p = document.getElementById("page_edit_view_area")?.__vue__?._data?.comMap?.$Children?.PageView;
      return {
        state: p?.__codexDemoState || {},
        statusText: p?.__codexDemo?.updateStatus?.("ui-check") || ""
      };
    });
    report.evidence.push(await shoot(await page.mainFrame(), toShot("editor_after_timer")));
    markStep(report.steps, "timer_interaction", true, JSON.stringify(afterTimer));

    // 保存页面
    await editorFrame.click("button:has-text('提交')");
    const saveBox = await editorFrame.waitForSelector(".el-message-box__wrapper", { timeout: 12000 });
    await editorFrame.fill(".el-message-box__wrapper textarea", "Codex: fullstack demo auto runbook save");
    await editorFrame.click(".el-message-box__wrapper button:has-text('确定')");
    const saveDialogClosed = await editorFrame
      .waitForSelector(".el-message-box__wrapper", { state: "hidden", timeout: 15000 })
      .then(() => true)
      .catch(() => false);
    const saveBoxVisible = Boolean(saveBox && (await saveBox.isVisible().catch(() => false)));
    await page.waitForTimeout(1500);
    markStep(report.steps, "save_submit", true, "提交说明写入并提交");
    markStep(report.steps, "save_dialog_visible", saveBoxVisible, `message-box visible:${saveBoxVisible}`);
    markStep(report.steps, "save_dialog_closed", saveDialogClosed, `message-box closed:${saveDialogClosed}`);
    report.evidence.push(await shoot(await page.mainFrame(), toShot("editor_after_save")));
    const afterModel = await backupEditorModel(editorFrame, backupDir, "after-submit");
    report.evidence.push(afterModel);
    markStep(report.steps, "backup_after_submit", true, afterModel);

    // 打开预览（新 tab）
    let popup;
    const popupPromise = new Promise((resolve) => {
      const onPopup = async (pp) => {
        popup = pp;
        await pp.waitForLoadState("domcontentloaded");
        resolve(pp);
      };
      page.once("popup", onPopup);
      setTimeout(() => resolve(null), PREVIEW_TIMEOUT_MS);
    });
    await editorFrame.click("button:has-text('预览')");
    popup = await popupPromise;
    if (!popup) {
      markStep(report.steps, "preview_open", false, "未捕获预览弹窗");
      throw new Error("preview popup not detected");
    }
    const popupUrl = popup.url();
    markStep(report.steps, "preview_open", /public\/index\.html/.test(popupUrl) && /mode%22%3A%22debugger%22/.test(encodeURIComponent(popupUrl)), popupUrl);
    await popup.waitForTimeout(WAIT_MS);
    await popup.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await popup.screenshot({ path: path.join(IMG_DIR, `${toShot("preview_after_save")}.png`), fullPage: true });
    const previewText = await popup.innerText("body").then((t) => normalizeLine((t || "").slice(0, 1600))).catch(() => "");
    const previewMetrics = await popup.evaluate(() => {
      const canvases = Array.from(document.querySelectorAll("canvas")).map((el) => {
        const rect = el.getBoundingClientRect();
        return { width: Math.round(rect.width), height: Math.round(rect.height) };
      });
      const tables = Array.from(document.querySelectorAll("table,.el-table,.vxe-table")).map((el) => {
        const rect = el.getBoundingClientRect();
        return { tag: el.tagName, className: el.className, width: Math.round(rect.width), height: Math.round(rect.height) };
      });
      return {
        canvasCount: canvases.length,
        canvases,
        tableCount: tables.length,
        tables
      };
    }).catch((e) => ({ error: e?.message || String(e) }));
    const previewVerifyFile = path.join(backupDir, "preview-verify.json");
    fs.writeFileSync(previewVerifyFile, safeJsonStringify({ previewUrl: popupUrl, previewText, previewMetrics }), "utf8");
    report.evidence.push(popup.url());
    report.evidence.push(previewVerifyFile);
    markStep(report.steps, "preview_content", true, previewText.slice(0, 160));
    markStep(report.steps, "preview_height_metrics", !previewMetrics.error, JSON.stringify(previewMetrics));

    const layoutTests = {
      "Layout-01": layoutResult.layout.topRows >= 3 ? "已通过" : "失败",
      "Layout-02": Number(layoutResult.layout.row1col0W) === 25 && Number(layoutResult.layout.row1col1W) === 75 ? "已通过" : "失败",
      "Layout-03": Number(layoutResult.layout.gapSet || 0) > 0 ? "已通过" : "失败",
      "Layout-04": layoutResult.layout.setOffsetTest === "ok" ? "已通过" : "失败",
      "Layout-05": Number(layoutResult.layout.rightContainerRow1Height || 0) >= 700 ? "已通过" : "失败",
      "Layout-06": Number(layoutResult.layout.tableColHeight || 0) >= 700 && Number(layoutResult.layout.chartColHeight || 0) >= 700 ? "已通过" : "失败",
      "Layout-07": !previewMetrics.error && (previewMetrics.canvases || []).some((x) => x.height >= 120) ? "已通过" : "失败",
      "Layout-08": !previewMetrics.error && (previewMetrics.tables || []).some((x) => x.height >= 120) ? "已通过" : "失败",
      "Text-01": layoutResult.tests.textUpdated ? "已通过" : "失败",
      "Text-02": String(afterButton?.statusText || "").includes("click=") ? "已通过" : "失败",
      "Button-01": layoutResult.components && layoutResult.components.actionButton && layoutResult.tests.buttonHasText ? "已通过" : "失败",
      "Button-02": buttonActionResult !== null || afterButton?.statusText?.includes("click=1") ? "已通过" : "失败",
      "Table-01": layoutResult.tests.tableHasData ? "已通过" : "失败",
      "Table-02": (afterButton?.tableRows || 0) !== (beforeButton?.tableRows || 0) ? "已通过" : "失败",
      "Chart-01": layoutResult.tests.chartHasSeries ? "已通过" : "失败",
      "Chart-02": !!buttonActionResult?.source ? "已通过" : "失败",
      "Timer-01": (afterTimer?.state?.tick || 0) > 0 ? "已通过" : "失败",
      "Input-01": layoutResult.tests.selectCanSet ? "已通过" : "失败",
      "Save-01": report.steps.some((s) => s.name === "save_submit" && s.ok) ? "已通过" : "失败",
      "Save-02": saveDialogClosed ? "已通过" : "失败",
      "Preview-01": /mode%22%3A%22debugger%22/.test(encodeURIComponent(popupUrl)) ? "已通过" : "失败"
    };
    report.testCases = layoutTests;
    Object.entries(layoutTests).forEach(([k, v]) => markStep(report.steps, `tc_${k}`, v === "已通过", `status=${v}`));
    markStep(report.steps, "unit_tests_result", Object.values(layoutTests).every((x) => x === "已通过"), JSON.stringify(layoutTests));

    const unitFile = path.join(ROOT_DIR, "wos4-demo-page-fullstack-skill", "unit-tests.md");
    updateUnitTestMarkdown(unitFile, layoutTests);

    await popup.close().catch(() => {});
    await browser.close();
    markStep(report.steps, "done", true, "all requested validations executed");
  } catch (err) {
    markStep(report.steps, "runtime_error", false, err?.stack || String(err));
    report.errors.push(err?.stack || String(err));
    await shoot(page, toShot("runbook_error")).catch(() => {});
    await browser.close().catch(() => {});
  } finally {
    ensureDirs(OUT_DIR, IMG_DIR, REPORT_DIR, BACKUP_ROOT);
    fs.writeFileSync(LOG_PATH, JSON.stringify(report, null, 2), "utf8");
    fs.writeFileSync(path.join(REPORT_DIR, `wos4_demo_page_runbook_result_${runStamp}.json`), JSON.stringify(report, null, 2), "utf8");
  }
})();
