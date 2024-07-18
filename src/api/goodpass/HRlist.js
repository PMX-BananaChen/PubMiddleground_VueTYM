import request from '@/utils/request'

// 查询HR签核人员列表
export function listHRlist(query) {
  return request({
    url: '/system/HRlist/list',
    method: 'get',
    params: query
  })
}

// 查询HR签核人员详细
export function getHRlist(hrlistid) {
  return request({
    url: '/system/HRlist/' + hrlistid,
    method: 'get'
  })
}

// 新增HR签核人员
export function addHRlist(data) {
  return request({
    url: '/system/HRlist',
    method: 'post',
    data: data
  })
}

// 修改HR签核人员
export function updateHRlist(data) {
  return request({
    url: '/system/HRlist',
    method: 'put',
    data: data
  })
}

// 删除HR签核人员
export function delHRlist(hrlistid) {
  return request({
    url: '/system/HRlist/' + hrlistid,
    method: 'delete'
  })
}

// 导出HR签核人员
export function exportHRlist(query) {
  return request({
    url: '/system/HRlist/export',
    method: 'get',
    params: query
  })
}