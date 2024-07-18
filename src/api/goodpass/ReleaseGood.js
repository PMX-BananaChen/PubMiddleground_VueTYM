import request from '@/utils/request'

// 查询物品放行列表
export function listReleaseGood(query) {
  return request({
    url: '/system/ReleaseGood/list',
    method: 'get',
    params: query
  })
}

// 查询物品放行列表
export function listReleaseGood3(query) {
  return request({
    url: '/system/ReleaseGood/list3',
    method: 'get',
    params: query
  })
}

// 查询物品放行列表
export function listReleaseGood4(query) {
  return request({
    url: '/system/ReleaseGood/list4',
    method: 'get',
    params: query
  })
}

// 查询物品放行详细
export function getReleaseGood(id) {
  return request({
    url: '/system/ReleaseGood/' + id,
    method: 'get'
  })
}

// 新增物品放行
export function addReleaseGood(data) {
  return request({
    url: '/system/ReleaseGood',
    method: 'post',
    data: data
  })
}

// 修改物品放行
export function updateReleaseGood(data) {
  return request({
    url: '/system/ReleaseGood',
    method: 'put',
    data: data
  })
}

// 删除物品放行
export function delReleaseGood(formno) {
  return request({
    url: '/system/ReleaseGood/' + formno,
    method: 'delete'
  })
}

// 导出物品放行
export function exportReleaseGood(query) {
  return request({
    url: '/system/ReleaseGood/export',
    method: 'get',
    params: query
  })
}
//查主表的信息
export function getformno(formno) {
  return request({
    url: '/system/ReleaseGood/getformno/' + formno,
    method: 'get'
  })
}
