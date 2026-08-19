const MASK = 0x55;
const HEADER_SIZE = 6;
const KEY_RECORD_SIZE = 9;
const MACRO_HEADER_SIZE = 7;
const MACRO_SLOT_COUNT = 50;
const MACRO_NAME_SIZE = 16;

const CATEGORY_NAMES = new Map([
  [1, "기본메뉴"],
  [2, "대화"],
  [3, "기타 단축키"],
  [4, "조작"],
  [5, "통합슬롯"],
  [6, "매크로"],
  [7, "이모션"],
]);

const ACTION_LABELS = new Map([
  [1001, "능력치"], [1002, "기본정보"], [1003, "일기장"], [1004, "인벤토리"],
  [1005, "스킬창"], [1006, "퀘스트"], [1007, "편지함 열기"], [1008, "친구 창"],
  [1009, "길드"], [1010, "유저 목록"], [1011, "게시판"], [1012, "제조"],
  [1013, "강화"], [1014, "정령"], [1015, "보스"], [1016, "퀵던전"],
  [1017, "캐시샵"], [1018, "이벤트"], [1019, "신성"],
  [2001, "전체 채팅 전환"], [2002, "커스텀 채팅 전환"], [2003, "외치기"],
  [2004, "귓속말"], [2005, "귓속말 빠른답장"], [2006, "귓속말 차단"],
  [2008, "채팅입력"], [2009, "채팅 매크로 설정"], [2020, "그룹채팅"], [2021, "길드채팅"],
  [3001, "설정"], [3002, "설정(게임설정)"], [3003, "설정(단축키)"],
  [3004, "전체맵(FullMap)"], [3005, "타일맵 보기"], [3007, "스크린샷"],
  [3008, "UI편집모드"], [3009, "액션범위 표시"], [3010, "시야 확대"],
  [3011, "시야 축소"], [3012, "통합슬롯 접기/펼치기"],
  [4001, "마법사용"], [4002, "마우스 우클릭"], [4003, "캐릭터 위쪽(북) 이동"],
  [4004, "캐릭터 오른쪽(동) 이동"], [4005, "캐릭터 아래쪽(남) 이동"],
  [4006, "캐릭터 왼쪽(서) 이동"], [4011, "타게팅 취소"], [4012, "아이템줍기"],
  [4013, "기본 공격"], [4014, "무기방패 해제"], [4015, "무기 해제"],
  [4016, "방패 해제"], [4017, "캐시머리 보이기/숨기기"], [4018, "캐시옷 보이기/숨기기"],
  [4019, "캐시무기 보이기/숨기기"], [4020, "캐시신발 보이기/숨기기"],
  [4021, "몬스터 타겟팅"], [4035, "그룹원 확인"], [4036, "캐릭터 리프레쉬"],
  [4037, "취소"], [4038, "마우스 좌클릭"],
  [5001, "통합슬롯1"], [5002, "통합슬롯2"], [5003, "통합슬롯3"],
  [5004, "통합슬롯4"], [5005, "통합슬롯5"], [5006, "통합슬롯6"], [5007, "통합슬롯7"],
  [6001, "모든 매크로정지"],
]);

for (let member = 1; member <= 12; member += 1) {
  ACTION_LABELS.set(4022 + member, `그룹원${member} 타겟팅`);
}
for (let button = 1; button <= 36; button += 1) {
  ACTION_LABELS.set(5007 + button, `통합슬롯 버튼${button}`);
}
const DEFAULT_MACRO_NAMES = [
  "수벗크래셔", "집중매드크래셔", "쿠로토", "수로물약", "수로저주나르", "템고치기",
  "텔깃", "경돌체사기", "함찾텔깃", "하이드", "가호", "test",
];
for (let slot = 1; slot <= MACRO_SLOT_COUNT; slot += 1) {
  const suffix = DEFAULT_MACRO_NAMES[slot - 1] ? `-${DEFAULT_MACRO_NAMES[slot - 1]}` : "";
  ACTION_LABELS.set(6001 + slot, `매크로${slot}${suffix}`);
}
for (let slot = 1; slot <= 33; slot += 1) {
  ACTION_LABELS.set(7000 + slot, `Emotion${String(slot).padStart(2, "0")}`);
}

const KEY_OPTIONS = [
  [0x00, "None"], [0x01, "Space"], [0x02, "Enter"], [0x03, "Tab"], [0x04, "`"],
  [0x05, "'"], [0x06, ";"], [0x07, ","], [0x08, "."], [0x09, "/"], [0x0A, "\\"],
  [0x0B, "["], [0x0C, "]"], [0x0D, "-"], [0x0E, "="],
  [0x0F, "A"], [0x10, "B"], [0x11, "C"], [0x12, "D"], [0x13, "E"], [0x14, "F"],
  [0x15, "G"], [0x16, "H"], [0x17, "I"], [0x18, "J"], [0x19, "K"], [0x1A, "L"],
  [0x1B, "M"], [0x1C, "N"], [0x1D, "O"], [0x1E, "P"], [0x1F, "Q"], [0x20, "R"],
  [0x21, "S"], [0x22, "T"], [0x23, "U"], [0x24, "V"], [0x25, "W"], [0x26, "X"],
  [0x27, "Y"], [0x28, "Z"],
  [0x29, "1"], [0x2A, "2"], [0x2B, "3"], [0x2C, "4"], [0x2D, "5"], [0x2E, "6"],
  [0x2F, "7"], [0x30, "8"], [0x31, "9"], [0x32, "0"],
  [0x3B, "ContextMenu"], [0x3D, "Left"], [0x3E, "Right"], [0x3F, "Up"], [0x40, "Down"],
  [0x41, "Backspace"], [0x42, "PgDown"], [0x43, "PgUp"], [0x44, "Home"], [0x45, "End"],
  [0x46, "Insert"], [0x47, "Delete"], [0x48, "CapsLock"], [0x4A, "PrintScreen"],
  [0x4B, "ScrollLock"], [0x4C, "Pause"], [0x4F, "*"], [0x50, "+"],
  [0x5E, "F1"], [0x5F, "F2"], [0x60, "F3"], [0x61, "F4"], [0x62, "F5"],
  [0x63, "F6"], [0x64, "F7"], [0x65, "F8"], [0x66, "F9"], [0x67, "F10"],
  [0x68, "F11"], [0x69, "F12"],
];
const KEY_NAME_BY_CODE = new Map(KEY_OPTIONS);
const KEY_CODE_BY_NAME = new Map(KEY_OPTIONS.map(([code, name]) => [name.toLowerCase(), code]));
const SPECIAL_KEY_BUTTONS = [
  "Space", "Enter", "Tab", "Backspace",
  "Insert", "Delete", "Home", "End",
  "PgUp", "PgDown", "ContextMenu", "CapsLock",
  "Up", "Down", "Left", "Right",
  "PrintScreen",
  "ScrollLock", "Pause", "F1",
  "F2", "F3", "F4", "F5",
  "F6", "F7", "F8", "F9",
  "F10", "F11", "F12",
];
const DIRECTORY_DB_NAME = "lod-keyopt-handles";
const DIRECTORY_STORE_NAME = "handles";
const RECENT_DIRECTORY_KEY = "recent-config-folder";

const state = {
  directoryHandle: null,
  files: [],
  source: null,
  target: null,
  selectedIds: new Set(),
  selectedMacros: new Set(),
  saveMode: "new",
  validationOk: false,
  validationKey: "",
  showChangedOnly: true,
  collapsedCategories: new Set(["이모션"]),
  expandedLongCategories: new Set(),
  showAllMacros: false,
  macroTargets: new Map(),
  macroHotkeyEdits: new Map(),
  hotkeyEdits: new Map(),
  activeHotkeyEdit: null,
};

