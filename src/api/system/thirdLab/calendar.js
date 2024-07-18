import request from '@/utils/request'

// 查询3d实验室行事历列表
export function listCalendar(query) {
  return request({
    url: '/system/calendar/list',
    method: 'get',
    params: query
  })
}

// 查询3d实验室行事历详细
export function getCalendar(id) {
  return request({
    url: '/system/calendar/' + id,
    method: 'get'
  })
}

// 新增3d实验室行事历
export function addCalendar(data) {
  return request({
    url: '/system/calendar',
    method: 'post',
    data: data
  })
}

// 修改3d实验室行事历
export function updateCalendar(data) {
  return request({
    url: '/system/calendar',
    method: 'put',
    data: data
  })
}

// 删除3d实验室行事历
export function delCalendar(id) {
  return request({
    url: '/system/calendar/' + id,
    method: 'delete'
  })
}

// 导出3d实验室行事历
export function exportCalendar(query) {
  return request({
    url: '/system/calendar/export',
    method: 'get',
    params: query
  })
}

export function getMarks(query) {
  return request({
    url: '/system/calendar/getMark',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
      url: '/system/calendar/importTemplate',
      method: 'get'
  })
}