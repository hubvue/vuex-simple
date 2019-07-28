let Vue;
function install (_Vue) {
      Vue = _Vue;
      //需要给每一个组件都注册一个$store属性,通过mixin方法，在beforeCreate生命周期中注入$store
      Vue.mixin({
            beforeCreate() {
                  // Vue的渲染层级，是先渲染父组件，再渲染子组件，在所有子组件渲染完成之后，父组件渲染完成。
                  if(this.$options && this.$options.store) {            //判断是root组件
                        this.$store = this.$options.store;               
                  } else {                                                                  //不是root组件那就是子组件，在父组件中得到$store
                        this.$store = this.$parent && this.$parent.$store;
                  }
            }
      })
}

export  {
      install,
      Vue
}