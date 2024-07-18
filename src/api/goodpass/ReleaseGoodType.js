import request from '@/utils/request'

// 查询放行類型列表
export function listReleaseGoodType(query) {
  return request({
    url: '/system/ReleaseGoodType/list',
    method: 'get',
    params: query
  })
}

// 查询放行類型详细
export function getReleaseGoodType(id) {
  return request({
    url: '/system/ReleaseGoodType/' + id,
    method: 'get'
  })
}

// 新增放行類型
export function addReleaseGoodType(data) {
  return request({
    url: '/system/ReleaseGoodType',
    method: 'post',
    data: data
  })
}

// 修改放行類型
export function updateReleaseGoodType(data) {
  return request({
    url: '/system/ReleaseGoodType',
    method: 'put',
    data: data
  })
}

// 删除放行類型
export function delReleaseGoodType(id) {
  return request({
    url: '/system/ReleaseGoodType/' + id,
    method: 'delete'
  })
}

// 导出放行類型
export function exportReleaseGoodType(query) {
  return request({
    url: '/system/ReleaseGoodType/export',
    method: 'get',
    params: query
  })
}
