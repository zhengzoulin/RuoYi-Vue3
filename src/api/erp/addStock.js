import request from '@/utils/request'

// 查询入库表列表
export function listAddStock(query) {
  return request({
    url: '/erp/addStock/list',
    method: 'get',
    params: query
  })
}

// 查询入库表详细
export function getAddStock(addStockId) {
  return request({
    url: '/erp/addStock/' + addStockId,
    method: 'get'
  })
}

// 新增入库表
export function addAddStock(data) {
  return request({
    url: '/erp/addStock',
    method: 'post',
    data: data
  })
}
// 订单审核提交
export function addAddStockAudit(data) {
  return request({
    url: '/erp/addStock/addAddStockAudit',
    method: 'post',
    data: data
  })
}
// 新增入库表
export function AddStockList(data) {
  return request({
    url: '/erp/addStock',
    method: 'post',
    data: data
  })
}

// 修改入库表
export function updateAddStock(data) {
  return request({
    url: '/erp/addStock',
    method: 'put',
    data: data
  })
}

// 删除入库表
export function delAddStock(addStockId) {
  return request({
    url: '/erp/addStock/' + addStockId,
    method: 'delete'
  })
}
