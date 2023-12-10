import request from '@/utils/request'

// 查询采购需求列表
export function listDemand(query) {
  return request({
    url: '/erp/demand/list',
    method: 'get',
    params: query
  })
}

// 查询采购需求详细
export function getDemand(demandId) {
  return request({
    url: '/erp/demand/' + demandId,
    method: 'get'
  })
}

// 新增采购需求
export function addDemand(data) {
  return request({
    url: '/erp/demand',
    method: 'post',
    data: data
  })
}

// 修改采购需求
export function updateDemand(data) {
  return request({
    url: '/erp/demand',
    method: 'put',
    data: data
  })
}

// 删除采购需求
export function delDemand(demandId) {
  return request({
    url: '/erp/demand/' + demandId,
    method: 'delete'
  })
}
