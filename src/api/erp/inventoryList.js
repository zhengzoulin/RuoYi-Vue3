import request from '@/utils/request'

// 查询商品列表列表
export function listProduct(query) {
  return request({
    url: '/erp/product/list',
    method: 'get',
    params: query
  })
}

// 查询商品库存列表
export function listInventory(query) {
  return request({
    url: '/erp/inventory/inventoryList',
    method: 'get',
    params: query
  })
}

// 查询商品列表详细
export function getProduct(productId) {
  return request({
    url: '/erp/product/' + productId,
    method: 'get'
  })
}

// 新增商品列表
export function addProduct(data) {
  return request({
    url: '/erp/product',
    method: 'post',
    data: data
  })
}

// 修改商品列表
export function updateProduct(data) {
  return request({
    url: '/erp/product',
    method: 'put',
    data: data
  })
}

// 删除商品列表
export function delProduct(productId) {
  return request({
    url: '/erp/product/' + productId,
    method: 'delete'
  })
}
