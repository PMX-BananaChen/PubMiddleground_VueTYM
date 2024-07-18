import request from '@/utils/request'

// 查询量测数据汇总列表
export function listLabAgg(query) {
  return request({
    url: '/system/labAgg/list',
    method: 'get',
    params: query
  })
}

// 导出量测数据汇总
export function exportLabAgg(query) {
  return request({
    url: '/system/labAgg/export',
    method: 'get',
    params: query
  })
}