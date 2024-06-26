import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, setLogin, setLogout } from '@/api/common'

import type { ILoginParams, IUserInfo } from '@/types/api/common'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  function getToken() {
    if (token.value) {
      return token.value
    }
    token.value = localStorage.getItem('token') || ''
    return token.value
  }
  function setToken(value: string) {
    token.value = value
    localStorage.setItem('token', value)
  }
  function removeToken() {
    token.value = ''
    localStorage.removeItem('token')
  }

  async function login(data: ILoginParams) {
    const [err, result] = await setLogin(data)
    if (result) {
      setToken(result.data)
    } else {
      throw err
    }
  }
  async function logout() {
    await setLogout()
    removeToken()
  }

  const userInfo = ref<IUserInfo>({
    nickName: '',
    avatar: '',
    permissions: [],
    roles: []
  })
  async function getUserInfoAction() {
    const [, result] = await getUserInfo()
    if (result) {
      userInfo.value = result.data
    }
  }

  return {
    token,
    getToken,
    setToken,
    removeToken,
    login,
    logout,
    userInfo,
    getUserInfoAction
  }
})
