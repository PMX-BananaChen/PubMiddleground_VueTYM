import request from '@/utils/request'

// 查询單位主管列表
export function listUnitsupervisor(query) {
  return request({
    url: '/system/Unitsupervisor/list',
    method: 'get',
    params: query
  })
}

// 查询單位主管详细
export function getUnitsupervisor(id) {
  return request({
    url: '/system/Unitsupervisor/' + id,
    method: 'get'
  })
}

// 新增單位主管
export function addUnitsupervisor(data) {
  return request({
    url: '/system/Unitsupervisor',
    method: 'post',
    data: data
  })
}

// 修改單位主管
export function updateUnitsupervisor(data) {
  return request({
    url: '/system/Unitsupervisor',
    method: 'put',
    data: data
  })
}

// 删除單位主管
export function delUnitsupervisor(id) {
  return request({
    url: '/system/Unitsupervisor/' + id,
    method: 'delete'
  })
}

// 导出單位主管
export function exportUnitsupervisor(query) {
  return request({
    url: '/system/Unitsupervisor/export',
    method: 'get',
    params: query
  })
}