import request from '@/utils/request'

// 查询生日福利人员消费列表
export function listConsume(query) {
    return request({
        url: '/system/consume/list',
        method: 'get',
        params: query
    })
}

// 查询生日福利人员消费详细
export function getConsume(id) {
    return request({
        url: '/system/consume/' + id,
        method: 'get'
    })
}

// 新增生日福利人员消费
export function addConsume(data) {
    return request({
        url: '/system/consume',
        method: 'post',
        data: data
    })
}

// 修改生日福利人员消费
export function updateConsume(data) {
    return request({
        url: '/system/consume',
        method: 'put',
        data: data
    })
}

// 删除生日福利人员消费
export function delConsume(id) {
    return request({
        url: '/system/consume/' + id,
        method: 'delete'
    })
}

// 导出生日福利人员消费
export function exportConsume(query) {
    return request({
        url: '/system/consume/export',
        method: 'get',
        params: query
    })
}

// 查询消费charts
export function getConsumeCharts(query) {
    return request({
        url: '/system/consume/getConsumeCharts',
        method: 'get',
        params: query
    })
}