const $ = (id) => document.getElementById(id);
const textDecoder = new TextDecoder("euc-kr", { fatal: false });

function setStatus(text) {
  $("status").textContent = text;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  }[ch]));
}

function formatSize(bytes) {
  return `${Number(bytes || 0).toLocaleString()} B`;
}

function showFileStatus(text, isError = false) {
  $("fileListStatus").className = isError ? "error" : "muted";
  $("fileListStatus").textContent = text;
}

function showPanelError(targetId, error) {
  $(targetId).innerHTML = `<div class="error">${escapeHtml(error.message || String(error))}</div>`;
}

function openDirectoryDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DIRECTORY_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(DIRECTORY_STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function directoryStore(mode, callback) {
  const db = await openDirectoryDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(DIRECTORY_STORE_NAME, mode);
      const store = tx.objectStore(DIRECTORY_STORE_NAME);
      const request = callback(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

async function saveRecentDirectoryHandle(handle) {
  try {
    await directoryStore("readwrite", (store) => store.put(handle, RECENT_DIRECTORY_KEY));
  } catch {
    localStorage.setItem("lod-keyopt-last-folder-name", handle?.name || "");
  }
}

async function loadRecentDirectoryHandle() {
  try {
    return await directoryStore("readonly", (store) => store.get(RECENT_DIRECTORY_KEY));
  } catch {
    return null;
  }
}

async function pickDirectoryWithRecentStart() {
  const recentHandle = await loadRecentDirectoryHandle();
  const attempts = [];
  if (recentHandle) attempts.push({ mode: "read", id: "lod-keyopt-config-folder", startIn: recentHandle });
  attempts.push({ mode: "read", id: "lod-keyopt-config-folder" });
  let lastError = null;
  for (const options of attempts) {
    try {
      return await window.showDirectoryPicker(options);
    } catch (error) {
      if (error?.name === "AbortError") throw error;
      lastError = error;
    }
  }
  throw lastError || new Error("폴더 선택창을 열지 못했습니다.");
}

function cloneBytes(bytes) {
  return new Uint8Array(bytes);
}

function concatBytes(...parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function decodeMasked(bytes) {
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) out[i] = bytes[i] ^ MASK;
  return out;
}

function encodeMasked(decoded) {
  return decodeMasked(decoded);
}

function keymapField(decoded) {
  if (decoded.length < HEADER_SIZE) throw new Error("키세팅 파일이 너무 짧습니다.");
  return decoded[1] | (decoded[2] << 8);
}

function keyRecordCount(decoded) {
  const field = keymapField(decoded);
  if (field < 3 || (field - 3) % KEY_RECORD_SIZE !== 0) {
    throw new Error(`알 수 없는 키맵 길이 값입니다: ${field}`);
  }
  const count = (field - 3) / KEY_RECORD_SIZE;
  const end = HEADER_SIZE + count * KEY_RECORD_SIZE;
  if (end > decoded.length) throw new Error("키맵 영역이 파일 끝을 넘어갑니다.");
  return count;
}

function macroDataOffset(decoded) {
  return HEADER_SIZE + keyRecordCount(decoded) * KEY_RECORD_SIZE;
}

function internalKeyName(code) {
  return KEY_NAME_BY_CODE.get(Number(code)) || `0x${Number(code).toString(16).padStart(2, "0").toUpperCase()}`;
}

function hotkeyFromParts(flags, keyCode) {
  const key = internalKeyName(keyCode);
  if (!flags?.[3]) return "";
  if (!keyCode) return "None";
  const parts = [];
  if (flags[1]) parts.push("Shift");
  if (flags[0]) parts.push("Alt");
  if (flags[2]) parts.push("Ctrl");
  parts.push(key);
  return parts.join("+");
}

function categoryName(actionId) {
  const group = Math.floor(actionId / 1000);
  return CATEGORY_NAMES.get(group) || `${group}xxx`;
}

function actionLabel(actionId) {
  return ACTION_LABELS.get(actionId) || "";
}

function iterKeyRecords(decoded) {
  const count = keyRecordCount(decoded);
  const rows = [];
  for (let index = 0; index < count; index += 1) {
    const offset = HEADER_SIZE + index * KEY_RECORD_SIZE;
    const record = decoded.slice(offset, offset + KEY_RECORD_SIZE);
    const actionId = record[2] | (record[3] << 8);
    const flags = Array.from(record.slice(4, 8));
    const keyCode = record[8];
    rows.push({
      index,
      offset,
      raw_hex: Array.from(record).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" "),
      b0: record[0],
      b1: record[1],
      action_id: actionId,
      group: Math.floor(actionId / 1000),
      category: categoryName(actionId),
      label: actionLabel(actionId),
      flags,
      key_code: keyCode,
      key_name: internalKeyName(keyCode),
      hotkey: hotkeyFromParts(flags, keyCode),
    });
  }
  return rows;
}

function recordByAction(summary) {
  return new Map((summary?.records || []).map((row) => [row.action_id, row]));
}

function decodeMacroName(bytes) {
  const nul = bytes.indexOf(0);
  const useful = nul >= 0 ? bytes.slice(0, nul) : bytes;
  return textDecoder.decode(useful).trim();
}

function macroEventText(event) {
  if (event.length !== 3) {
    return Array.from(event).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  }
  const [flag1, flag2, code] = event;
  if (flag1 === 0x00) return `Delay ${flag2 | (code << 8)}ms`;
  if (flag1 === 0x01 && flag2 === 0xA0 && code === 0x00) return "WheelUp";
  if (flag1 === 0x01 && flag2 === 0x80 && code === 0x00) return "WheelDown";
  if (flag2 === 0x50) {
    const modifiers = [];
    if (flag1 & 0x20) modifiers.push("Shift");
    if (flag1 & 0x10) modifiers.push("Alt");
    if (flag1 & 0x40) modifiers.push("Ctrl");
    modifiers.push(internalKeyName(code));
    return modifiers.join("+");
  }
  return Array.from(event).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
}

function parseMacroEntries(decoded) {
  const offset = macroDataOffset(decoded);
  const data = decoded.slice(offset);
  if (data.length < MACRO_HEADER_SIZE) return [];
  let pos = MACRO_HEADER_SIZE;
  const entries = [];
  for (let slot = 1; slot <= MACRO_SLOT_COUNT; slot += 1) {
    const entryOffset = offset + Math.min(pos, data.length);
    let rawEntry;
    let count = 0;
    let events = [];
    let name = "";
    if (pos >= data.length) {
      rawEntry = new Uint8Array(1 + MACRO_NAME_SIZE);
    } else {
      count = data[pos];
      const entryLen = 1 + count * 3 + MACRO_NAME_SIZE;
      rawEntry = new Uint8Array(entryLen);
      rawEntry.set(data.slice(pos, Math.min(pos + entryLen, data.length)));
      const eventsStart = 1;
      const eventsEnd = eventsStart + count * 3;
      for (let i = eventsStart; i < eventsEnd; i += 3) {
        events.push(rawEntry.slice(i, i + 3));
      }
      name = decodeMacroName(rawEntry.slice(eventsEnd, eventsEnd + MACRO_NAME_SIZE));
      pos += entryLen;
    }
    const actionId = 6001 + slot;
    const eventRows = events.map((event) => ({
      raw_hex: Array.from(event).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" "),
      text: macroEventText(event),
    }));
    entries.push({
      slot,
      action_id: actionId,
      label: actionLabel(actionId),
      name,
      event_count: count,
      events: eventRows,
      sequence: eventRows.map((event) => event.text).join(" -> "),
      raw: rawEntry,
      offset: entryOffset,
      empty: count === 0 && !name,
    });
  }
  return entries;
}

function macroEntryBytes(entry) {
  if (!entry?.raw) return new Uint8Array(1 + MACRO_NAME_SIZE);
  const raw = entry.raw;
  const count = raw[0] || 0;
  const expected = 1 + count * 3 + MACRO_NAME_SIZE;
  const out = new Uint8Array(expected);
  out.set(raw.slice(0, Math.min(raw.length, expected)));
  return out;
}

function rebuildMacroData(baseDecoded, sourceDecoded, moves) {
  let baseData = baseDecoded.slice(macroDataOffset(baseDecoded));
  if (baseData.length < MACRO_HEADER_SIZE) {
    baseData = new Uint8Array([0x00, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00]);
  }
  const header = cloneBytes(baseData.slice(0, MACRO_HEADER_SIZE));
  const baseEntries = new Map(parseMacroEntries(baseDecoded).map((entry) => [entry.slot, macroEntryBytes(entry)]));
  const sourceEntries = new Map(parseMacroEntries(sourceDecoded).map((entry) => [entry.slot, macroEntryBytes(entry)]));
  const outputEntries = new Map();
  for (let slot = 1; slot <= MACRO_SLOT_COUNT; slot += 1) {
    outputEntries.set(slot, baseEntries.get(slot) || new Uint8Array(1 + MACRO_NAME_SIZE));
  }
  for (const move of moves) {
    const sourceSlot = Number(move.source_slot);
    const targetSlot = Number(move.target_slot);
    if (sourceSlot < 1 || sourceSlot > MACRO_SLOT_COUNT) throw new Error(`잘못된 원본 매크로 슬롯입니다: ${sourceSlot}`);
    if (targetSlot < 1 || targetSlot > MACRO_SLOT_COUNT) throw new Error(`잘못된 대상 매크로 슬롯입니다: ${targetSlot}`);
    outputEntries.set(targetSlot, sourceEntries.get(sourceSlot) || new Uint8Array(1 + MACRO_NAME_SIZE));
  }
  const newData = concatBytes(header, ...Array.from({ length: MACRO_SLOT_COUNT }, (_, i) => outputEntries.get(i + 1)));
  const lengthField = newData.length - 6;
  newData[2] = lengthField & 0xFF;
  newData[3] = (lengthField >> 8) & 0xFF;
  return newData;
}

function extractMacroNames(macros) {
  const seen = new Set();
  const names = [];
  for (const macro of macros) {
    if (macro.name && !seen.has(macro.name)) {
      seen.add(macro.name);
      names.push(macro.name);
    }
  }
  return names;
}

async function parseFileEntry(entry) {
  const file = await entry.handle.getFile();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const decoded = decodeMasked(bytes);
  const records = iterKeyRecords(decoded);
  const macros = parseMacroEntries(decoded);
  return {
    name: entry.name,
    size: file.size,
    mtime: new Date(file.lastModified).toISOString(),
    key_records_count: records.length,
    keymap_length_field: keymapField(decoded),
    macro_data_offset: macroDataOffset(decoded),
    macro_data_length: decoded.length - macroDataOffset(decoded),
    macro_names: extractMacroNames(macros),
    records,
    macros,
    decoded,
    handle: entry.handle,
  };
}

function slotLabel(slot) {
  return `매크로${slot}`;
}

function macroBySlot(summary) {
  return new Map((summary?.macros || []).map((macro) => [macro.slot, macro]));
}

function hotkeyText(record) {
  return record?.hotkey || (record?.key_code === 0 ? "None" : "blank");
}

function isEmptyHotkey(record) {
  return !record || record.key_code === 0 || !record.flags?.[3] || !record.hotkey;
}

function normalizeKeyInput(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.toLowerCase() === "blank" || raw.toLowerCase() === "none") {
    return { code: 0, name: "None" };
  }
  const aliases = new Map([
    ["pageup", "PgUp"], ["pgup", "PgUp"], ["pagedown", "PgDown"], ["pgdown", "PgDown"], ["spacebar", "Space"], ["del", "Delete"],
    ["ins", "Insert"], ["printscreen", "PrintScreen"], ["scrolllock", "ScrollLock"],
    ["context", "ContextMenu"], ["contextmenu", "ContextMenu"], ["backslash", "\\"],
    ["slash", "/"], ["plus", "+"], ["minus", "-"], ["comma", ","], ["period", "."],
  ]);
  const canonical = aliases.get(raw.toLowerCase()) || raw;
  const exact = KEY_OPTIONS.find(([, name]) => name === canonical);
  const code = exact ? exact[0] : KEY_CODE_BY_NAME.get(canonical.toLowerCase());
  if (code === undefined) throw new Error(`지원하지 않는 키 입력입니다: ${raw}`);
  return { code, name: internalKeyName(code) };
}

