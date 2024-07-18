import request from '@/utils/request'

// 查询IT签核人员列表
export function listITlist(query) {
  return request({
    url: '/system/ITlist/list',
    method: 'get',
    params: query
  })
}

// 查询IT签核人员详细
export function getITlist(itlistid) {
  return request({
    url: '/system/ITlist/' + itlistid,
    method: 'get'
  })
}

// 新增IT签核人员
export function addITlist(data) {
  return request({
    url: '/system/ITlist',
    method: 'post',
    data: data
  })
}

// 修改IT签核人员
export function updateITlist(data) {
  return request({
    url: '/system/ITlist',
    method: 'put',
    data: data
  })
}

// 删除IT签核人员
export function delITlist(itlistid) {
  return request({
    url: '/system/ITlist/' + itlistid,
    method: 'delete'
  })
}

// 导出IT签核人员
export function exportITlist(query) {
  return request({
    url: '/system/ITlist/export',
    method: 'get',
    params: query
  })
}