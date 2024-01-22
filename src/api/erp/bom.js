import request from '@/utils/request'

// 查询bom物料列表
export function listBom(query) {
  return request({
    url: '/erp/bom/list',
    method: 'get',
    params: query
  })
}

// 查询bom物料详细
export function getBom(bomId) {
  return request({
    url: '/erp/bom/' + bomId,
    method: 'get'
  })
}

// 新增bom物料单
export function addBom(data) {
  return request({
    url: '/erp/bom',
    method: 'post',
    data: data
  })
}

// 修改bom物料
export function updateBom(data) {
  return request({
    url: '/erp/bom',
    method: 'put',
    data: data
  })
}

// 删除bom物料
export function delBom(bomId) {
  return request({
    url: '/erp/bom/' + bomId,
    method: 'delete'
  })
}

// 查询订单审核记录
export function getAuditRecord(purchaseOrderId) {
  return request({
    url: '/erp/order/getOrderAuditRecord/' + purchaseOrderId,
    method: 'get'
  })
}

// 新增审核管理
export function addAudit(data) {
  return request({
    url: '/erp/bom/addAudit',
    method: 'post',
    data: data
  })
}