function editedRecord(actionId, fallback) {
  const edit = state.hotkeyEdits.get(Number(actionId));
  if (!edit) return fallback;
  return {
    ...(fallback || {}),
    action_id: Number(actionId),
    flags: edit.flags,
    key_code: edit.key_code,
    hotkey: hotkeyFromParts(edit.flags, edit.key_code),
  };
}

function targetRecordMap() {
  return recordByAction(state.target);
}

function hotkeyButton(record, actionId, label) {
  const display = hotkeyText(editedRecord(actionId, record));
  const edited = state.hotkeyEdits.has(Number(actionId)) ? " edited" : "";
  return `<button class="secondary tiny key-button${edited}" type="button" data-hotkey-action="${Number(actionId)}" data-hotkey-label="${escapeHtml(label)}">${escapeHtml(display)}</button>`;
}

function macroTargetSlot(sourceSlot) {
  return Number(state.macroTargets.get(Number(sourceSlot)) || sourceSlot);
}

function selectedMacroMoves() {
  return [...state.selectedMacros]
    .sort((a, b) => a - b)
    .map((slot) => ({ source_slot: slot, target_slot: macroTargetSlot(slot) }));
}

function macroDefaultHotkeyEdits(macroMoves) {
  const sourceRecords = recordByAction(state.source);
  const edits = new Map();
  macroMoves.forEach((move) => {
    const sourceSlot = Number(move.source_slot);
    const actionId = 6001 + Number(move.target_slot);
    const rowEdit = state.macroHotkeyEdits.get(sourceSlot);
    if (rowEdit) {
      edits.set(actionId, {
        action_id: actionId,
        flags: [...rowEdit.flags],
        key_code: rowEdit.key_code,
      });
      return;
    }
    const sourceRecord = sourceRecords.get(6001 + sourceSlot);
    if (!sourceRecord) return;
    edits.set(actionId, {
      action_id: actionId,
      flags: [...sourceRecord.flags],
      key_code: sourceRecord.key_code,
    });
  });
  return edits;
}

