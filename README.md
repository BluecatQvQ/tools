# tools

## EMAProxy使用

组件里

```javascript
import EMAProxy from '@/js/mixin/EMAProxy'

export default{
mixins:[EMAProxy]

methods:{
this.ema.fire('xxx', data)
}
}
```

其他组件里

```javascript
mounted(){
this.ema.bind('xxx',this.dealData)
},
methods:{
dealData(data){
}
}
```
