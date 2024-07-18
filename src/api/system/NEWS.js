import request from '@/utils/request'

// 查询东聚采风列表
export function listNEWS(query) {
    return request({
        url: '/system/NEWS/list',
        method: 'get',
        params: query
    })
}

// 查询东聚采风详细
export function getNEWS(newsid) {
    return request({
        url: '/system/NEWS/' + newsid,
        method: 'get'
    })
}

// 新增东聚采风
export function addNEWS(data) {
    return request({
        url: '/system/NEWS/add',
        method: 'post',
        data: data
    })
}

// 修改东聚采风
export function updateNEWS(data) {
    return request({
        url: '/system/NEWS/edit',
        method: 'post',
        data: data
    })
}

// 删除东聚采风
export function delNEWS(newsid) {
    return request({
        url: '/system/NEWS/' + newsid,
        method: 'delete'
    })
}

// 导出东聚采风
export function exportNEWS(query) {
    return request({
        url: '/system/NEWS/export',
        method: 'get',
        params: query
    })
}

// 查询期数列表
export function getPeriods() {
    return request({
        url: '/system/NEWS/getPeriods',
        method: 'get'
    })
}

// 查询下拉数据
export function searchOps(searchType) {
    return request({
        url: '/system/NEWS/searchOps',
        method: 'get',
        params: searchType
    })
}

// 上传东聚采风图片
export function uploadNEWS(data) {
    return request({
        url: '/system/NEWS/upload',
        method: 'post',
        data: data
    })
}


// 移动端查询东聚采风
export function getNEWSMobile(layoutDate, layoutYear, layoutType) {
    return request({
        url: '/system/NEWS/query',
        method: 'get',
        params: {
            layoutDate,
            layoutYear,
            layoutType
        }
    })
}

// 获取访问量和点赞量
export function getNum(key, type) {
    return request({
        url: '/system/NEWS/getNum',
        method: 'get',
        params: { key, type }
    })
}