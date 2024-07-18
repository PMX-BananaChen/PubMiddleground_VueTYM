import request from '@/utils/request'

// 查询干部签核人员列表
export function listCadrelist(query) {
  return request({
    url: '/system/Cadrelist/list',
    method: 'get',
    params: query
  })
}

// 查询干部签核人员详细
export function getCadrelist(cadrelistid) {
  return request({
    url: '/system/Cadrelist/' + cadrelistid,
    method: 'get'
  })
}

// 新增干部签核人员
export function addCadrelist(data) {
  return request({
    url: '/system/Cadrelist',
    method: 'post',
    data: data
  })
}

// 修改干部签核人员
export function updateCadrelist(data) {
  return request({
    url: '/system/Cadrelist',
    method: 'put',
    data: data
  })
}

// 删除干部签核人员
export function delCadrelist(cadrelistid) {
  return request({
    url: '/system/Cadrelist/' + cadrelistid,
    method: 'delete'
  })
}

// 导出干部签核人员
export function exportCadrelist(query) {
  return request({
    url: '/system/Cadrelist/export',
    method: 'get',
    params: query
  })
}