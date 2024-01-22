import request from '@/utils/request'

// 查询生产线管理列表
export function listLine(query) {
  return request({
    url: '/erp/line/list',
    method: 'get',
    params: query
  })
}

// 查询生产线管理详细
export function getLine(lineId) {
  return request({
    url: '/erp/line/' + lineId,
    method: 'get'
  })
}
// 根据仓库id返回生产线list
export function getLinesByWarehouse(warehouseId) {
  return request({
    url: '/erp/line/getLinesByWarehouse/' + warehouseId,
    method: 'get'
  })
}

// 根据lineId获取住正在生产的生产计划
export function getCurrentPlanByLine(lineId) {
  return request({
    url: '/erp/line/getCurrentPlanByLine/' + lineId,
    method: 'get'
  })
}
//完成生产
export function completeProduce(lineId) {
  return request({
    url: '/erp/line/completeProduce/' + lineId,
    method: 'get'
  })
}

// 新增生产线管理
export function addLine(data) {
  return request({
    url: '/erp/line',
    method: 'post',
    data: data
  })
}

// 修改生产线管理
export function updateLine(data) {
  return request({
    url: '/erp/line',
    method: 'put',
    data: data
  })
}

// 删除生产线管理
export function delLine(lineId) {
  return request({
    url: '/erp/line/' + lineId,
    method: 'delete'
  })
}
// 订单审核提交
export function addLineAudit(data) {
  return request({
    url: '/erp/plan/addLineAudit',
    method: 'post',
    data: data
  })
}