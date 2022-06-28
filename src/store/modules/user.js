import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    roles: [],
    buttons: [],
    resultAsyncRoutes: [],
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    //存储用户信息
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles

  },
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    router.addRoutes(state.resultAllRoutes)
  }

}

const computedAsyncRoutes = (asyncRoutes, routes) => {
  console.log(asyncRoutes, 11);
  console.log(routes, 22);
  //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item => {
    //数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1 
    if (routes.indexOf(item.name) != -1) {
      //递归:别忘记还有2、3、4、5、6级路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  })

}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    // const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    console.log(result);
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
    } else {
      return Promise.reject(new Error('fail'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        commit("SET_USERINFO", data)
        commit(
          'SET_RESULTASYNCROUTES',
          computedAsyncRoutes(asyncRoutes, data.routes)
        );
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

