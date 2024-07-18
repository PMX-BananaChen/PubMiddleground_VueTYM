import request from '@/utils/request'

// 查询工资扣帐列表
export function listDeduct(query) {
    return request({
        url: '/system/deduct/list',
        method: 'get',
        params: query
    })
}

// 查询工资扣帐详细
export function getMoney(id) {
    return request({
        url: '/system/deduct/' + id,
        method: 'get'
    })
}

// 新增工资扣帐
export function addMoney(data) {
    return request({
        url: '/system/deduct',
        method: 'post',
        data: data
    })
}

// 修改工资扣帐
export function updateMoney(data) {
    return request({
        url: '/system/deduct',
        method: 'put',
        data: data
    })
}

// 删除工资扣帐
export function delMoney(id) {
    return request({
        url: '/system/deduct/' + id,
        method: 'delete'
    })
}

// 导出工资扣帐
export function exportDeduct(query) {
    return request({
        url: '/system/deduct/export',
        method: 'get',
        params: query
    })
}

// 查询生成月份下拉
export function searchOps() {
    return request({
        url: '/system/deduct/getGenerateMonth',
        method: 'get'
    })
}

// 下载用户导入模板
export function importTemplate() {
    return request({
        url: '/system/deduct/importTemplate',
        method: 'get'
    })
}