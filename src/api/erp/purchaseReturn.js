import request from '@/utils/request'

// 查询采购退货管理列表
export function listPurchaseReturn(query) {
  return request({
    url: '/erp/purchaseReturn/list',
    method: 'get',
    params: query
  })
}

// 查询采购退货管理详细
export function getPurchaseReturn(purchaseOrderReturnId) {
  return request({
    url: '/erp/purchaseReturn/' + purchaseOrderReturnId,
    method: 'get'
  })
}
// 订单审核提交
export function addOrderReturnAudit(data) {
  return request({
    url: '/erp/purchaseReturn/addOrderAudit',
    method: 'post',
    data: data
  })
}
// 查询采购退货,商品入库数量和可入库数量
export function getPurchaseReturnProducts(purchaseOrderId) {
  return request({
    url: '/erp/purchaseReturn/getPurchaseReturnProducts/' + purchaseOrderId,
    method: 'get'
  })
}

// 新增采购退货管理
export function addPurchaseReturn(data) {
  return request({
    url: '/erp/purchaseReturn',
    method: 'post',
    data: data
  })
}

// 修改采购退货管理
export function updatePurchaseReturn(data) {
  return request({
    url: '/erp/purchaseReturn',
    method: 'put',
    data: data
  })
}

// 删除采购退货管理
export function delPurchaseReturn(purchaseOrderReturnId) {
  return request({
    url: '/erp/purchaseReturn/' + purchaseOrderReturnId,
    method: 'delete'
  })
}
