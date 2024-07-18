import request from '@/utils/request'

// 查询專案主管列表
export function listProjectSupervisor(query) {
  return request({
    url: '/system/ProjectSupervisor/list',
    method: 'get',
    params: query
  })
}

// 查询專案主管详细
export function getProjectSupervisor(id) {
  return request({
    url: '/system/ProjectSupervisor/' + id,
    method: 'get'
  })
}

// 新增專案主管
export function addProjectSupervisor(data) {
  return request({
    url: '/system/ProjectSupervisor',
    method: 'post',
    data: data
  })
}

// 修改專案主管
export function updateProjectSupervisor(data) {
  return request({
    url: '/system/ProjectSupervisor',
    method: 'put',
    data: data
  })
}

// 删除專案主管
export function delProjectSupervisor(id) {
  return request({
    url: '/system/ProjectSupervisor/' + id,
    method: 'delete'
  })
}

// 导出專案主管
export function exportProjectSupervisor(query) {
  return request({
    url: '/system/ProjectSupervisor/export',
    method: 'get',
    params: query
  })
}