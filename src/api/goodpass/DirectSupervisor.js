import request from '@/utils/request'

// 查询直屬權責主管列表
export function listDirectSupervisor(query) {
  return request({
    url: '/system/DirectSupervisor/list',
    method: 'get',
    params: query
  })
}

// 查询直屬權責主管详细
export function getDirectSupervisor(id) {
  return request({
    url: '/system/DirectSupervisor/' + id,
    method: 'get'
  })
}

// 新增直屬權責主管
export function addDirectSupervisor(data) {
  return request({
    url: '/system/DirectSupervisor',
    method: 'post',
    data: data
  })
}

// 修改直屬權責主管
export function updateDirectSupervisor(data) {
  return request({
    url: '/system/DirectSupervisor',
    method: 'put',
    data: data
  })
}

// 删除直屬權責主管
export function delDirectSupervisor(id) {
  return request({
    url: '/system/DirectSupervisor/' + id,
    method: 'delete'
  })
}

// 导出直屬權責主管
export function exportDirectSupervisor(query) {
  return request({
    url: '/system/DirectSupervisor/export',
    method: 'get',
    params: query
  })
}