function macroRowHotkeyRecord(sourceSlot) {
  const targetSlot = macroTargetSlot(sourceSlot);
  const actionId = 6001 + targetSlot;
  const targetRecord = targetRecordMap().get(actionId);
  const rowEdit = state.macroHotkeyEdits.get(Number(sourceSlot));
  if (rowEdit) {
    return {
      ...(targetRecord || {}),
      action_id: actionId,
      flags: [...rowEdit.flags],
      key_code: rowEdit.key_code,
      hotkey: hotkeyFromParts(rowEdit.flags, rowEdit.key_code),
    };
  }
  if (state.selectedMacros.has(Number(sourceSlot))) {
    const sourceRecord = recordByAction(state.source).get(6001 + Number(sourceSlot));
    if (sourceRecord) {
      return {
        ...(targetRecord || {}),
        action_id: actionId,
        flags: [...sourceRecord.flags],
        key_code: sourceRecord.key_code,
        hotkey: hotkeyFromParts(sourceRecord.flags, sourceRecord.key_code),
      };
    }
  }
  return targetRecord;
}

function macroRowHotkeyButton(sourceSlot, label) {
  const targetSlot = macroTargetSlot(sourceSlot);
  const actionId = 6001 + targetSlot;
  const display = hotkeyText(macroRowHotkeyRecord(sourceSlot));
  const edited = state.macroHotkeyEdits.has(Number(sourceSlot)) ? " edited" : "";
  return `<button class="secondary tiny key-button${edited}" type="button" data-hotkey-action="${actionId}" data-macro-source-slot="${Number(sourceSlot)}" data-hotkey-label="${escapeHtml(label)}">${escapeHtml(display)}</button>`;
}

function effectiveHotkeyRecord(actionId, fallback) {
  const manualEdit = state.hotkeyEdits.get(Number(actionId));
  if (manualEdit) return editedRecord(actionId, fallback);
  const macroEdit = macroDefaultHotkeyEdits(selectedMacroMoves()).get(Number(actionId));
  if (!macroEdit) return fallback;
  return {
    ...(fallback || {}),
    action_id: Number(actionId),
    flags: macroEdit.flags,
    key_code: macroEdit.key_code,
    hotkey: hotkeyFromParts(macroEdit.flags, macroEdit.key_code),
  };
}

function effectiveHotkeyButton(record, actionId, label) {
  const display = hotkeyText(effectiveHotkeyRecord(actionId, record));
  const edited = state.hotkeyEdits.has(Number(actionId)) ? " edited" : "";
  return `<button class="secondary tiny key-button${edited}" type="button" data-hotkey-action="${Number(actionId)}" data-hotkey-label="${escapeHtml(label)}">${escapeHtml(display)}</button>`;
}

function hotkeyEditPayload(macroMoves) {
  const edits = macroDefaultHotkeyEdits(macroMoves);
  state.hotkeyEdits.forEach((edit, actionId) => edits.set(actionId, edit));
  return [...edits.values()].sort((a, b) => a.action_id - b.action_id);
}

function fileNameStem(name) {
  return String(name || "keysetting").replace(/\.keysetting$/i, "");
}

function defaultNewOutputName() {
  const target = state.files[Number($("targetSelect").value)]?.name || "target.keysetting";
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `${fileNameStem(target)}_optimized_${stamp}.keysetting`;
}

function syncOutputName() {
  if (state.saveMode === "overwrite") {
    const target = state.files[Number($("targetSelect").value)]?.name || "";
    $("outName").value = target;
    $("outName").disabled = true;
  } else {
    $("outName").disabled = false;
    $("outName").value = defaultNewOutputName();
  }
}

function setSaveMode(mode) {
  state.saveMode = mode;
  document.querySelectorAll("[data-save-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.saveMode === mode);
  });
  $("mergeBtn").textContent = mode === "overwrite" ? "검증 후 적용 대상 파일 덮어쓰기" : "검증 후 내보내기";
  syncOutputName();
  invalidateValidation();
}

async function listFilesFromDirectory(handle) {
  const files = [];
  for await (const [name, child] of handle.entries()) {
    if (child.kind !== "file" || !name.toLowerCase().endsWith(".keysetting")) continue;
    const file = await child.getFile();
    files.push({ name, size: file.size, mtime: file.lastModified, handle: child });
  }
  files.sort((a, b) => b.mtime - a.mtime || a.name.localeCompare(b.name, "ko"));
  return files;
}

function setFileOptions(files) {
  state.files = files;
  const options = files.length
    ? files.map((file, index) => `<option value="${index}">${escapeHtml(file.name)} · ${formatSize(file.size)}</option>`).join("")
    : `<option value="">.keysetting 파일 없음</option>`;
  $("sourceSelect").innerHTML = options;
  $("targetSelect").innerHTML = options;
  if (files.length > 1) $("targetSelect").value = "1";
  syncOutputName();
}

async function loadCurrentDirectory() {
  if (!state.directoryHandle) {
    showFileStatus("먼저 찾아보기로 Config 폴더를 선택하세요.", true);
    return;
  }
  setStatus("파일리스트 읽는 중");
  showFileStatus("선택한 폴더의 .keysetting 파일리스트를 읽는 중입니다.");
  const files = await listFilesFromDirectory(state.directoryHandle);
  setFileOptions(files);
  clearAnalysis();
  showFileStatus(`${files.length}개 .keysetting 파일을 읽었습니다. 하위 폴더는 제외했습니다.`);
  setStatus("파일리스트 준비 완료");
}

async function browseConfigDir() {
  if (!window.showDirectoryPicker) {
    showFileStatus("현재 브라우저가 폴더 선택 기능을 지원하지 않습니다. Edge 또는 Chrome에서 열어주세요.", true);
    return;
  }
  setStatus("폴더 선택 대기 중");
  const handle = await pickDirectoryWithRecentStart();
  state.directoryHandle = handle;
  await saveRecentDirectoryHandle(handle);
  $("configDir").value = handle.name;
  $("configDir").title = "브라우저 보안 정책상 웹페이지는 선택한 폴더의 전체 경로를 제공받을 수 없습니다.";
  await loadCurrentDirectory();
}

function selectedFileEntry(selectId) {
  const index = Number($(selectId).value);
  return state.files[index] || null;
}

function clearAnalysis() {
  state.source = null;
  state.target = null;
  state.selectedIds.clear();
  state.selectedMacros.clear();
  state.macroTargets.clear();
  state.macroHotkeyEdits.clear();
  state.hotkeyEdits.clear();
  state.showChangedOnly = true;
  state.collapsedCategories = new Set(["이모션"]);
  state.expandedLongCategories.clear();
  state.showAllMacros = false;
  $("recordsPanel").innerHTML = `<p class="muted">먼저 원본 파일과 적용 대상 파일을 선택한 뒤 두 파일 분석을 누르세요.</p>`;
  $("categoryBar").innerHTML = "";
  $("sourceSummary").innerHTML = "";
  $("targetSummary").innerHTML = "";
  $("macroRows").innerHTML = "";
  $("macroMorePanel").innerHTML = "";
  updateSelectionInfo();
  updateMacroSelectionInfo();
  invalidateValidation();
}

async function inspectBoth() {
  const sourceEntry = selectedFileEntry("sourceSelect");
  const targetEntry = selectedFileEntry("targetSelect");
  if (!sourceEntry || !targetEntry) throw new Error("원본 파일과 적용 대상 파일을 모두 선택하세요.");
  setStatus("두 파일 분석 중");
  state.source = await parseFileEntry(sourceEntry);
  state.target = await parseFileEntry(targetEntry);
  state.selectedIds.clear();
  state.selectedMacros.clear();
  state.macroTargets.clear();
  state.macroHotkeyEdits.clear();
  state.hotkeyEdits.clear();
  (state.source.macros || []).forEach((macro) => state.macroTargets.set(macro.slot, macro.slot));
  renderSummary("sourceSummary", "원본", state.source);
  renderSummary("targetSummary", "적용 대상", state.target);
  renderRecords();
  renderMacros();
  invalidateValidation();
  showFileStatus("두 파일 분석 완료");
  setStatus("분석 완료");
}

