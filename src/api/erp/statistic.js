import request from '@/utils/request'

// 查询生产管理列表
export function getAllModulePreview(query) {
  return request({
    url: '/erp/statistics/getAllModulePreview',
    method: 'get',
    params: query
  })
}
// 数据分析  采购 生产 销售  出库时间节点
export function getSalesAndPurchaseAndProduceStatistics(data) {
  return request({
    url: '/erp/statistics/getSalesAndPurchaseAndProduceStatistics',
    method: 'post',
    data: data
  })
}
// 数据图表分析  采购 生产 销售  出库时间节点
export function getSalesAndPurchaseAndProduceAnalysis(data) {
  return request({
    url: '/erp/statistics/getSalesAndPurchaseAndProduceAnalysis',
    method: 'post',
    data: data
  })
}

// 金额数据分析  采购  销售  时间节点
export function getSalesAndPurchase30DayAnalysis(data) {
  return request({
    url: '/erp/statistics/getSalesAndPurchase30DayAnalysis',
    method: 'post',
    data: data
  })
}



//********************************************
// 查询生产管理详细
export function getPlan(planId) {
  return request({
    url: '/erp/plan/' + planId,
    method: 'get'
  })
}
// 开始生产
export function beganProduce(planId) {
  return request({
    url: '/erp/plan/beganProduce/' + planId,
    method: 'get'
  })
}

// 新增生产管理
export function getInventoryByBom(bomId) {
  return request({
    url: '/erp/plan/getInventoryByBom/' + bomId,
    method: 'get',
  })
}

// 修改生产管理
export function updatePlan(data) {
  return request({
    url: '/erp/plan',
    method: 'put',
    data: data
  })
}

// 删除生产管理
export function delPlan(planId) {
  return request({
    url: '/erp/plan/' + planId,
    method: 'delete'
  })
}
