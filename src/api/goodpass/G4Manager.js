import request from '@/utils/request'

// 查询G4主管列表
export function listG4Manager(query) {
  return request({
    url: '/system/G4Manager/list',
    method: 'get',
    params: query
  })
}

// 查询G4主管详细
export function getG4Manager(id) {
  return request({
    url: '/system/G4Manager/' + id,
    method: 'get'
  })
}

// 新增G4主管
export function addG4Manager(data) {
  return request({
    url: '/system/G4Manager',
    method: 'post',
    data: data
  })
}

// 修改G4主管
export function updateG4Manager(data) {
  return request({
    url: '/system/G4Manager',
    method: 'put',
    data: data
  })
}

// 删除G4主管
export function delG4Manager(id) {
  return request({
    url: '/system/G4Manager/' + id,
    method: 'delete'
  })
}

// 导出G4主管
export function exportG4Manager(query) {
  return request({
    url: '/system/G4Manager/export',
    method: 'get',
    params: query
  })
}