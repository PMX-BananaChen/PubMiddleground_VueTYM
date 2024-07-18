import request from '@/utils/request'

// 查询直屬權責主管列表
export function listDirectManger(query) {
  return request({
    url: '/system/DirectManger/list',
    method: 'get',
    params: query
  })
}

// 查询直屬權責主管详细
export function getDirectManger(id) {
  return request({
    url: '/system/DirectManger/' + id,
    method: 'get'
  })
}

// 新增直屬權責主管
export function addDirectManger(data) {
  return request({
    url: '/system/DirectManger',
    method: 'post',
    data: data
  })
}

// 修改直屬權責主管
export function updateDirectManger(data) {
  return request({
    url: '/system/DirectManger',
    method: 'put',
    data: data
  })
}

// 删除直屬權責主管
export function delDirectManger(id) {
  return request({
    url: '/system/DirectManger/' + id,
    method: 'delete'
  })
}

// 导出直屬權責主管
export function exportDirectManger(query) {
  return request({
    url: '/system/DirectManger/export',
    method: 'get',
    params: query
  })
}