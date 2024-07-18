import request from '@/utils/request'

// 查询總務負責人签核人员列表
export function listGeneralAffairslist(query) {
  return request({
    url: '/system/GeneralAffairslist/list',
    method: 'get',
    params: query
  })
}

// 查询總務負責人签核人员详细
export function getGeneralAffairslist(generalaffairslistid) {
  return request({
    url: '/system/GeneralAffairslist/' + generalaffairslistid,
    method: 'get'
  })
}

// 新增總務負責人签核人员
export function addGeneralAffairslist(data) {
  return request({
    url: '/system/GeneralAffairslist',
    method: 'post',
    data: data
  })
}

// 修改總務負責人签核人员
export function updateGeneralAffairslist(data) {
  return request({
    url: '/system/GeneralAffairslist',
    method: 'put',
    data: data
  })
}

// 删除總務負責人签核人员
export function delGeneralAffairslist(generalaffairslistid) {
  return request({
    url: '/system/GeneralAffairslist/' + generalaffairslistid,
    method: 'delete'
  })
}

// 导出總務負責人签核人员
export function exportGeneralAffairslist(query) {
  return request({
    url: '/system/GeneralAffairslist/export',
    method: 'get',
    params: query
  })
}