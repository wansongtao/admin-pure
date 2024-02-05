import { request } from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types'
import type { IUserQuery, IUserList } from '@/types/api/user'

export const getUserList = (params: IUserQuery) => {
  return request<IBaseResponse<IBaseList<IUserList>>>({
    url: '/admin/user',
    method: 'get',
    params
  })
}

export const deleteUser = (id: number) => {
  return request<IBaseResponse>({
    url: `/admin/user/${id}`,
    method: 'delete'
  })
}

export const deleteMultipleUsers = (id: number[]) => {
  return request<IBaseResponse>({
    url: '/admin/user',
    method: 'delete',
    data: {
      id
    }
  })
}
