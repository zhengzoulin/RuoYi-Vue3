import request from '@/utils/request'

// 查询入库批次列表
export function listBatch(query) {
  return request({
    url: '/erp/batch/list',
    method: 'get',
    params: query
  })
}

// 查询入库批次详细
export function getBatch(batchId) {
  return request({
    url: '/erp/batch/' + batchId,
    method: 'get'
  })
}

// 新增入库批次
export function addBatch(data) {
  return request({
    url: '/erp/batch',
    method: 'post',
    data: data
  })
}

// 修改入库批次
export function updateBatch(data) {
  return request({
    url: '/erp/batch',
    method: 'put',
    data: data
  })
}

// 删除入库批次
export function delBatch(batchId) {
  return request({
    url: '/erp/batch/' + batchId,
    method: 'delete'
  })
}
