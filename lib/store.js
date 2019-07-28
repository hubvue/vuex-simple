import {Vue} from  './install'
import {ModuleCollection, installModule} from './module'
class Store {
      constructor(options = {}) {
            //获取state
            let state = options.state;
            this._vm = new Vue({
                  data: {
                        state,
                  }
            });
            //getters
            // let getters = options.getters || {};
            this.getters = {}
            // Object.keys(getters).forEach((getterName) => {
            //       console.log(getterName);
            //       Object.defineProperty(this.getters, getterName, {
            //             get: () => {
            //                   return getters[getterName](this.state);
            //             }
            //       })
            // })

            //mutaions
            // let mutations = options.mutations || {};
            this.mutations = {}
            // Object.keys(mutations).forEach((mutationName) => {
            //       this.mutations[mutationName] = (payload) => {
            //             mutations[mutationName](this.state,payload)
            //       }
            // })
            //actions
            // let actions = options.actions || {};
            this.actions = {};
            // Object.keys(actions).forEach((actionName) => {
            //       this.actions[actionName] = (payload) => {
            //             actions[actionName](this, payload)
            //       }
            // })
            
            // 处理commit，dispatch中this指向的问题
            let {commit, dispatch} = this;
            this.commit = (type,payload) => {
                  commit.call(this,type,payload);
            }
            this.dispatch = (type, payload) => {
                  dispatch.call(this,type,payload);
            }

            // 格式化数据，形成一个新的数据结构。
            this.modules = new ModuleCollection(options);
            // 格式化好了  要安装
            installModule(this,this.state,[],this.modules.root);
            console.log(this.modules);
            /*
             let root =  {
                  _raw: rootModule,
                  state: rootModule.state
                  _children : {
                        a: {
                              _raw: aModule,
                              state: aModule.state
                              _children: {
                                    c: {
                                          _raw: cModule,
                                          state: cModule.state
                                          _children: {}
                                    },
                                    d: {
                                          _raw: dModule,
                                          state: dModule.state
                                          _children: {}
                                    }
                              }
                        },
                        b: {
                              _raw: bModule,
                              state: bModule.state
                              _children: {
                                    e: {
                                          _raw: eModule,
                                          state: eModule.state
                                          _children: {}
                                    },
                                    f: {
                                          _raw: fModule,
                                          state: fModule.state
                                          _children: {}
                                    }
                              }
                        }
                  }
             }

             */
      }
      get state() {
            return this._vm.state;
      }
      //commit
      commit(type, payload) {
            this.mutations[type].forEach(mutation => {
                  mutation(payload)
            });
      }
      //dispatch
      dispatch(type, payload) {
            this.actions[type].forEach(action => {
                  action(payload);
            })
      }
}

export default Store