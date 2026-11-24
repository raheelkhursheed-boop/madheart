var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now2 = Date.now();
  const seconds = Math.trunc(now2 / 1e3);
  const nanos = now2 % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// _lib/photos.js
var PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
var MAX_PHOTO_BYTES = 12 * 1024 * 1024;
var MAX_PHOTOS_PER_WORK = 6;
async function putPhoto(env2, id, file) {
  const body = await file.arrayBuffer();
  if (env2.PHOTOS_R2) {
    await env2.PHOTOS_R2.put(id, body, { httpMetadata: { contentType: file.type } });
  } else if (env2.PHOTOS) {
    await env2.PHOTOS.put(id, body, { metadata: { type: file.type } });
  } else {
    throw new Error("Photo storage is not configured");
  }
  return body.byteLength;
}
__name(putPhoto, "putPhoto");
async function photoResponse(env2, id, contentType, cacheControl) {
  let body = null;
  if (env2.PHOTOS_R2) {
    const obj = await env2.PHOTOS_R2.get(id);
    body = obj ? obj.body : null;
  } else if (env2.PHOTOS) {
    body = await env2.PHOTOS.get(id, { type: "stream" });
  }
  if (!body) return null;
  return new Response(body, {
    headers: {
      "content-type": contentType || "image/jpeg",
      "cache-control": cacheControl,
      "x-content-type-options": "nosniff"
    }
  });
}
__name(photoResponse, "photoResponse");

// admin/api/photos/[id].js
async function onRequestGet({ params, env: env2 }) {
  const id = String(params.id || "");
  const row = env2.DB && await env2.DB.prepare("SELECT content_type FROM photos WHERE id = ?").bind(id).first();
  if (!row) return new Response("Not found", { status: 404 });
  return await photoResponse(env2, id, row.content_type, "private, max-age=3600") || new Response("Not found", { status: 404 });
}
__name(onRequestGet, "onRequestGet");

// _lib/util.js
var now = /* @__PURE__ */ __name(() => (/* @__PURE__ */ new Date()).toISOString(), "now");
var newId = /* @__PURE__ */ __name((prefix) => `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`, "newId");
var newToken = /* @__PURE__ */ __name(() => [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, "0")).join(""), "newToken");
var json = /* @__PURE__ */ __name((data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }
}), "json");
var fail = /* @__PURE__ */ __name((message, status = 400) => json({ error: message }, status), "fail");
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var text = /* @__PURE__ */ __name((v, max = 300) => {
  const s = (v ?? "").toString().trim();
  return s ? s.slice(0, max) : null;
}, "text");
var int = /* @__PURE__ */ __name((v, min = 0, max = 1e7) => {
  const s = (v ?? "").toString().replace(/[,\s$]/g, "");
  if (s === "") return null;
  const n = Math.round(Number(s));
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}, "int");
var num = /* @__PURE__ */ __name((v, min = 0, max = 1e4) => {
  const s = (v ?? "").toString().trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= min && n <= max ? Math.round(n * 10) / 10 : null;
}, "num");
var STATUSES = [
  "submitted",
  "changes_requested",
  "approved",
  "published",
  "declined",
  "held",
  "sold",
  "shipped",
  "delivered"
];
var STATUS_FOR_ARTIST = {
  submitted: "With the curator",
  changes_requested: "Changes requested",
  approved: "Accepted",
  published: "On the gallery",
  declined: "Not selected this time",
  held: "On the gallery",
  sold: "Sold",
  shipped: "Sold \xB7 shipped",
  delivered: "Sold \xB7 delivered"
};
async function logEvent(db, workId, action, detail, actor) {
  await db.prepare("INSERT INTO events (work_id, action, detail, actor, at) VALUES (?, ?, ?, ?, ?)").bind(workId, action, detail ? JSON.stringify(detail) : null, actor || null, now()).run();
}
__name(logEvent, "logEvent");