function renderSummary(targetId, title, summary) {
  if (!summary) {
    $(targetId).innerHTML = "";
    return;
  }
  $(targetId).innerHTML = `<div class="summary-grid">
    <div class="metric"><span>${escapeHtml(title)}</span><strong title="${escapeHtml(summary.name)}">${escapeHtml(summary.name)}</strong></div>
    <div class="metric"><span>단축키 레코드</span><strong>${summary.key_records_count}</strong></div>
    <div class="metric"><span>매크로 데이터</span><strong>${formatSize(summary.macro_data_length)}</strong></div>
    <div class="metric"><span>수정 시각</span><strong>${escapeHtml(summary.mtime.replace("T", " ").slice(0, 19))}</strong></div>
  </div>`;
}

function groupedSourceRecords() {
  const groups = new Map();
  (state.source?.records || []).filter((row) => row.group !== 6).forEach((row) => {
    if (!groups.has(row.category)) groups.set(row.category, []);
    groups.get(row.category).push(row);
  });
  return [...groups.entries()];
}

function rowsForCategory(category) {
  return (state.source?.records || []).filter((row) => row.group !== 6 && row.category === category);
}

function rowChanged(row, targetMap = targetRecordMap()) {
  const target = targetMap.get(row.action_id);
  if (!target) return true;
  const edit = state.hotkeyEdits.get(row.action_id);
  if (edit) return `${row.flags.join(",")}|${row.key_code}` !== `${edit.flags.join(",")}|${edit.key_code}`;
  return target.raw_hex !== row.raw_hex;
}

function displayedRowsForCategory(category) {
  const targetMap = targetRecordMap();
  return rowsForCategory(category).filter((row) => !state.showChangedOnly || rowChanged(row, targetMap));
}

function changedCountForRows(rows, targetMap = targetRecordMap()) {
  return rows.filter((row) => rowChanged(row, targetMap)).length;
}

function totalChangedCount() {
  const targetMap = targetRecordMap();
  return (state.source?.records || []).filter((row) => row.group !== 6 && rowChanged(row, targetMap)).length;
}

function visibleSelectableRows() {
  return groupedSourceRecords().flatMap(([category]) => displayedRowsForCategory(category));
}

function toggleCategorySelection(category) {
  const rows = displayedRowsForCategory(category);
  const allSelected = rows.length > 0 && rows.every((row) => state.selectedIds.has(row.action_id));
  rows.forEach((row) => {
    if (allSelected) state.selectedIds.delete(row.action_id);
    else state.selectedIds.add(row.action_id);
  });
  invalidateValidation();
  renderRecords();
}

function renderCategoryBar() {
  $("categoryBar").innerHTML = groupedSourceRecords().map(([category]) => {
    const rows = displayedRowsForCategory(category);
    const selected = rows.filter((row) => state.selectedIds.has(row.action_id)).length;
    return `<button class="category-btn" data-category-select="${escapeHtml(category)}" type="button"><strong>${escapeHtml(category)}</strong><span class="muted">${selected}/${rows.length}</span></button>`;
  }).join("");
  document.querySelectorAll("[data-category-select]").forEach((button) => {
    button.addEventListener("click", () => toggleCategorySelection(button.dataset.categorySelect));
  });
}

function statusBadge(changed, target) {
  if (!target) return "<span class='badge missing-badge'>대상 없음</span>";
  if (changed) return "<span class='badge changed-badge'>변경됨</span>";
  return "<span class='badge same-badge'>동일</span>";
}

function renderRecords() {
  if (!state.source || !state.target) {
    $("recordsPanel").innerHTML = `<p class="muted">먼저 파일을 분석하세요.</p>`;
    renderCategoryBar();
    updateSelectionInfo();
    return;
  }
  const targetMap = targetRecordMap();
  $("recordsPanel").innerHTML = groupedSourceRecords().map(([category, rows]) => {
    const changedCount = changedCountForRows(rows, targetMap);
    const displayedRows = rows.filter((row) => !state.showChangedOnly || rowChanged(row, targetMap));
    const collapsed = state.collapsedCategories.has(category);
    const expandedLong = state.expandedLongCategories.has(category);
    const isEmotion = category === "이모션";
    const visibleRows = isEmotion && !expandedLong ? displayedRows.slice(0, 15) : displayedRows;
    const tableRows = visibleRows.length ? visibleRows.map((row) => {
      const targetOriginal = targetMap.get(row.action_id);
      const target = editedRecord(row.action_id, targetOriginal);
      const changed = rowChanged(row, targetMap);
      const targetHotkey = targetOriginal ? hotkeyButton(targetOriginal, row.action_id, `${row.label || row.action_id} 대상 단축키`) : "<span class='muted'>대상 없음</span>";
      return `<tr class="${!targetOriginal ? "missing" : changed ? "changed" : ""}">
        <td><input type="checkbox" data-action-id="${row.action_id}" ${state.selectedIds.has(row.action_id) ? "checked" : ""}></td>
        <td>${row.action_id}</td>
        <td>${escapeHtml(row.label || `(미확인 ${row.action_id})`)}</td>
        <td>${escapeHtml(row.hotkey || "blank")}</td>
        <td>${targetHotkey}</td>
        <td>${statusBadge(changed, target)}</td>
      </tr>`;
    }).join("") : `<tr><td colspan="6" class="empty-row muted">${state.showChangedOnly ? "변경된 항목이 없습니다." : "표시할 항목이 없습니다."}</td></tr>`;
    const moreButton = !collapsed && isEmotion && displayedRows.length > 15
      ? `<div class="more-row"><button class="secondary tiny" data-long-category-toggle="${escapeHtml(category)}" type="button">${expandedLong ? "15개만 보기" : `더보기 (${displayedRows.length}개 전체)`}</button></div>`
      : "";
    const tableHtml = collapsed ? "" : `<div class="table-wrap"><table class="shortcut-table">
      <colgroup><col class="select-col"><col class="id-col"><col class="label-col"><col class="key-col"><col class="key-col"><col class="status-col"></colgroup>
      <thead><tr><th>선택</th><th>ID</th><th>항목명</th><th>원본 단축키</th><th>대상 단축키</th><th>상태 <span class="muted">변경 ${changedCount}</span></th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table></div>${moreButton}`;
    return `<div class="category-section">
      <div class="category-title">
        <div class="category-title-main">
          <label class="category-check-label"><input type="checkbox" data-category-checkbox="${escapeHtml(category)}"><span>${escapeHtml(category)}</span></label>
          <span class="muted">변경 ${changedCount}개 / 표시 ${displayedRows.length}개</span>
        </div>
        <button class="secondary tiny" data-category-toggle="${escapeHtml(category)}" type="button">${collapsed ? "펼치기" : "접기"}</button>
      </div>
      ${tableHtml}
    </div>`;
  }).join("");
  document.querySelectorAll("[data-action-id]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = Number(input.dataset.actionId);
      if (input.checked) state.selectedIds.add(id);
      else state.selectedIds.delete(id);
      invalidateValidation();
      updateSelectionInfo();
    });
  });
  document.querySelectorAll("[data-category-checkbox]").forEach((input) => {
    input.addEventListener("change", () => toggleCategorySelection(input.dataset.categoryCheckbox));
  });
  document.querySelectorAll("[data-category-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.categoryToggle;
      if (state.collapsedCategories.has(category)) state.collapsedCategories.delete(category);
      else state.collapsedCategories.add(category);
      renderRecords();
    });
  });
  document.querySelectorAll("[data-long-category-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.longCategoryToggle;
      if (state.expandedLongCategories.has(category)) state.expandedLongCategories.delete(category);
      else state.expandedLongCategories.add(category);
      renderRecords();
    });
  });
  bindHotkeyButtons();
  renderCategoryBar();
  updateSelectionInfo();
}

