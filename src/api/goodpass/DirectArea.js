import request from '@/utils/request'

// 查询區域權責主管列表
export function listDirectArea(query) {
  return request({
    url: '/system/DirectArea/list',
    method: 'get',
    params: query
  })
}

// 查询區域權責主管详细
export function getDirectArea(id) {
  return request({
    url: '/system/DirectArea/' + id,
    method: 'get'
  })
}

// 新增區域權責主管
export function addDirectArea(data) {
  return request({
    url: '/system/DirectArea',
    method: 'post',
    data: data
  })
}

// 修改區域權責主管
export function updateDirectArea(data) {
  return request({
    url: '/system/DirectArea',
    method: 'put',
    data: data
  })
}

// 删除區域權責主管
export function delDirectArea(id) {
  return request({
    url: '/system/DirectArea/' + id,
    method: 'delete'
  })
}

// 导出區域權責主管
export function exportDirectArea(query) {
  return request({
    url: '/system/DirectArea/export',
    method: 'get',
    params: query
  })
}