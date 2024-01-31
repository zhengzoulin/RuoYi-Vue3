import request from '@/utils/request'

// 查询销售订单管理列表
export function listSales(query) {
  return request({
    url: '/erp/sales/list',
    method: 'get',
    params: query
  })
}

// 查询销售订单管理详细
export function getSales(salesOrderId) {
  return request({
    url: '/erp/sales/' + salesOrderId,
    method: 'get'
  })
}

// 新增销售订单管理
export function addSales(data) {
  return request({
    url: '/erp/sales',
    method: 'post',
    data: data
  })
}
// 查看库存
export function getInventoryBySales(data) {
  return request({
    url: '/erp/sales/getInventory',
    method: 'post',
    data: data
  })
}

// 查询订单审核记录
export function getSalesAuditRecord(salesOrderId) {
  return request({
    url: '/erp/sales/getSalesAuditRecord/' + salesOrderId,
    method: 'get'
  })
}
// 订单审核提交
export function addSalesAudit(data) {
  return request({
    url: '/erp/sales/addSalesAudit',
    method: 'post',
    data: data
  })
}
// 修改销售订单管理
export function updateSales(data) {
  return request({
    url: '/erp/sales',
    method: 'put',
    data: data
  })
}

// 删除销售订单管理
export function delSales(salesOrderId) {
  return request({
    url: '/erp/sales/' + salesOrderId,
    method: 'delete'
  })
}


// 参数：商品list  返回：采购订单列表和生产计划列表
export function getPurchaseAndPlanBySalesProducts(data) {
  return request({
    url: '/erp/sales/getPurchaseAndPlanBySalesProducts',
    method: 'post',
    data: data
  })
}
//生成采购需求和生成计划
export function createPurchaseOrPlan(data) {
  return request({
    url: '/erp/sales/createPurchaseOrPlan',
    method: 'post',
    data: data
  })
}
