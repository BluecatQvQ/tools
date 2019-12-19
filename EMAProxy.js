import EMA from './ema-proxy'

export default {
  created () {
    this.ema = EMA.getProxy()
  },
  beforeDestroy () {
    this.ema.dispose()
  }
}
