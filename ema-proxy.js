/*
* 事件管理器。负责页面和页面，组件和组件之间事件通知管理
* */
let EventManager = function () {
  let manager = {
    bind: function (type, fn, scope) {
      if (type && typeof type === 'string' && fn && fn.constructor && typeof fn === 'function') {
        let handlers = this.events[type]
        if (!handlers) {
          handlers = this.events[type] = []
        }

        let i = handlers.length
        while (i--) {
          if (handlers[i][0] === fn) {
            return false
          }
        }
        handlers.push([fn, scope])
        return true
      }
      return false
    },
    unbind: function (type, fn) {
      if (type && type.constructor && type.constructor === String) {
        if (!fn) {
          delete this.events[type]
          return true
        } else if (fn && typeof fn === 'function') {
          let handlers = this.events[type]
          if (handlers && handlers.length) {
            let i = handlers.length
            while (i--) {
              if (handlers[i][0] === fn) {
                handlers.splice(i, 1)
                break
              }
            }
            return true
          }
          return false
        }
      }
      return false
    },
    clear: function () {
      this.events = []
    },
    fire: function (type) {
      let handlers
      if (type && typeof type === 'string' && (handlers = this.events[type]) && handlers.length) {
        let handler
        let argsArray = Array.prototype.slice.call(arguments, 1)
        let i = 0
        let scope
        while ((handler = handlers[i++])) {
          scope = handler[1] || window
          handler[0].apply(scope, argsArray)
        }
        return true
      }
      return false
    },
    count: function (type) {
      let handlers = this.events[type]
      return handlers ? handlers.length : 0
    },
    getProxy: function () {
      return new DisposeableEventManagerProxy(this)
    }
  }
  manager.events = []
  return manager
}

function DisposeableEventManagerProxy (em) {
  this.em = em
  this.msgs = []
  let fire = em.fire
  let async = em.async
  this.fire = function () {
    fire.apply(em, arguments)
  }
  this.async = function () {
    async.apply(em, arguments)
  }
}

DisposeableEventManagerProxy.prototype = {
  bind: function (type, fn, scope) {
    let result = this.em.bind(type, fn, scope)
    if (result) {
      this.msgs.push([type, fn])
    }
    return result
  },
  unbind: function (type, fn) {
    let em = this.em
    let msgs = this.msgs

    if (fn && typeof fn === 'function') {
      let result = em.unbind(type, fn)
      let i = msgs.length
      while (--i >= 0) {
        if (msgs[i][0] === type && msgs[i][1] === fn) {
          msgs.splice(i, 1)
        }
      }
      return result
    } else {
      let i = this.msgs.length
      while (i--) {
        if (msgs[i][0] === type) {
          em.unbind(type, msgs[i][1])
          msgs.splice(i, 1)
        }
      }
      return true
    }
  },
  dispose: function () {
    if (this.msgs == null) return
    let msgs = this.msgs
    let em = this.em
    let i = msgs.length
    while (i--) {
      em.unbind(msgs[i][0], msgs[i][1])
    }
    this.em = null
    this.msgs = null
  }
}

export default new EventManager()
