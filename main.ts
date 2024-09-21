// 实现 once on emit off 订阅中心Map<事件名称, 订阅函数[]>
interface I {
  events: Map<string, Function[]>; // 事件名称和订阅函数的映射表
  once: (event: string, cb: Function) => void; // 触发一次订阅器
  on: (event: string, cb: Function) => void; // 订阅
  emit: (event: string, ...args: any[]) => void; // 派发
  off: (event: string, cb: Function) => void; // 删除监听器
}

class Emitter implements I {
  events: Map<string, Function[]>;
  constructor() {
    this.events = new Map();
  }
  once(event: string, cb: Function) {
    // 创建一个自定义函数通过on触发之后通过off删除
    const _cb = (...args: any[]) => {
      cb(...args)
      this.off(event, _cb)
    }
    this.on(event, _cb)
  }

  off(event: string, cb: Function) {
    const cbs = this.events.get(event)
    if (cbs && cbs.length > 0) {
      cbs.splice(cbs.indexOf(cb), 1)
    }
  }

  on(event: string, cb: Function) {
    // 证明存过了
    if (this.events.has(event)) {
      const cbs = this.events.get(event)
      cbs && cbs.push(cb)
    } else {
      // 否则就是第一次存
      this.events.set(event, [cb]);
    }
  }

  emit(event: string, ...args: any[]) {
    const cbs = this.events.get(event)
    cbs && cbs.forEach(cb => cb(...args))
  }
}

const bus = new Emitter();

function cb(b: boolean, n: number) {
  console.log('message', b, n)
}

// bus.on('message', cb) // 订阅

// bus.once('message', cb) // 单次订阅

// bus.off('message', cb) // 删除订阅

// bus.emit('message', false, 1) // 派发消息
