import request from '@/utils/request'

// 查询工资扣帐列表
export function listMoney(query) {
    return request({
        url: '/system/money/list',
        method: 'get',
        params: query
    })
}

// 查询工资扣帐详细
export function getMoney(id) {
    return request({
        url: '/system/money/' + id,
        method: 'get'
    })
}

// 新增工资扣帐
export function addMoney(data) {
    return request({
        url: '/system/money',
        method: 'post',
        data: data
    })
}

// 修改工资扣帐
export function updateMoney(data) {
    return request({
        url: '/system/money',
        method: 'put',
        data: data
    })
}

// 删除工资扣帐
export function delMoney(id) {
    return request({
        url: '/system/money/' + id,
        method: 'delete'
    })
}

// 导出工资扣帐
export function exportMoney(query) {
    return request({
        url: '/system/money/export',
        method: 'get',
        params: query
    })
}

// 查询生成月份下拉
export function searchOps() {
    return request({
        url: '/system/money/getGenerateMonth',
        method: 'get'
    })
}