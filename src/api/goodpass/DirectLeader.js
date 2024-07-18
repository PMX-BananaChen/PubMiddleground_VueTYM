import request from '@/utils/request'

// 查询直属领导列表
export function listDirectLeader(query) {
  return request({
    url: '/system/DirectLeader/list',
    method: 'get',
    params: query
  })
}

// 查询直属领导详细
export function getDirectLeader(id) {
  return request({
    url: '/system/DirectLeader/' + id,
    method: 'get'
  })
}

// 新增直属领导
export function addDirectLeader(data) {
  return request({
    url: '/system/DirectLeader',
    method: 'post',
    data: data
  })
}

// 修改直属领导
export function updateDirectLeader(data) {
  return request({
    url: '/system/DirectLeader',
    method: 'put',
    data: data
  })
}

// 删除直属领导
export function delDirectLeader(id) {
  return request({
    url: '/system/DirectLeader/' + id,
    method: 'delete'
  })
}

// 导出直属领导
export function exportDirectLeader(query) {
  return request({
    url: '/system/DirectLeader/export',
    method: 'get',
    params: query
  })
}