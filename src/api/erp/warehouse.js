import request from '@/utils/request'

// 查询仓库管理1列表
export function listWarehouse(query) {
  return request({
    url: '/erp/warehouse/list',
    method: 'get',
    params: query
  })
}

// 查询仓库管理1详细
export function getWarehouse(warehouseId) {
  return request({
    url: '/erp/warehouse/' + warehouseId,
    method: 'get'
  })
}

// 新增仓库管理1
export function addWarehouse(data) {
  return request({
    url: '/erp/warehouse',
    method: 'post',
    data: data
  })
}

// 修改仓库管理1
export function updateWarehouse(data) {
  return request({
    url: '/erp/warehouse',
    method: 'put',
    data: data
  })
}

// 删除仓库管理1
export function delWarehouse(warehouseId) {
  return request({
    url: '/erp/warehouse/' + warehouseId,
    method: 'delete'
  })
}
