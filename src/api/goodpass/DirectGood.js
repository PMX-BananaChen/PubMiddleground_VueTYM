import request from '@/utils/request'

// 查询物品類型權責主管列表
export function listDirectGood(query) {
  return request({
    url: '/system/DirectGood/list',
    method: 'get',
    params: query
  })
}

// 查询物品類型權責主管详细
export function getDirectGood(id) {
  return request({
    url: '/system/DirectGood/' + id,
    method: 'get'
  })
}

// 新增物品類型權責主管
export function addDirectGood(data) {
  return request({
    url: '/system/DirectGood',
    method: 'post',
    data: data
  })
}

// 修改物品類型權責主管
export function updateDirectGood(data) {
  return request({
    url: '/system/DirectGood',
    method: 'put',
    data: data
  })
}

// 删除物品類型權責主管
export function delDirectGood(id) {
  return request({
    url: '/system/DirectGood/' + id,
    method: 'delete'
  })
}

// 导出物品類型權責主管
export function exportDirectGood(query) {
  return request({
    url: '/system/DirectGood/export',
    method: 'get',
    params: query
  })
}