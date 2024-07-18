import request from '@/utils/request'

// 查询实验室机台配置列表
export function listMachine(query) {
  return request({
    url: '/system/machine/list',
    method: 'get',
    params: query
  })
}

// 查询实验室机台配置详细
export function getMachine(id) {
  return request({
    url: '/system/machine/' + id,
    method: 'get'
  })
}

// 新增实验室机台配置
export function addMachine(data) {
  return request({
    url: '/system/machine',
    method: 'post',
    data: data
  })
}

// 修改实验室机台配置
export function updateMachine(data) {
  return request({
    url: '/system/machine',
    method: 'put',
    data: data
  })
}

// 删除实验室机台配置
export function delMachine(id) {
  return request({
    url: '/system/machine/' + id,
    method: 'delete'
  })
}

// 导出实验室机台配置
export function exportMachine(query) {
  return request({
    url: '/system/machine/export',
    method: 'get',
    params: query
  })
}

// 获取可用机台
export function getUsableMachine() {
  return request({
    url: '/system/machine/getUsableMachine',
    method: 'get'
  })
}

// 获取可用机台
export function getMachineData() {
  return request({
    url: '/system/machine/getMachine',
    method: 'get'
  })
}

export function startDataUpdate(query) {
  return request({
    url: '/system/data/startDataUpdate',
    method: 'post',
    params: query
  })
}
export function endDataUpdate(query) {
  return request({
    url: '/system/data/endDataUpdate',
    method: 'post',
    params: query
  })
}
export function getMachineMark(query) {
  return request({
    url: '/system/machine/getMachineMark',
    method: 'get',
    params: query
  })
}