function updateSelectionInfo() {
  $("selectionInfo").textContent = `선택된 단축키 ${state.selectedIds.size}개`;
  $("changedCountInfo").textContent = `총 변경됨 ${totalChangedCount()}개`;
  $("changedOnlyBtn").classList.toggle("active", state.showChangedOnly);
  $("showAllRecordsBtn").classList.toggle("active", !state.showChangedOnly);
  document.querySelectorAll("[data-category-checkbox]").forEach((input) => {
    const rows = displayedRowsForCategory(input.dataset.categoryCheckbox);
    const selected = rows.filter((row) => state.selectedIds.has(row.action_id)).length;
    input.checked = rows.length > 0 && selected === rows.length;
    input.indeterminate = selected > 0 && selected < rows.length;
  });
}

function renderMacros() {
  const sourceMacros = state.source?.macros || [];
  const targetMacros = macroBySlot(state.target);
  const sourceRecords = recordByAction(state.source);
  const targetRecords = recordByAction(state.target);
  const visibleMacros = state.showAllMacros ? sourceMacros : sourceMacros.slice(0, 15);
  $("macroRows").innerHTML = visibleMacros.map((macro) => {
    const targetSlot = macroTargetSlot(macro.slot);
    const targetMacro = targetMacros.get(targetSlot);
    const sourceRecord = sourceRecords.get(macro.action_id);
    const targetRecord = targetRecords.get(6001 + targetSlot);
    const targetOptions = Array.from({ length: MACRO_SLOT_COUNT }, (_, i) => i + 1)
      .map((slot) => `<option value="${slot}" ${slot === targetSlot ? "selected" : ""}>${slotLabel(slot)}</option>`)
      .join("");
    return `<tr class="${macro.empty ? "" : "changed"}">
      <td><input type="checkbox" data-macro-slot="${macro.slot}" ${state.selectedMacros.has(macro.slot) ? "checked" : ""}></td>
      <td>${slotLabel(macro.slot)}</td>
      <td>${escapeHtml(macro.name || "(비어있음)")}</td>
      <td>${escapeHtml(hotkeyText(sourceRecord))}</td>
      <td><select data-macro-target="${macro.slot}">${targetOptions}</select></td>
      <td data-macro-target-name="${macro.slot}">${escapeHtml(targetMacro?.name || "(비어있음)")}</td>
      <td data-macro-target-hotkey="${macro.slot}">${macroRowHotkeyButton(macro.slot, `${slotLabel(macro.slot)} 복사 실행키`)}</td>
      <td class="sequence" title="${escapeHtml(macro.sequence)}">${escapeHtml(macro.sequence || "")}</td>
    </tr>`;
  }).join("");
  $("macroMorePanel").innerHTML = sourceMacros.length > 15
    ? `<div class="more-row"><button class="secondary tiny" id="macroMoreBtn" type="button">${state.showAllMacros ? "15개만 보기" : `더보기 (${sourceMacros.length}개 전체)`}</button></div>`
    : "";
  document.querySelectorAll("[data-macro-slot]").forEach((input) => {
    input.addEventListener("change", () => {
      const slot = Number(input.dataset.macroSlot);
      if (input.checked) state.selectedMacros.add(slot);
      else state.selectedMacros.delete(slot);
      invalidateValidation();
      renderMacros();
    });
  });
  document.querySelectorAll("[data-macro-target]").forEach((select) => {
    select.addEventListener("change", () => {
      state.macroTargets.set(Number(select.dataset.macroTarget), Number(select.value));
      updateMacroTargetCells(select);
      invalidateValidation();
    });
  });
  $("macroMoreBtn")?.addEventListener("click", () => {
    state.showAllMacros = !state.showAllMacros;
    renderMacros();
  });
  bindHotkeyButtons();
  updateMacroSelectionInfo();
}

function updateMacroTargetCells(select) {
  const sourceSlot = Number(select.dataset.macroTarget);
  const targetSlot = Number(select.value);
  const targetMacro = macroBySlot(state.target).get(targetSlot);
  const nameCell = document.querySelector(`[data-macro-target-name="${sourceSlot}"]`);
  const hotkeyCell = document.querySelector(`[data-macro-target-hotkey="${sourceSlot}"]`);
  if (nameCell) nameCell.textContent = targetMacro?.name || "(비어있음)";
  if (hotkeyCell) hotkeyCell.innerHTML = macroRowHotkeyButton(sourceSlot, `${slotLabel(sourceSlot)} 복사 실행키`);
  bindHotkeyButtons();
}

function updateMacroSelectionInfo() {
  $("macroSelectionInfo").textContent = `선택된 매크로 ${state.selectedMacros.size}개`;
}

function bindHotkeyButtons() {
  document.querySelectorAll("[data-hotkey-action]").forEach((button) => {
    if (button.dataset.boundHotkey) return;
    button.dataset.boundHotkey = "1";
    button.addEventListener("click", () => openHotkeyEditor(
      Number(button.dataset.hotkeyAction),
      button.dataset.hotkeyLabel || "단축키",
      button.dataset.macroSourceSlot ? Number(button.dataset.macroSourceSlot) : null,
    ));
  });
}

function fillHotkeyOptions() {
  $("hotkeyOptions").innerHTML = KEY_OPTIONS.map(([, name]) => `<option value="${escapeHtml(name)}"></option>`).join("");
}

function fillSpecialKeyButtons() {
  $("specialKeyPanel").innerHTML = SPECIAL_KEY_BUTTONS
    .map((name) => `<button class="secondary" type="button" data-special-key="${escapeHtml(name)}">${escapeHtml(name)}</button>`)
    .join("");
  document.querySelectorAll("[data-special-key]").forEach((button) => {
    button.addEventListener("click", () => {
      $("hotkeyKeyInput").value = button.dataset.specialKey;
      updateHotkeyPreview();
      $("hotkeyKeyInput").focus();
    });
  });
}

function openHotkeyEditor(actionId, label, macroSourceSlot = null) {
  const targetRecord = targetRecordMap().get(actionId);
  const current = macroSourceSlot ? macroRowHotkeyRecord(macroSourceSlot) : effectiveHotkeyRecord(actionId, targetRecord);
  const empty = isEmptyHotkey(current);
  const flags = empty ? [0, 0, 0, 1] : (current?.flags || [0, 0, 0, 1]);
  $("hotkeyModalTitle").textContent = `${label} 수정`;
  $("hotkeyShift").checked = !!flags[1];
  $("hotkeyCtrl").checked = !!flags[2];
  $("hotkeyAlt").checked = !!flags[0];
  $("hotkeyKeyInput").value = empty ? "" : internalKeyName(Number(current?.key_code || 0));
  state.activeHotkeyEdit = { actionId, label, macroSourceSlot };
  updateHotkeyPreview();
  $("hotkeyModal").classList.add("open");
  $("hotkeyModal").setAttribute("aria-hidden", "false");
  $("hotkeyKeyInput").focus();
  $("hotkeyKeyInput").select();
}

