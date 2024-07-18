import request from '@/utils/request'

// 查询3d用户配置列表
export function listEmpInfo(query) {
  return request({
    url: '/system/empInfo/list',
    method: 'get',
    params: query
  })
}

// 查询3d用户配置详细
export function getEmpInfo(empName) {
  return request({
    url: '/system/empInfo/' + empName,
    method: 'get'
  })
}

// 新增3d用户配置
export function addEmpInfo(data) {
  return request({
    url: '/system/empInfo',
    method: 'post',
    data: data
  })
}

// 修改3d用户配置
export function updateEmpInfo(data) {
  return request({
    url: '/system/empInfo',
    method: 'put',
    data: data
  })
}

// 删除3d用户配置
export function delEmpInfo(empName) {
  return request({
    url: '/system/empInfo/' + empName,
    method: 'delete'
  })
}

// 导出3d用户配置
export function exportEmpInfo(query) {
  return request({
    url: '/system/empInfo/export',
    method: 'get',
    params: query
  })
}

// 查询用户
export function getInfoByEmpNo(empNo) {
  return request({
    url: '/system/empInfo/getInfoByEmpNo/' + empNo,
    method: 'get'
  })
}

// 查询用户
export function getDeptOps() {
  return request({
    url: '/system/empInfo/getDeptOps',
    method: 'get'
  })
}



