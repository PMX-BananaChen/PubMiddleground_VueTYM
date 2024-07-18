import request from '@/utils/request'

// 查询特殊直屬權責主管列表
export function listDirectSupervisorSpecial(query) {
  return request({
    url: '/system/DirectSupervisorSpecial/list',
    method: 'get',
    params: query
  })
}

// 查询特殊直屬權責主管详细
export function getDirectSupervisorSpecial(id) {
  return request({
    url: '/system/DirectSupervisorSpecial/' + id,
    method: 'get'
  })
}

// 新增特殊直屬權責主管
export function addDirectSupervisorSpecial(data) {
  return request({
    url: '/system/DirectSupervisorSpecial',
    method: 'post',
    data: data
  })
}

// 修改特殊直屬權責主管
export function updateDirectSupervisorSpecial(data) {
  return request({
    url: '/system/DirectSupervisorSpecial',
    method: 'put',
    data: data
  })
}

// 删除特殊直屬權責主管
export function delDirectSupervisorSpecial(id) {
  return request({
    url: '/system/DirectSupervisorSpecial/' + id,
    method: 'delete'
  })
}

// 导出特殊直屬權責主管
export function exportDirectSupervisorSpecial(query) {
  return request({
    url: '/system/DirectSupervisorSpecial/export',
    method: 'get',
    params: query
  })
}