function closeHotkeyEditor() {
  $("hotkeyModal").classList.remove("open");
  $("hotkeyModal").setAttribute("aria-hidden", "true");
  state.activeHotkeyEdit = null;
}

function hotkeyEditorParts() {
  const key = normalizeKeyInput($("hotkeyKeyInput").value);
  const flags = key.code === 0
    ? [0, 0, 0, 1]
    : [Number($("hotkeyAlt").checked), Number($("hotkeyShift").checked), Number($("hotkeyCtrl").checked), 1];
  return { action_id: state.activeHotkeyEdit?.actionId, flags, key_code: key.code };
}

function updateHotkeyPreview() {
  try {
    const parts = hotkeyEditorParts();
    $("hotkeyPreview").textContent = `미리보기: ${hotkeyFromParts(parts.flags, parts.key_code)}`;
  } catch (error) {
    $("hotkeyPreview").textContent = error.message;
  }
}

function saveHotkeyEdit() {
  if (!state.activeHotkeyEdit) return;
  const edit = hotkeyEditorParts();
  if (!edit.action_id) throw new Error("수정할 단축키를 찾지 못했습니다.");
  if (state.activeHotkeyEdit.macroSourceSlot) {
    state.macroHotkeyEdits.set(state.activeHotkeyEdit.macroSourceSlot, {
      source_slot: state.activeHotkeyEdit.macroSourceSlot,
      flags: [...edit.flags],
      key_code: edit.key_code,
    });
  } else {
    state.hotkeyEdits.set(edit.action_id, edit);
  }
  closeHotkeyEditor();
  invalidateValidation();
  renderRecords();
  renderMacros();
}

function deleteHotkeyEdit() {
  if (!state.activeHotkeyEdit) return;
  if (state.activeHotkeyEdit.macroSourceSlot) {
    state.macroHotkeyEdits.set(state.activeHotkeyEdit.macroSourceSlot, {
      source_slot: state.activeHotkeyEdit.macroSourceSlot,
      flags: [0, 0, 0, 1],
      key_code: 0,
    });
  } else {
    state.hotkeyEdits.set(state.activeHotkeyEdit.actionId, {
      action_id: state.activeHotkeyEdit.actionId,
      flags: [0, 0, 0, 1],
      key_code: 0,
    });
  }
  closeHotkeyEditor();
  invalidateValidation();
  renderRecords();
  renderMacros();
}

function applyHotkeyEdits(decoded, edits) {
  const rows = iterKeyRecords(decoded);
  const map = new Map(rows.map((row) => [row.action_id, row]));
  const missing = [];
  for (const edit of edits) {
    const row = map.get(Number(edit.action_id));
    if (!row) {
      missing.push(Number(edit.action_id));
      continue;
    }
    decoded.set(edit.flags, row.offset + 4);
    decoded[row.offset + 8] = Number(edit.key_code);
  }
  return missing;
}

function buildMergedDecoded(payload) {
  if (!state.source || !state.target) throw new Error("먼저 두 파일을 분석하세요.");
  let base = cloneBytes(state.target.decoded);
  const source = state.source.decoded;
  const sourceRecords = recordByAction(state.source);
  const baseRecords = recordByAction(state.target);
  const copied = [];
  const missing = [];
  for (const actionId of payload.ids) {
    const sourceRow = sourceRecords.get(Number(actionId));
    const baseRow = baseRecords.get(Number(actionId));
    if (!sourceRow || !baseRow) {
      missing.push(Number(actionId));
      continue;
    }
    base.set(source.slice(sourceRow.offset, sourceRow.offset + KEY_RECORD_SIZE), baseRow.offset);
    copied.push(Number(actionId));
  }
  if (payload.macro_moves.length) {
    base = concatBytes(base.slice(0, macroDataOffset(base)), rebuildMacroData(base, source, payload.macro_moves));
  }
  const hotkeyMissing = applyHotkeyEdits(base, payload.hotkey_edits);
  return {
    decoded: base,
    copied_ids: copied,
    missing_ids: missing,
    macro_moves: payload.macro_moves,
    hotkey_edits: payload.hotkey_edits,
    hotkey_missing_ids: hotkeyMissing,
  };
}

function activeHotkeySignature(row) {
  const [alt, shift, ctrl, stateValue] = row.flags;
  if (!stateValue || row.key_code === 0) return null;
  return `${alt}|${shift}|${ctrl}|${row.key_code}`;
}

function buildPayload() {
  const ids = [...state.selectedIds].sort((a, b) => a - b);
  const macroMoves = selectedMacroMoves();
  const hotkeyEdits = hotkeyEditPayload(macroMoves);
  if (!ids.length && !macroMoves.length && !hotkeyEdits.length) {
    throw new Error("내보낼 단축키 항목이나 매크로 또는 수정할 실행키를 하나 이상 선택하세요.");
  }
  return { ids, macro_moves: macroMoves, hotkey_edits: hotkeyEdits };
}

function validationKey(payload) {
  return JSON.stringify(payload);
}

function validatePayload(payload) {
  const merged = buildMergedDecoded(payload);
  const touched = new Set(merged.copied_ids);
  merged.macro_moves.forEach((move) => touched.add(6001 + Number(move.target_slot)));
  merged.hotkey_edits.forEach((edit) => touched.add(Number(edit.action_id)));
  const rows = iterKeyRecords(merged.decoded);
  const rowsById = new Map(rows.map((row) => [row.action_id, row]));
  const byHotkey = new Map();
  rows.forEach((row) => {
    const signature = activeHotkeySignature(row);
    if (!signature) return;
    if (!byHotkey.has(signature)) byHotkey.set(signature, []);
    byHotkey.get(signature).push(row);
  });
  const conflicts = [];
  [...touched].sort((a, b) => a - b).forEach((actionId) => {
    const row = rowsById.get(actionId);
    if (!row) return;
    const signature = activeHotkeySignature(row);
    if (!signature) return;
    const duplicates = (byHotkey.get(signature) || []).filter((other) => other.action_id !== actionId);
    if (!duplicates.length) return;
    conflicts.push({
      action_id: actionId,
      label: row.label || `ID ${actionId}`,
      hotkey: row.hotkey,
      duplicates: duplicates.map((other) => ({
        action_id: other.action_id,
        label: other.label || `ID ${other.action_id}`,
        category: other.category,
        hotkey: other.hotkey,
      })),
    });
  });
  return {
    ok: conflicts.length === 0,
    conflicts,
    checked_action_ids: [...touched].sort((a, b) => a - b),
    copied_ids: merged.copied_ids,
    missing_ids: merged.missing_ids,
    macro_moves: merged.macro_moves,
    hotkey_edits: merged.hotkey_edits,
    hotkey_missing_ids: merged.hotkey_missing_ids,
  };
}

function renderValidation(data) {
  if (data.ok) {
    $("validationPanel").innerHTML = `<div class="result">충돌 없음 · 검증한 적용 단축키 ${data.checked_action_ids.length}개</div>`;
    $("mergeBtn").disabled = false;
    return;
  }
  const rows = data.conflicts.map((item) => `<li><strong>${escapeHtml(item.label)}</strong> ${escapeHtml(item.hotkey)} 중복: ${item.duplicates.map((dup) => `${escapeHtml(dup.category)} / ${escapeHtml(dup.label)}`).join(", ")}</li>`).join("");
  $("validationPanel").innerHTML = `<div class="error"><strong>실행키 충돌 ${data.conflicts.length}개</strong><ul>${rows}</ul></div>`;
  $("mergeBtn").disabled = true;
}

