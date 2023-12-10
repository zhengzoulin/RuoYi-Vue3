import request from '@/utils/request'

// 查询商品目录列表
export function listCatalog(query) {
  return request({
    url: '/erp/catalog/list',
    method: 'get',
    params: query
  })
}

// 查询商品目录详细
export function getCatalog(catalogId) {
  return request({
    url: '/erp/catalog/' + catalogId,
    method: 'get'
  })
}

// 新增商品目录
export function addCatalog(data) {
  return request({
    url: '/erp/catalog',
    method: 'post',
    data: data
  })
}

// 修改商品目录
export function updateCatalog(data) {
  return request({
    url: '/erp/catalog',
    method: 'put',
    data: data
  })
}

// 删除商品目录
export function delCatalog(catalogId) {
  return request({
    url: '/erp/catalog/' + catalogId,
    method: 'delete'
  })
}


// 查询目录下拉树结构
export function catalogTreeSelect() {
  return request({
    url: '/erp/catalog/catalogTree',
    method: 'get'
  })
}

