import request from '@/utils/request'

// 查询库位管理列表
export function listPosition(query) {
  return request({
    url: '/erp/position/list',
    method: 'get',
    params: query
  })
}

// 查询库位管理详细
export function getPosition(stockPositionId) {
  return request({
    url: '/erp/position/' + stockPositionId,
    method: 'get'
  })
}

// 查询仓库下的库位list
export function getWarehousePosition(data) {
  return request({
    url: '/erp/position/warehousePositionTree',
    method: 'post',
    data: data
  })
}
// 根据商品和库位查询下的商品+批次list
export function getProductBatchNumberList(data) {
  return request({
    url: '/erp/position/getProductBatchNumberList',
    method: 'post',
    data: data
  })
}


// 查询仓库管理1详细
export function getWarehouse(warehouseId) {
  return request({
    url: '/erp/warehouse/' + warehouseId,
    method: 'get'
  })
}

// 新增库位管理
export function addPosition(data) {
  return request({
    url: '/erp/position',
    method: 'post',
    data: data
  })
}

// 修改库位管理
export function updatePosition(data) {
  return request({
    url: '/erp/position',
    method: 'put',
    data: data
  })
}

// 删除库位管理
export function delPosition(stockPositionId) {
  return request({
    url: '/erp/position/' + stockPositionId,
    method: 'delete'
  })
}

// 查询仓库下拉树结构
export function warehouseTreeSelect() {
  return request({
    url: '/erp/position/warehouseTree',
    method: 'get'
  })
}

// 查询仓库下拉树结构
export function warehouseParentTreeSelect() {
  return request({
    url: '/erp/position/warehouseParentTree',
    method: 'get'
  })
}