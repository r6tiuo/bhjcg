import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
  //全局的userId
  state: {
    username: '',
    permission:[]
  },
  mutations: {
    setUsername(state,data) {
      console.log("给username赋值："+data);
      state.username = data;
    },
    SET_PERMISSION(state,permission){//permission 为传入的权限标识集合
      // 传入的权限集合 赋值给状态中的 permission
      state.permission = permission;
    }
  },
  actions: {
    SET_PERMISSION(context,permission){
      // 提交到 mutation 中的 SET_PERMISSION 函数
      context.commit("SET_PERMISSION",permission);
    }
  },
  getters: {
    getUsername(state) {
      console.log("获取username的值："+state.username)
      return state.username
    },
  }
})
