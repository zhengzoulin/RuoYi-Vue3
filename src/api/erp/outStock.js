import request from '@/utils/request'

// 查询入库表列表
export function listOutStock(query) {
  return request({
    url: '/erp/outStock/list',
    method: 'get',
    params: query
  })
}

// 查询入库表详细
export function getOutStock(outStockId) {
  return request({
    url: '/erp/outStock/' + outStockId,
    method: 'get'
  })
}

// 新增入库表
export function addOutStock(data) {
  return request({
    url: '/erp/outStock',
    method: 'post',
    data: data
  })
}
// 订单审核提交
export function addOutStockAudit(data) {
  return request({
    url: '/erp/outStock/addOutStockAudit',
    method: 'post',
    data: data
  })
}
// 新增入库表
export function OutStockList(data) {
  return request({
    url: '/erp/outStock',
    method: 'post',
    data: data
  })
}

// 修改入库表
export function updateOutStock(data) {
  return request({
    url: '/erp/outStock',
    method: 'put',
    data: data
  })
}
// 新增生产入库表
export function ProduceOutStockList(data) {
  return request({
    url: '/erp/outStock/produceOutStockList',
    method: 'post',
    data: data
  })
}
// 修改生产入库表
export function updateProduceOutStock(data) {
  return request({
    url: '/erp/outStock/updateProduceOutStock',
    method: 'post',
    data: data
  })
}

// 删除入库表
export function delOutStock(outStockId) {
  return request({
    url: '/erp/outStock/' + outStockId,
    method: 'delete'
  })
}
