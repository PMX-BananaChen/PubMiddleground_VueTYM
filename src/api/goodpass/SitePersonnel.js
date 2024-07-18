import request from '@/utils/request'

// 查询站点人员列表
export function listSitePersonnel(query) {
  return request({
    url: '/system/SitePersonnel/list',
    method: 'get',
    params: query
  })
}

// 查询站点人员详细
export function getSitePersonnel(id) {
  return request({
    url: '/system/SitePersonnel/' + id,
    method: 'get'
  })
}

// 新增站点人员
export function addSitePersonnel(data) {
  return request({
    url: '/system/SitePersonnel',
    method: 'post',
    data: data
  })
}

// 修改站点人员
export function updateSitePersonnel(data) {
  return request({
    url: '/system/SitePersonnel',
    method: 'put',
    data: data
  })
}

// 删除站点人员
export function delSitePersonnel(id) {
  return request({
    url: '/system/SitePersonnel/' + id,
    method: 'delete'
  })
}

// 导出站点人员
export function exportSitePersonnel(query) {
  return request({
    url: '/system/SitePersonnel/export',
    method: 'get',
    params: query
  })
}