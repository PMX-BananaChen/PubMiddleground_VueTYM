import request from '@/utils/request'

// 查询安检站列表
export function listReleaseGoodStation(query) {
  return request({
    url: '/system/ReleaseGoodStation/list',
    method: 'get',
    params: query
  })
}

// 查询安检站详细
export function getReleaseGoodStation(id) {
  return request({
    url: '/system/ReleaseGoodStation/' + id,
    method: 'get'
  })
}

// 新增安检站
export function addReleaseGoodStation(data) {
  return request({
    url: '/system/ReleaseGoodStation',
    method: 'post',
    data: data
  })
}

// 修改安检站
export function updateReleaseGoodStation(data) {
  return request({
    url: '/system/ReleaseGoodStation',
    method: 'put',
    data: data
  })
}

// 删除安检站
export function delReleaseGoodStation(id) {
  return request({
    url: '/system/ReleaseGoodStation/' + id,
    method: 'delete'
  })
}

// 导出安检站
export function exportReleaseGoodStation(query) {
  return request({
    url: '/system/ReleaseGoodStation/export',
    method: 'get',
    params: query
  })
}