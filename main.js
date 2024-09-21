"use strict";
class Emitter {
    constructor() {
        this.events = new Map();
    }
    once(event, cb) {
        // 创建一个自定义函数通过on触发之后通过off删除
        const _cb = (...args) => {
            cb(...args);
            this.off(event, _cb);
        };
        this.on(event, _cb);
    }
    off(event, cb) {
        const cbs = this.events.get(event);
        if (cbs && cbs.length > 0) {
            cbs.splice(cbs.indexOf(cb), 1);
        }
    }
    on(event, cb) {
        // 证明存过了
        if (this.events.has(event)) {
            const cbs = this.events.get(event);
            cbs && cbs.push(cb);
        }
        else {
            // 否则就是第一次存
            this.events.set(event, [cb]);
        }
    }
    emit(event, ...args) {
        const cbs = this.events.get(event);
        cbs && cbs.forEach(cb => cb(...args));
    }
}
const bus = new Emitter();
function cb(b, n) {
    console.log('message', b, n);
}
// bus.on('message', cb) // 订阅
// bus.once('message', cb) // 单次订阅
// bus.off('message', cb) // 删除订阅
// bus.emit('message', false, 1) // 派发消息
