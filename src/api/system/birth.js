import request from '@/utils/request'


export function searchOps(query) {
    return request({
        url: '/system/birth/searchOps',
        method: 'get',
        params: query
    })
}

// 查询生日福利列表
export function listBirth(query) {
    return request({
        url: '/system/birth/list',
        method: 'get',
        params: query
    })
}

// 查询生日福利详细
export function getBirth(id) {
    return request({
        url: '/system/birth/' + id,
        method: 'get'
    })
}

// 新增生日福利
export function addBirth(data) {
    return request({
        url: '/system/birth',
        method: 'post',
        data: data
    })
}

// 修改生日福利
export function updateBirth(data) {
    return request({
        url: '/system/birth',
        method: 'put',
        data: data
    })
}

// 删除生日福利
export function delBirth(id) {
    return request({
        url: '/system/birth/' + id,
        method: 'delete'
    })
}

// 导出生日福利
export function exportBirth(query) {
    return request({
        url: '/system/birth/export',
        method: 'get',
        params: query
    })
}

// 下载用户导入模板
export function importTemplate() {
    return request({
        url: '/system/birth/importTemplate',
        method: 'get'
    })
}

// 校验是否消费
export function checkConsume(qrcode) {
    return request({
        url: `/system/birth/check/${qrcode}`,
        method: 'get'
    })
}

// 新增消费记录
export function birthCost(params) {
    return request({
        url: '/system/birth/birthCost',
        method: 'get',
        params: params
    })
}