function invalidateValidation() {
  state.validationOk = false;
  state.validationKey = "";
  $("mergeBtn").disabled = true;
  $("validationPanel").innerHTML = `<div class="muted">내보내기 전 충돌 검증이 필요합니다.</div>`;
}

function validateSelected() {
  const payload = buildPayload();
  const data = validatePayload(payload);
  state.validationOk = data.ok;
  state.validationKey = data.ok ? validationKey(payload) : "";
  renderValidation(data);
  setStatus(data.ok ? "검증 완료" : "충돌 발견");
}

function sanitizeOutputName(value) {
  const name = String(value || defaultNewOutputName()).replace(/[\\/:*?"<>|]/g, "_").trim();
  return name.toLowerCase().endsWith(".keysetting") ? name : `${name}.keysetting`;
}

function downloadBytes(bytes, name) {
  const blob = new Blob([bytes], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

async function ensureWritePermission(handle) {
  if (!handle?.queryPermission || !handle?.requestPermission) return true;
  const options = { mode: "readwrite" };
  if (await handle.queryPermission(options) === "granted") return true;
  return await handle.requestPermission(options) === "granted";
}

async function overwriteTarget(bytes) {
  const targetEntry = selectedFileEntry("targetSelect");
  if (!targetEntry?.handle?.createWritable) {
    throw new Error("이 브라우저에서는 적용 대상 파일 덮어쓰기를 지원하지 않습니다. 새 키셋팅 생성으로 저장하세요.");
  }
  const allowed = await ensureWritePermission(targetEntry.handle);
  if (!allowed) throw new Error("파일 덮어쓰기 권한이 허용되지 않았습니다.");
  const writable = await targetEntry.handle.createWritable();
  await writable.write(bytes);
  await writable.close();
}

async function mergeSelected() {
  const payload = buildPayload();
  if (!state.validationOk || state.validationKey !== validationKey(payload)) {
    throw new Error("현재 선택 상태로 먼저 충돌 검증을 완료하세요.");
  }
  const merged = buildMergedDecoded(payload);
  const encoded = encodeMasked(merged.decoded);
  const outName = state.saveMode === "overwrite"
    ? (selectedFileEntry("targetSelect")?.name || sanitizeOutputName($("outName").value))
    : sanitizeOutputName($("outName").value);
  if (state.saveMode === "overwrite") {
    await overwriteTarget(encoded);
  } else {
    downloadBytes(encoded, outName);
  }
  $("mergePanel").innerHTML = `<div class="result"><strong>${escapeHtml(outName)}</strong> ${state.saveMode === "overwrite" ? "덮어쓰기" : "생성"} 완료 · ${formatSize(encoded.length)}<br>복사된 단축키 ${merged.copied_ids.length}개 · 매크로 복사 ${merged.macro_moves.length}개 · 실행키 수정 ${(merged.hotkey_edits || []).length}개${merged.missing_ids.length ? `<br>대상에 없는 ID: ${merged.missing_ids.join(", ")}` : ""}</div>`;
  setStatus("저장 완료");
}

function bind(id, eventName, handler) {
  const element = $(id);
  if (!element) throw new Error(`${id} 요소를 찾지 못했습니다.`);
  element.addEventListener(eventName, handler);
}

function initializeApp() {
  fillHotkeyOptions();
  fillSpecialKeyButtons();
  setFileOptions([]);
  bind("browseDirBtn", "click", () => browseConfigDir().catch((error) => {
    if (error?.name === "AbortError") {
      showFileStatus("폴더 선택을 취소했습니다.");
      setStatus("폴더 선택 취소");
      return;
    }
    showFileStatus(error.message || String(error), true);
    setStatus("폴더 선택 실패");
  }));
  bind("applyDirBtn", "click", () => loadCurrentDirectory().catch((error) => {
    showFileStatus(error.message || String(error), true);
    setStatus("파일리스트 실패");
  }));
  bind("refreshBtn", "click", () => loadCurrentDirectory().catch((error) => {
    showFileStatus(error.message || String(error), true);
    setStatus("목록 새로고침 실패");
  }));
  bind("openBtn", "click", () => inspectBoth().catch((error) => {
    showPanelError("sourceSummary", error);
    showFileStatus(error.message || String(error), true);
    setStatus("분석 실패");
  }));
  bind("sourceSelect", "change", () => clearAnalysis());
  bind("targetSelect", "change", () => {
    clearAnalysis();
    syncOutputName();
  });
  document.querySelectorAll("[data-save-mode]").forEach((button) => {
    button.addEventListener("click", () => setSaveMode(button.dataset.saveMode));
  });
  bind("changedOnlyBtn", "click", () => {
    state.showChangedOnly = true;
    invalidateValidation();
    renderRecords();
  });
  bind("showAllRecordsBtn", "click", () => {
    state.showChangedOnly = false;
    invalidateValidation();
    renderRecords();
  });
  bind("expandAllBtn", "click", () => {
    state.collapsedCategories.clear();
    renderRecords();
  });
  bind("collapseAllBtn", "click", () => {
    groupedSourceRecords().forEach(([category]) => state.collapsedCategories.add(category));
    renderRecords();
  });
  bind("selectAllBtn", "click", () => {
    visibleSelectableRows().forEach((row) => state.selectedIds.add(row.action_id));
    invalidateValidation();
    renderRecords();
  });
  bind("clearAllBtn", "click", () => {
    state.selectedIds.clear();
    invalidateValidation();
    renderRecords();
  });
  bind("selectNamedMacrosBtn", "click", () => {
    (state.source?.macros || []).forEach((macro) => state.selectedMacros.add(macro.slot));
    invalidateValidation();
    renderMacros();
  });
  bind("clearMacrosBtn", "click", () => {
    state.selectedMacros.clear();
    invalidateValidation();
    renderMacros();
  });
  bind("validateBtn", "click", () => {
    try { validateSelected(); }
    catch (error) { showPanelError("validationPanel", error); setStatus("검증 실패"); }
  });
  bind("mergeBtn", "click", () => mergeSelected().catch((error) => {
    showPanelError("mergePanel", error);
    setStatus("저장 실패");
  }));
  ["hotkeyShift", "hotkeyCtrl", "hotkeyAlt", "hotkeyKeyInput"].forEach((id) => bind(id, "input", updateHotkeyPreview));
  bind("hotkeyCancelBtn", "click", closeHotkeyEditor);
  bind("hotkeyCancelX", "click", closeHotkeyEditor);
  bind("hotkeySaveBtn", "click", () => {
    try { saveHotkeyEdit(); }
    catch (error) { $("hotkeyPreview").textContent = error.message || String(error); }
  });
  bind("hotkeyDeleteBtn", "click", deleteHotkeyEdit);
  bind("hotkeyModal", "click", (event) => {
    if (event.target.id === "hotkeyModal") closeHotkeyEditor();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("hotkeyModal").classList.contains("open")) closeHotkeyEditor();
  });
  setSaveMode("new");
  showFileStatus("찾아보기 후 폴더를 선택하면 .keysetting 파일리스트를 읽어옵니다. 전체 경로는 브라우저 보안 정책상 표시할 수 없습니다.");
  setStatus("준비 완료");
}

window.addEventListener("error", (event) => {
  showFileStatus(`화면 스크립트 오류: ${event.message}`, true);
});
window.addEventListener("unhandledrejection", (event) => {
  showFileStatus(`요청 처리 오류: ${event.reason?.message || event.reason}`, true);
});

initializeApp();
