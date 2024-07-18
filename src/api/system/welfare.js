import request from '@/utils/request'

// 查询生日福利列表
export function listWelfare(query) {
  return request({
    url: '/system/welfare/list',
    method: 'get',
    params: query
  })
}

// 查询生日福利详细
export function getWelfare(id) {
  return request({
    url: '/system/welfare/' + id,
    method: 'get'
  })
}

// 新增生日福利
export function addWelfare(data) {
  return request({
    url: '/system/welfare',
    method: 'post',
    data: data
  })
}

// 修改生日福利
export function updateWelfare(data) {
  return request({
    url: '/system/welfare',
    method: 'put',
    data: data
  })
}

// 删除生日福利
export function delWelfare(id) {
  return request({
    url: '/system/welfare/' + id,
    method: 'delete'
  })
}

// 导出生日福利
export function exportWelfare(query) {
  return request({
    url: '/system/welfare/export',
    method: 'get',
    params: query
  })
}