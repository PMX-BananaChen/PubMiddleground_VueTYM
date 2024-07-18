import request from '@/utils/request'

// 查询PH2人员列表
export function listPerson(query) {
  return request({
    url: '/system/Person/list',
    method: 'get',
    params: query
  })
}

// 查询PH2人员详细
export function getPerson(id) {
  return request({
    url: '/system/Person/' + id,
    method: 'get'
  })
}

// 新增PH2人员
export function addPerson(data) {
  return request({
    url: '/system/Person',
    method: 'post',
    data: data
  })
}

// 修改PH2人员
export function updatePerson(data) {
  return request({
    url: '/system/Person',
    method: 'put',
    data: data
  })
}

// 删除PH2人员
export function delPerson(id) {
  return request({
    url: '/system/Person/' + id,
    method: 'delete'
  })
}

// 导出PH2人员
export function exportPerson(query) {
  return request({
    url: '/system/Person/export',
    method: 'get',
    params: query
  })
}