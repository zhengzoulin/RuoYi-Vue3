import request from '@/utils/request'

// 查询批次列表
export function listBatch(query) {
  return request({
    url: '/erp/batch/list',
    method: 'get',
    params: query
  })
}

// 查询批次维度列表
export function listBatchLevel(query) {
  return request({
    url: '/erp/batch/listBatch',
    method: 'get',
    params: query
  })
}

// 查询商品维度批次列表
export function listProductBatch(query) {
  return request({
    url: '/erp/batch/listProductBatch',
    method: 'get',
    params: query
  })
}
// 查询批次列表
export function listProductLevel(query) {
  return request({
    url: '/erp/batch/listProduct',
    method: 'get',
    params: query
  })
}

// 查询批次详细
export function getBatch(batchId) {
  return request({
    url: '/erp/batch/' + batchId,
    method: 'get'
  })
}

// 新增批次
export function addBatch(data) {
  return request({
    url: '/erp/batch',
    method: 'post',
    data: data
  })
}

// 修改批次
export function updateBatch(data) {
  return request({
    url: '/erp/batch',
    method: 'put',
    data: data
  })
}

// 删除批次
export function delBatch(batchId) {
  return request({
    url: '/erp/batch/' + batchId,
    method: 'delete'
  })
}