// admin/api/works/[id].js
var MOVES = {
  approve: { from: ["submitted", "changes_requested"], to: "approved" },
  request_changes: { from: ["submitted", "approved"], to: "changes_requested" },
  decline: { from: ["submitted", "changes_requested", "approved"], to: "declined" },
  publish: { from: ["approved"], to: "published" },
  unpublish: { from: ["published"], to: "approved" },
  reopen: { from: ["declined"], to: "submitted" }
};
async function load(db, id) {
  const work = await db.prepare("SELECT * FROM works WHERE id = ?").bind(id).first();
  if (!work) return null;
  const artist = await db.prepare(
    "SELECT id, name, email, city, country, website, instagram, bio, created_at FROM artists WHERE id = ?"
  ).bind(work.artist_id).first();
  const photos = (await db.prepare("SELECT id, content_type, bytes, position FROM photos WHERE work_id = ? ORDER BY position").bind(id).all()).results;
  const events = (await db.prepare("SELECT action, detail, actor, at FROM events WHERE work_id = ? ORDER BY id DESC LIMIT 50").bind(id).all()).results;
  const others = (await db.prepare("SELECT id, title, status FROM works WHERE artist_id = ? AND id != ? ORDER BY created_at DESC").bind(work.artist_id, id).all()).results;
  return { work, artist, photos, events, others };
}
__name(load, "load");
async function onRequestGet2({ params, env: env2 }) {
  const data = await load(env2.DB, String(params.id));
  return data ? json(data) : fail("Not found", 404);
}
__name(onRequestGet2, "onRequestGet");
async function onRequestPost({ params, request, env: env2, data: ctx }) {
  const id = String(params.id);
  const db = env2.DB;
  const work = await db.prepare("SELECT * FROM works WHERE id = ?").bind(id).first();
  if (!work) return fail("Not found", 404);
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Bad request");
  }
  const action = String(body.action || "save");
  const at = now();
  const has = /* @__PURE__ */ __name((k) => Object.prototype.hasOwnProperty.call(body, k), "has");
  const f = {
    title: has("title") ? text(body.title, 160) || work.title : work.title,
    year: has("year") ? int(body.year, 1900, 2100) : work.year,
    medium: has("medium") ? text(body.medium, 160) : work.medium,
    height_cm: has("height_cm") ? num(body.height_cm, 0, 2e3) : work.height_cm,
    width_cm: has("width_cm") ? num(body.width_cm, 0, 2e3) : work.width_cm,
    depth_cm: has("depth_cm") ? num(body.depth_cm, 0, 2e3) : work.depth_cm,
    framed: has("framed") ? body.framed ? 1 : 0 : work.framed,
    description: has("description") ? text(body.description, 3e3) : work.description,
    price_usd: has("price_usd") ? int(body.price_usd, 1, 1e7) : work.price_usd,
    ship_india_usd: has("ship_india_usd") ? int(body.ship_india_usd, 0, 1e5) : work.ship_india_usd,
    ship_intl_usd: has("ship_intl_usd") ? int(body.ship_intl_usd, 0, 1e5) : work.ship_intl_usd,
    note_to_artist: has("note_to_artist") ? text(body.note_to_artist, 2e3) : work.note_to_artist,
    admin_note: has("admin_note") ? text(body.admin_note, 3e3) : work.admin_note,
    sort: has("sort") ? int(body.sort, -1e5, 1e5) ?? 0 : work.sort
  };
  let status = work.status;
  if (action !== "save") {
    const move = MOVES[action];
    if (!move) return fail("Unknown action");
    if (!move.from.includes(work.status)) return fail(`Can't ${action.replace("_", " ")} a work that is ${work.status.replace("_", " ")}.`, 409);
    if (action === "approve" || action === "publish") {
      if (!f.price_usd) return fail("Set the gallery price first.");
      if (f.ship_india_usd == null || f.ship_intl_usd == null) return fail("Set both shipping prices first (0 is fine).");
    }
    if (action === "request_changes" && !f.note_to_artist) return fail("Write a note to the artist saying what to change.");
    status = move.to;
  }
  await db.prepare(
    `UPDATE works SET title=?, year=?, medium=?, height_cm=?, width_cm=?, depth_cm=?, framed=?, description=?, price_usd=?,
       ship_india_usd=?, ship_intl_usd=?, note_to_artist=?, admin_note=?, sort=?, status=?, updated_at=?,
       reviewed_at = CASE WHEN ? IN ('approved','changes_requested','declined') THEN ? ELSE reviewed_at END,
       published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, ?) ELSE published_at END
     WHERE id=?`
  ).bind(
    f.title,
    f.year,
    f.medium,
    f.height_cm,
    f.width_cm,
    f.depth_cm,
    f.framed,
    f.description,
    f.price_usd,
    f.ship_india_usd,
    f.ship_intl_usd,
    f.note_to_artist,
    f.admin_note,
    f.sort,
    status,
    at,
    status,
    at,
    status,
    at,
    id
  ).run();
  await logEvent(db, id, action, action === "save" ? null : { from: work.status, to: status }, ctx.user?.email);
  return json(await load(db, id));
}
__name(onRequestPost, "onRequestPost");

