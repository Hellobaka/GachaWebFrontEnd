import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    savedPools: []
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
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_APIKEY: (state, apikey) => {
    state.APIKey = apikey
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_POOLS: (state, pools) => {
    state.savedPools = pools
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.data)
        setToken(response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetAPIKey({ commit }, data) {
    commit('SET_APIKEY', data)
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (!response.data) {
          reject('Verification failed, please Login again.')
        }
        console.log(response.data)
        const { developer, nickname, avatar, savedPools, email } = response.data
        let roles = ''
        if (developer === 0) {
          roles = 'user'
        } else if (developer === 1) {
          roles = 'developer'
        } else if (developer === 2) {
          roles = 'admin'
        }
        // debugger
        response.data.roles = roles
        commit('SET_ROLES', roles)
        commit('SET_NAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_EMAIL', email)
        commit('SET_APIKEY', response.data.apiKey)
        commit('SET_POOLS', savedPools)
        commit('SET_INFO', response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ token: state.token }).then(() => {
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

