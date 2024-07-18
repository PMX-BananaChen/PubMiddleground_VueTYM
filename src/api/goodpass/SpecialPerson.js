import request from '@/utils/request'

// 查询G4人员列表
export function listSpecialPerson(query) {
  return request({
    url: '/system/SpecialPerson/list',
    method: 'get',
    params: query
  })
}

// 查询G4人员详细
export function getSpecialPerson(id) {
  return request({
    url: '/system/SpecialPerson/' + id,
    method: 'get'
  })
}

// 新增G4人员
export function addSpecialPerson(data) {
  return request({
    url: '/system/SpecialPerson',
    method: 'post',
    data: data
  })
}

// 修改G4人员
export function updateSpecialPerson(data) {
  return request({
    url: '/system/SpecialPerson',
    method: 'put',
    data: data
  })
}

// 删除G4人员
export function delSpecialPerson(id) {
  return request({
    url: '/system/SpecialPerson/' + id,
    method: 'delete'
  })
}

// 导出G4人员
export function exportSpecialPerson(query) {
  return request({
    url: '/system/SpecialPerson/export',
    method: 'get',
    params: query
  })
}