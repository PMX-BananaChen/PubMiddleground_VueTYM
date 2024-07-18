import request from '@/utils/request'

// 查询企业微信人员列表
export function listEmployee(query) {
  return request({
    url: '/system/Employee/list',
    method: 'get',
    params: query
  })
}

// 查询企业微信人员详细
export function getEmployee(empNo) {
  return request({
    url: '/system/Employee/' + empNo,
    method: 'get'
  })
}

// 新增企业微信人员
export function addEmployee(data) {
  return request({
    url: '/system/Employee',
    method: 'post',
    data: data
  })
}

// 修改企业微信人员
export function updateEmployee(data) {
  return request({
    url: '/system/Employee',
    method: 'put',
    data: data
  })
}

// 删除企业微信人员
export function delEmployee(empNo) {
  return request({
    url: '/system/Employee/' + empNo,
    method: 'delete'
  })
}

// 导出企业微信人员
export function exportEmployee(query) {
  return request({
    url: '/system/Employee/export',
    method: 'get',
    params: query
  })
}

export function inviteWx(empNo) {
  return request({
    url: '/system/Employee/inviteWx',
    method: 'get',
    params: {empNo}
  })
}

export function createWxNo(empNo,empName,mobilePhone) {
  return request({
    url: '/system/Employee/createWxNo',
    method: 'get',
    params: {empNo,empName,mobilePhone}
  })
}

export function updatePhone(empNo,mobilePhone) {
  return request({
    url: '/system/Employee/updatePhone',
    method: 'get',
    params: {empNo,mobilePhone}
  })
}

// 查询企业微信用户信息详细
export function getList(id) {
  return request({
    url: '/system/Employee/list/' + id,
    method: 'get'
  })
}