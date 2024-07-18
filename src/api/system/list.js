import request from '@/utils/request'

// 查询企业微信用户信息列表
export function listList(query) {
  return request({
    url: '/system/list/list',
    method: 'get',
    params: query
  })
}

// 查询企业微信用户信息详细
export function getList(id) {
  return request({
    url: '/system/list/' + id,
    method: 'get'
  })
}

// 新增企业微信用户信息
export function addList(data) {
  return request({
    url: '/system/list',
    method: 'post',
    data: data
  })
}

// 修改企业微信用户信息
export function updateList(data) {
  return request({
    url: '/system/list',
    method: 'put',
    data: data
  })
}

// 删除企业微信用户信息
export function delList(id) {
  return request({
    url: '/system/list/' + id,
    method: 'delete'
  })
}

// 导出企业微信用户信息
export function exportList(query) {
  return request({
    url: '/system/list/export',
    method: 'get',
    params: query
  })
}