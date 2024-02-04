import { request } from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types'
import type { IRoleList, IRoleQuery, IRoleEditParam } from '@/types/api/role'

export const getRoleList = (params: IRoleQuery) => {
  return request<IBaseResponse<IBaseList<IRoleList>>>({
    url: '/admin/role',
    method: 'GET',
    params
  })
}

export const updateRole = (id: number, data: IRoleEditParam) => {
  return request<IBaseResponse>({
    url: `/admin/role/${id}`,
    method: 'put',
    data
  })
}
