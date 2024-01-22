import request from '@/utils/request'

// 查询生产管理列表
export function listPlan(query) {
  return request({
    url: '/erp/plan/list',
    method: 'get',
    params: query
  })
}

// 查询生产管理详细
export function getPlan(planId) {
  return request({
    url: '/erp/plan/' + planId,
    method: 'get'
  })
}
// 开始生产
export function beganProduce(planId) {
  return request({
    url: '/erp/plan/beganProduce/' + planId,
    method: 'get'
  })
}

// 新增生产管理
export function getInventoryByBom(bomId) {
  return request({
    url: '/erp/plan/getInventoryByBom/' + bomId,
    method: 'get',
  })
}
// 新增生产管理
export function addPlan(data) {
  return request({
    url: '/erp/plan',
    method: 'post',
    data: data
  })
}

// 修改生产管理
export function updatePlan(data) {
  return request({
    url: '/erp/plan',
    method: 'put',
    data: data
  })
}

// 删除生产管理
export function delPlan(planId) {
  return request({
    url: '/erp/plan/' + planId,
    method: 'delete'
  })
}
