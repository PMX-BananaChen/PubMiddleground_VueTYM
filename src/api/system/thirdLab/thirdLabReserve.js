import request from '@/utils/request'

// 查询实验室预约信息列表
export function listThirdLab(query) {
    return request({
        url: '/system/thirdLab/list',
        method: 'get',
        params: query
    })
}

// 查询实验室预约信息详细
export function getThirdLab(serialNo) {
    return request({
        url: '/system/thirdLab/' + serialNo,
        method: 'get'
    })
}

// 查询预约人信息详细
export function searchEmpInfo(searchNo) {
    return request({
        url: '/system/thirdLab/searchEmpInfo?searchNo=' + searchNo,
        method: 'get'
    })
}

// 新增实验室预约信息
export function addThirdLab(data) {
    return request({
        url: '/system/thirdLab',
        method: 'post',
        data: data
    })
}

// 修改实验室预约信息
export function updateThirdLab(data) {
    return request({
        url: '/system/thirdLab',
        method: 'put',
        data: data
    })
}

// 删除实验室预约信息
export function delThirdLab(serialNo) {
    return request({
        url: '/system/thirdLab/' + serialNo,
        method: 'delete'
    })
}

// 导出实验室预约信息
export function exportThirdLab(query) {
    return request({
        url: '/system/thirdLab/dataExport',
        method: 'get',
        params: query
    })
}

// 新增实验室审批信息信息
export function addflow(data) {
    return request({
        url: '/system/flowList',
        method: 'post',
        data: data
    })
}

// 查询实验室预约信息列表
export function listFlow(query) {
    return request({
        url: '/system/flowList/list',
        method: 'get',
        params: query
    })
}
//查询工厂，
export function searchOps(query) {
    return request({
        url: '/system/thirdLab/searchOps',
        method: 'get',
        params: query
    })
}

//获取专案名称对应的项目负责人信息
export function getProjectManageInfo(serialNo) {
    return request({
        url: '/system/thirdLab/getProjectManageInfo/' + serialNo,
        method: 'get',
    })
}

//获取测试数据列表
export function getLabTestData(serialNo) {
    return request({
        url: '/system/data/getLabTestData/' + serialNo,
        method: 'get',
    })
}

// 新增实验室机台设备采集信息
export function addTestData(data) {
    return request({
        url: '/system/data',
        method: 'post',
        data: data
    })
}

// 修改实验室机台设备采集信息
export function updateTestData(data) {
    return request({
        url: '/system/data',
        method: 'put',
        data: data
    })
}

// 查询实验室机台设备采集信息详细
export function getTestData(id) {
    return request({
        url: '/system/data/' + id,
        method: 'get'
    })
}

// 删除实验室机台设备采集信息
export function delTestData(id) {
    return request({
        url: '/system/data/' + id,
        method: 'delete'
    })
}

// 新增实验室机台设备采集信息
export function getTableSort(query) {
    return request({
        url: '/system/data/getTableSort',
        method: 'get',
        params: query
    })
}
export function sortChange(query) {
    return request({
        url: '/system/data/sortChange',
        method: 'put',
        params: query
    })
}

// 清空分配机台数据
export function cleanTestData(serialNo) {
    return request({
        url: '/system/thirdLab/cleanTestData/' + serialNo,
        method: 'delete'
    })
}

//
export function getMark(query) {
    return request({
        url: '/system/data/getMark/' + query,
        method: 'get',
    })
}

export function getPlanDate(query) {
    return request({
        url: '/system/data/getPlanDate',
        method: 'get',
        params: query
    })
}

export function getTestAllQty(query) {
    return request({
        url: '/system/thirdLab/getTestAllQty',
        method: 'get',
        params: query
    })
}

export function getIdleData(query) {
    return request({
        url: '/system/data/getIdleData',
        method: 'get',
        params: query
    })
}

// 下载用户导入模板
export function importTemplate() {
    return request({
        url: '/system/thirdLab/importTemplate',
        method: 'get'
    })
}

// 新增实验室机台设备采集信息
export function checkEstDate(data) {
    return request({
        url: '/system/data/checkEstDate',
        method: 'post',
        data: data
    })
}

export function getMachineData(data) {
    return request({
        url: '/system/data/getMachineData',
        method: 'get',
        params: data
    })
}

export function changeMachineTime(data) {
    return request({
        url: '/system/data/changeMachineTime',
        method: 'post',
        data: data
    })
}

export function print(data) {
    return request({
        url: '/system/thirdLab/print',
        method: 'get',
        params: data
    })
}

export function getRelevantPersonInfo(query) {
    return request({
        url: '/system/thirdLab/getRelevantPersonInfo',
        method: 'get',
        params: query
    })
}

export function addImgData(data) {
    return request({
        url: '/system/uploadimage',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: data // 参数需要是单一的formData形式
    })
}

export function downLoadFile(data) {
    return request({
        url: '/system/thirdLab/downLoad',
        method: 'post',
        data: data
    })
}