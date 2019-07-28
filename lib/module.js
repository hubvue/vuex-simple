import {Vue} from './install'
class ModuleCollection  {
      constructor(options = {}){
            //注册
            this.register([],options)
      }
      register(path,rawModule) {
            const len = path.length;
            let newModule = {
                  _raw: rawModule,
                  state: rawModule.state,
                  _children: {}
            }
            if(len === 0) {
                  this.root = newModule;
            } else {
                  let parent = path.slice(0, -1).reduce((root, children) => {
                        return root._children[children];
                  },this.root);
                  parent._children[path[len - 1]] = newModule;
            }

            if(rawModule.modules) {
                  Object.keys(rawModule.modules).forEach((moduleName) => {
                        this.register(path.concat([moduleName]), rawModule.modules[moduleName]);
                  })
            }
      }
}

//把modules上的getters，mutations、actions、states，挂载在store上
function installModule (store,state,path,rootModule) {
      const len = path.length;
      //getters
      if(rootModule._raw.getters) {
            Object.keys(rootModule._raw.getters).forEach(getterName => {
                  Object.defineProperty(store.getters,getterName, {
                        get() {
                              return rootModule._raw.getters[getterName](rootModule.state);
                        }
                  })
            })
      }
      //mutations 
      if(rootModule._raw.mutations) {
            Object.keys(rootModule._raw.mutations).forEach(mutationName => {
                  let arr = store.mutations[mutationName] || (store.mutations[mutationName] = []);
                  arr.push((payload) => {
                        rootModule._raw.mutations[mutationName](rootModule.state, payload);
                  })
            })
      }
      // actions
      if(rootModule._raw.actions) {
            Object.keys(rootModule._raw.actions).forEach(actionName => {
                  let arr = store.actions[actionName] || (store.actions[actionName] = []);
                  arr.push((payload) => {
                        rootModule._raw.actions[actionName](store,payload);
                  })
            })
      }
      // state
      if(len > 0) {           //子模块，把所有子模块中的状态放在state中
            let parent = path.slice(0, -1).reduce((root, children) => {
                  return root[children];
            },state)
            // 响应式添加状态
            Vue.set(parent, path[len - 1], rootModule.state);
      }

      Object.keys(rootModule._children).forEach(childrenModule => {
            installModule(store,state,path.concat([childrenModule]), rootModule._children[childrenModule])
      })


}

export {
      ModuleCollection,
      installModule
}