// admin/api/works.js
async function onRequestGet3({ request, env: env2 }) {
  const status = new URL(request.url).searchParams.get("status");
  const where = STATUSES.includes(status) ? "WHERE w.status = ?" : "";
  const stmt = env2.DB.prepare(
    `SELECT w.id, w.title, w.year, w.medium, w.status, w.asking_price_usd, w.price_usd, w.created_at, w.updated_at,
            a.name AS artist_name, a.city AS artist_city, a.country AS artist_country,
            (SELECT p.id FROM photos p WHERE p.work_id = w.id ORDER BY p.position LIMIT 1) AS cover_id,
            (SELECT COUNT(*) FROM photos p WHERE p.work_id = w.id) AS photo_count
     FROM works w JOIN artists a ON a.id = w.artist_id ${where}
     ORDER BY w.updated_at DESC LIMIT 500`
  );
  const works = (await (where ? stmt.bind(status) : stmt).all()).results;
  const counts = Object.fromEntries(
    (await env2.DB.prepare("SELECT status, COUNT(*) AS n FROM works GROUP BY status").all()).results.map((r) => [r.status, r.n])
  );
  return json({ works, counts });
}
__name(onRequestGet3, "onRequestGet");

// api/signup.js
var FORMS = {
  artists: ["name", "email", "city", "portfolio", "practice", "consent"],
  collectors: ["email", "country", "interest", "consent"]
};
async function onRequestPost2({ request, env: env2 }) {
  const back = /* @__PURE__ */ __name((path) => Response.redirect(new URL(path, request.url).toString(), 303), "back");
  let data;
  try {
    data = await request.formData();
  } catch {
    return back("/");
  }
  if ((data.get("company-website") || "").toString().trim()) return back("/thanks.html");
  const form = (data.get("form-name") || "").toString();
  const fields = FORMS[form];
  const email = (data.get("email") || "").toString().trim().slice(0, 254);
  if (!fields || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return back("/#" + (form === "artists" ? "artists" : "collectors"));
  const entry = { form, submitted_at: (/* @__PURE__ */ new Date()).toISOString() };
  for (const f of fields) entry[f] = (data.get(f) || "").toString().slice(0, f === "practice" ? 1500 : 300);
  entry.email = email;
  if (!env2.SIGNUPS) return new Response("Sign-ups are temporarily unavailable. Please try again shortly.", { status: 503 });
  const key = `${form}:${entry.submitted_at}:${crypto.randomUUID().slice(0, 8)}`;
  await env2.SIGNUPS.put(key, JSON.stringify(entry));
  return back(form === "artists" ? "/thanks.html?for=artists" : "/thanks.html");
}
__name(onRequestPost2, "onRequestPost");
function onRequest() {
  return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
}
__name(onRequest, "onRequest");

// api/submission.js
async function onRequestGet4({ request, env: env2 }) {
  if (!env2.DB) return fail("Temporarily unavailable.", 503);
  const token = text(new URL(request.url).searchParams.get("t"), 64);
  if (!token) return fail("Missing link.", 400);
  const artist = await env2.DB.prepare(
    "SELECT id, name, city, country, website, instagram, bio, created_at FROM artists WHERE token = ?"
  ).bind(token).first();
  if (!artist) return fail("That link is not valid.", 404);
  const works = (await env2.DB.prepare(
    `SELECT id, title, year, medium, height_cm, width_cm, depth_cm, framed, description, asking_price_usd, price_usd,
            status, note_to_artist, created_at, updated_at FROM works WHERE artist_id = ? ORDER BY created_at DESC`
  ).bind(artist.id).all()).results;
  const photos = (await env2.DB.prepare(
    `SELECT p.id, p.work_id FROM photos p JOIN works w ON w.id = p.work_id WHERE w.artist_id = ? ORDER BY p.position`
  ).bind(artist.id).all()).results;
  const { id, ...publicArtist } = artist;
  return json({
    artist: publicArtist,
    works: works.map((w) => ({
      ...w,
      status_label: STATUS_FOR_ARTIST[w.status] || w.status,
      editable: ["submitted", "changes_requested"].includes(w.status),
      // The curator's note is shown only when it asks for something.
      note_to_artist: ["changes_requested", "declined"].includes(w.status) ? w.note_to_artist : null,
      photos: photos.filter((p) => p.work_id === w.id).map((p) => ({ id: p.id, url: `/api/submission-photo?t=${token}&id=${p.id}` }))
    }))
  });
}
__name(onRequestGet4, "onRequestGet");

// api/submission-photo.js
async function onRequestGet5({ request, env: env2 }) {
  const q = new URL(request.url).searchParams;
  const token = text(q.get("t"), 64), id = text(q.get("id"), 64);
  if (!env2.DB || !token || !id) return new Response("Not found", { status: 404 });
  const row = await env2.DB.prepare(
    `SELECT p.content_type FROM photos p JOIN works w ON w.id = p.work_id JOIN artists a ON a.id = w.artist_id
     WHERE p.id = ? AND a.token = ?`
  ).bind(id, token).first();
  if (!row) return new Response("Not found", { status: 404 });
  return await photoResponse(env2, id, row.content_type, "private, max-age=3600") || new Response("Not found", { status: 404 });
}
__name(onRequestGet5, "onRequestGet");

// api/submit.js
var MAX_WORKS = 5;
var EDITABLE = ["submitted", "changes_requested"];
function readWork(data, i) {
  const g = /* @__PURE__ */ __name((f) => data.get(`works[${i}][${f}]`), "g");
  return {
    title: text(g("title"), 160),
    year: int(g("year"), 1900, 2100),
    medium: text(g("medium"), 160),
    height_cm: num(g("height_cm"), 0, 2e3),
    width_cm: num(g("width_cm"), 0, 2e3),
    depth_cm: num(g("depth_cm"), 0, 2e3),
    framed: g("framed") === "yes" ? 1 : 0,
    description: text(g("description"), 3e3),
    asking_price_usd: int(g("price"), 1, 1e7),
    human_made: g("human_made") === "yes" ? 1 : 0,
    files: data.getAll(`works[${i}][photos]`).filter((f) => f && typeof f === "object" && f.size > 0),
    keep: (g("keep_photos") || "").toString().split(",").map((s) => s.trim()).filter(Boolean)
  };
}
__name(readWork, "readWork");
function checkWork(w, n, existingCount = 0) {
  const where = `Work ${n}`;
  if (!w.title) return `${where}: please add a title.`;
  if (!w.asking_price_usd) return `${where}: please add your price in US dollars.`;
  if (!w.human_made) return `${where}: please confirm the work is made by you, without generative AI.`;
  const total = existingCount + w.files.length;
  if (total < 1) return `${where}: please add at least one photo.`;
  if (total > MAX_PHOTOS_PER_WORK) return `${where}: up to ${MAX_PHOTOS_PER_WORK} photos, please.`;
  for (const f of w.files) {
    if (!PHOTO_TYPES.includes(f.type)) return `${where}: photos must be JPEG, PNG or WebP.`;
    if (f.size > MAX_PHOTO_BYTES) return `${where}: each photo must be under 12 MB.`;
  }
  return null;
}
__name(checkWork, "checkWork");
async function storePhotos(env2, workId, files, startAt) {
  const rows = [];
  for (let i = 0; i < files.length; i++) {
    const id = newId("ph");
    const bytes = await putPhoto(env2, id, files[i]);
    rows.push({ id, work_id: workId, content_type: files[i].type, bytes, position: startAt + i });
  }
  return rows;
}
__name(storePhotos, "storePhotos");
var photoInsert = /* @__PURE__ */ __name((db, p, at) => db.prepare("INSERT INTO photos (id, work_id, content_type, bytes, position, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(p.id, p.work_id, p.content_type, p.bytes, p.position, at), "photoInsert");
async function onRequestPost3({ request, env: env2 }) {
  if (!env2.DB || !(env2.PHOTOS || env2.PHOTOS_R2)) return fail("Submissions are temporarily unavailable. Please try again shortly.", 503);
  let data;
  try {
    data = await request.formData();
  } catch {
    return fail("We couldn't read that submission. Please try again.");
  }
  if (text(data.get("company-website"))) return json({ ok: true });
  const db = env2.DB;
  const at = now();
  const token = text(data.get("token"), 64);
  const workId = text(data.get("work_id"), 64);
  let artist = null;
  let merged = false;
  if (token) {
    artist = await db.prepare("SELECT * FROM artists WHERE token = ?").bind(token).first();
    if (!artist) return fail("That private link is not valid. Please use the link from your first submission.", 403);
  }
  const profile3 = {
    name: text(data.get("name"), 120),
    email: (text(data.get("email"), 254) || "").toLowerCase() || null,
    city: text(data.get("city"), 120),
    country: text(data.get("country"), 120),
    website: text(data.get("website"), 300),
    instagram: text(data.get("instagram"), 120),
    bio: text(data.get("bio"), 3e3)
  };
  if (!artist) {
    if (!profile3.name) return fail("Please add your name.");
    if (!profile3.email || !EMAIL.test(profile3.email)) return fail("Please add a valid email address.");
    if (!profile3.bio) return fail("Please tell us a little about your practice.");
    if (data.get("consent") !== "yes") return fail("Please agree to the submission terms.");
  }
  if (workId) {
    if (!artist) return fail("Please use your private link to revise a work.", 403);
    const work = await db.prepare("SELECT * FROM works WHERE id = ? AND artist_id = ?").bind(workId, artist.id).first();
    if (!work) return fail("We couldn't find that work.", 404);
    if (!EDITABLE.includes(work.status)) return fail("This work has already been reviewed and can't be changed here.", 409);
    const w = readWork(data, 0);
    const current = (await db.prepare("SELECT id FROM photos WHERE work_id = ?").bind(workId).all()).results.map((r) => r.id);
    const keep = w.keep.filter((id) => current.includes(id));
    const err = checkWork(w, 1, keep.length);
    if (err) return fail(err);
    const added = await storePhotos(env2, workId, w.files, keep.length);
    const drop = current.filter((id) => !keep.includes(id));
    const stmts2 = [
      db.prepare(`UPDATE works SET title=?, year=?, medium=?, height_cm=?, width_cm=?, depth_cm=?, framed=?, description=?,
                  asking_price_usd=?, human_made=?, status='submitted', updated_at=? WHERE id=?`).bind(
        w.title,
        w.year,
        w.medium,
        w.height_cm,
        w.width_cm,
        w.depth_cm,
        w.framed,
        w.description,
        w.asking_price_usd,
        w.human_made,
        at,
        workId
      ),
      ...keep.map((id, i) => db.prepare("UPDATE photos SET position = ? WHERE id = ?").bind(i, id)),
      ...added.map((p) => photoInsert(db, p, at)),
      ...drop.map((id) => db.prepare("DELETE FROM photos WHERE id = ?").bind(id))
    ];
    await db.batch(stmts2);
    await logEvent(db, workId, "resubmitted", { photos_added: added.length, photos_removed: drop.length }, artist.email);
    return json({ ok: true, revised: true, status_url: `/submission?t=${artist.token}` });
  }
  const count3 = Math.min(int(data.get("work_count"), 1, MAX_WORKS) || 1, MAX_WORKS);
  const works = [];
  for (let i = 0; i < count3; i++) {
    const w = readWork(data, i);
    if (!w.title && !w.files.length && !w.asking_price_usd) continue;
    const err = checkWork(w, i + 1);
    if (err) return fail(err);
    works.push(w);
  }
  if (!works.length) return fail("Please add at least one work.");
  const stmts = [];
  if (!artist) {
    const existing = await db.prepare("SELECT * FROM artists WHERE email = ?").bind(profile3.email).first();
    if (existing) {
      artist = existing;
      merged = true;
    } else {
      artist = { id: newId("ar"), token: newToken(), ...profile3 };
      stmts.push(
        db.prepare(`INSERT INTO artists (id, email, name, city, country, website, instagram, bio, token, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
          artist.id,
          profile3.email,
          profile3.name,
          profile3.city,
          profile3.country,
          profile3.website,
          profile3.instagram,
          profile3.bio,
          artist.token,
          at,
          at
        )
      );
    }
  } else if (profile3.name || profile3.bio) {
    stmts.push(
      db.prepare(`UPDATE artists SET name=COALESCE(?, name), city=COALESCE(?, city), country=COALESCE(?, country),
                  website=COALESCE(?, website), instagram=COALESCE(?, instagram), bio=COALESCE(?, bio), updated_at=? WHERE id=?`).bind(profile3.name, profile3.city, profile3.country, profile3.website, profile3.instagram, profile3.bio, at, artist.id)
    );
  }
  const ids = [];
  for (const w of works) {
    const id = newId("wk");
    ids.push(id);
    const photos = await storePhotos(env2, id, w.files, 0);
    stmts.push(
      db.prepare(`INSERT INTO works (id, artist_id, title, year, medium, height_cm, width_cm, depth_cm, framed, description,
                  asking_price_usd, human_made, status, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, ?)`).bind(
        id,
        artist.id,
        w.title,
        w.year,
        w.medium,
        w.height_cm,
        w.width_cm,
        w.depth_cm,
        w.framed,
        w.description,
        w.asking_price_usd,
        w.human_made,
        at,
        at
      ),
      ...photos.map((p) => photoInsert(db, p, at))
    );
  }
  await db.batch(stmts);
  for (const id of ids) await logEvent(db, id, "submitted", null, profile3.email || artist.email);
  if (merged) return json({ ok: true, merged: true, works: ids.length });
  return json({ ok: true, works: ids.length, status_url: `/submission?t=${artist.token}` });
}
__name(onRequestPost3, "onRequestPost");
function onRequest2() {
  return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
}
__name(onRequest2, "onRequest");

// media/[id].js
var PUBLIC = ["published", "held", "sold", "shipped", "delivered"];
async function onRequestGet6({ params, env: env2 }) {
  const id = String(params.id || "");
  if (!env2.DB || !/^ph_[a-f0-9]{16}$/.test(id)) return new Response("Not found", { status: 404 });
  const row = await env2.DB.prepare(
    "SELECT p.content_type, w.status FROM photos p JOIN works w ON w.id = p.work_id WHERE p.id = ?"
  ).bind(id).first();
  if (!row || !PUBLIC.includes(row.status)) return new Response("Not found", { status: 404 });
  return await photoResponse(env2, id, row.content_type, "public, max-age=86400") || new Response("Not found", { status: 404 });
}
__name(onRequestGet6, "onRequestGet");

// _lib/access.js
var certsCache = { at: 0, keys: [] };
var b64urlToBytes = /* @__PURE__ */ __name((s) => {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "="));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
}, "b64urlToBytes");
var b64urlJson = /* @__PURE__ */ __name((s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s))), "b64urlJson");
async function getKeys(team) {
  if (Date.now() - certsCache.at < 10 * 60 * 1e3 && certsCache.keys.length) return certsCache.keys;
  const res = await fetch(`${team}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error("Could not fetch Access certificates");
  const { keys } = await res.json();
  certsCache = { at: Date.now(), keys: keys || [] };
  return certsCache.keys;
}
__name(getKeys, "getKeys");
async function verifyAccess(request, env2) {
  const team = (env2.ACCESS_TEAM_DOMAIN || "").replace(/\/+$/, "");
  if (!team) return null;
  const token = request.headers.get("cf-access-jwt-assertion") || (request.headers.get("cookie") || "").match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const header = b64urlJson(parts[0]);
    const payload = b64urlJson(parts[1]);
    if (header.alg !== "RS256") return null;
    const jwk = (await getKeys(team)).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      b64urlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );
    if (!ok) return null;
    const t = Math.floor(Date.now() / 1e3);
    if (payload.iss !== team) return null;
    if (payload.exp && payload.exp < t) return null;
    if (payload.nbf && payload.nbf > t + 60) return null;
    const auds = (env2.ACCESS_AUD || "").split(",").map((s) => s.trim()).filter(Boolean);
    const tokenAud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (auds.length && !tokenAud.some((a) => auds.includes(a))) return null;
    return { email: payload.email || payload.common_name || "access-user" };
  } catch {
    return null;
  }
}
__name(verifyAccess, "verifyAccess");

// admin/_middleware.js
var LOCKED = `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Admin locked \xB7 silkroute.art</title>
<body style="font:17px/1.6 system-ui,sans-serif;background:#F7F4EE;color:#1D1B18;max-width:560px;margin:15vh auto;padding:0 20px">
<h1 style="font:400 34px Georgia,serif">The admin page is locked</h1>
<p>It opens only through a Cloudflare Access login. If you run silkroute.art, sign in through the Access login page; if this keeps appearing, Access isn't set up for this address yet.</p></body>`;
async function onRequest3(context2) {
  const { request, env: env2 } = context2;
  const url = new URL(request.url);
  const local = ["localhost", "127.0.0.1"].includes(url.hostname) && env2.ADMIN_DEV_EMAIL;
  const user = local ? { email: env2.ADMIN_DEV_EMAIL } : await verifyAccess(request, env2);
  if (!user) {
    if (url.pathname.startsWith("/admin/api/")) {
      return new Response(JSON.stringify({ error: "Not signed in" }), { status: 401, headers: { "content-type": "application/json" } });
    }
    return new Response(LOCKED, { status: 401, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    if (!origin || origin !== url.origin) return new Response("Forbidden", { status: 403 });
  }
  context2.data.user = user;
  const res = await context2.next();
  const out = new Response(res.body, res);
  out.headers.set("cache-control", "no-store");
  out.headers.set("x-robots-tag", "noindex, nofollow");
  return out;
}
__name(onRequest3, "onRequest");

// _middleware.js
async function onRequest4({ request, next }) {
  const path = new URL(request.url).pathname;
  if (path.startsWith("/functions/") || path === "/wrangler.toml" || path === "/_routes.json") {
    return new Response("Not found", { status: 404 });
  }
  return next();
}
__name(onRequest4, "onRequest");

// ../.wrangler/tmp/pages-R3LIjf/functionsRoutes-0.36327154509700055.mjs
var routes = [
  {
    routePath: "/admin/api/photos/:id",
    mountPath: "/admin/api/photos",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/admin/api/works/:id",
    mountPath: "/admin/api/works",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/admin/api/works/:id",
    mountPath: "/admin/api/works",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/admin/api/works",
    mountPath: "/admin/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/signup",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/submission",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/submission-photo",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/submit",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/signup",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/submit",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/media/:id",
    mountPath: "/media",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/admin",
    mountPath: "/admin",
    method: "",
    middlewares: [onRequest3],
    modules: []
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "",
    middlewares: [onRequest4],
    modules: []
  }
];

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function getOriginalPathPrefix(requestPath, normalizedPrefix) {
  let end = 0;
  for (let index = 0; index < normalizedPrefix.length; index++) {
    end++;
    if (normalizedPrefix[index] === "/") {
      while (requestPath[end] === "/") {
        end++;
      }
    }
  }
  return requestPath.slice(0, end);
}
__name(getOriginalPathPrefix, "getOriginalPathPrefix");
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  const normalizedRequestPath = requestPath.replace(/\/+/g, "/");
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath) || routeMatcher(normalizedRequestPath);
    const originalMountMatch = mountMatcher(requestPath);
    const mountMatchResult = originalMountMatch || mountMatcher(normalizedRequestPath);
    if (matchResult && mountMatchResult) {
      const path = originalMountMatch ? originalMountMatch.path : getOriginalPathPrefix(requestPath, mountMatchResult.path);
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    const body = JSON.stringify(error3);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-uPV8rd/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../../../../../../tmp/claude-0/-home-user/625c2336-8b7d-57bf-a03a-3bff3e22a20b/scratchpad/wr/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-uPV8rd/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.16986232461751638.mjs.map
