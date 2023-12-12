import request from '@/utils/request'

// 查询采购订单列表
export function listOrder(query) {
  return request({
    url: '/erp/order/list',
    method: 'get',
    params: query
  })
}

// 查询采购订单详细
export function getOrder(purchaseOrderId) {
  return request({
    url: '/erp/order/' + purchaseOrderId,
    method: 'get'
  })
}

// 新增采购订单
export function addOrder(data) {
  return request({
    url: '/erp/order',
    method: 'post',
    data: data
  })
}

// 修改采购订单
export function updateOrder(data) {
  return request({
    url: '/erp/order',
    method: 'put',
    data: data
  })
}

// 删除采购订单
export function delOrder(purchaseOrderId) {
  return request({
    url: '/erp/order/' + purchaseOrderId,
    method: 'delete'
  })
}
