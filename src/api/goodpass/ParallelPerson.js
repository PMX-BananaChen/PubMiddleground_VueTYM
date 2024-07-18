import request from '@/utils/request'

// 查询G4平行人员列表
export function listParallelPerson(query) {
  return request({
    url: '/system/ParallelPerson/list',
    method: 'get',
    params: query
  })
}

// 查询G4平行人员详细
export function getParallelPerson(id) {
  return request({
    url: '/system/ParallelPerson/' + id,
    method: 'get'
  })
}

// 新增G4平行人员
export function addParallelPerson(data) {
  return request({
    url: '/system/ParallelPerson',
    method: 'post',
    data: data
  })
}

// 修改G4平行人员
export function updateParallelPerson(data) {
  return request({
    url: '/system/ParallelPerson',
    method: 'put',
    data: data
  })
}

// 删除G4平行人员
export function delParallelPerson(id) {
  return request({
    url: '/system/ParallelPerson/' + id,
    method: 'delete'
  })
}

// 导出G4平行人员
export function exportParallelPerson(query) {
  return request({
    url: '/system/ParallelPerson/export',
    method: 'get',
    params: query
  })
}