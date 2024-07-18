import request from '@/utils/request'

// 查询PH2部门编号列表
export function listDepartment(query) {
  return request({
    url: '/system/Department/list',
    method: 'get',
    params: query
  })
}

// 查询PH2部门编号详细
export function getDepartment(id) {
  return request({
    url: '/system/Department/' + id,
    method: 'get'
  })
}

// 新增PH2部门编号
export function addDepartment(data) {
  return request({
    url: '/system/Department',
    method: 'post',
    data: data
  })
}

// 修改PH2部门编号
export function updateDepartment(data) {
  return request({
    url: '/system/Department',
    method: 'put',
    data: data
  })
}

// 删除PH2部门编号
export function delDepartment(id) {
  return request({
    url: '/system/Department/' + id,
    method: 'delete'
  })
}

// 导出PH2部门编号
export function exportDepartment(query) {
  return request({
    url: '/system/Department/export',
    method: 'get',
    params: query
  })
}