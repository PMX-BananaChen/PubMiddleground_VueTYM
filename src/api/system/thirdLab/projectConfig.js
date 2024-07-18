import request from '@/utils/request'

// 查询实验室专案组配置列表
export function listProjectConfig(query) {
  return request({
    url: '/system/projectConfig/list',
    method: 'get',
    params: query
  })
}

// 查询实验室专案组配置详细
export function getProjectConfig(id) {
  return request({
    url: '/system/projectConfig/' + id,
    method: 'get'
  })
}

// 新增实验室专案组配置
export function addProjectConfig(data) {
  return request({
    url: '/system/projectConfig',
    method: 'post',
    data: data
  })
}

// 修改实验室专案组配置
export function updateProjectConfig(data) {
  return request({
    url: '/system/projectConfig',
    method: 'put',
    data: data
  })
}

// 删除实验室专案组配置
export function delProjectConfig(id) {
  return request({
    url: '/system/projectConfig/' + id,
    method: 'delete'
  })
}

// 导出实验室专案组配置
export function exportProjectConfig(query) {
  return request({
    url: '/system/projectConfig/export',
    method: 'get',
    params: query
  })
}

// 导出实验室专案组配置
export function getProjectName(query) {
  return request({
    url: '/system/projectConfig/getProjectName',
    method: 'get',
  })
}