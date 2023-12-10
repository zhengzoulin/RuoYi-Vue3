import request from '@/utils/request'

// 查询往来单位列表
export function listUnit(query) {
  return request({
    url: '/erp/unit/list',
    method: 'get',
    params: query
  })
}

// 查询往来单位详细
export function getUnit(unitId) {
  return request({
    url: '/erp/unit/' + unitId,
    method: 'get'
  })
}

// 新增往来单位
export function addUnit(data) {
  return request({
    url: '/erp/unit',
    method: 'post',
    data: data
  })
}

// 修改往来单位
export function updateUnit(data) {
  return request({
    url: '/erp/unit',
    method: 'put',
    data: data
  })
}

// 删除往来单位
export function delUnit(unitId) {
  return request({
    url: '/erp/unit/' + unitId,
    method: 'delete'
  })
}
