<template>
  <div class="app-container">
    <el-row :gutter="15">
<!--目录树-->
      <!--部门数据-->
      <el-col :span="3" :xs="24">
        <div class="head-container">
          <el-input
              v-model="catalogName"
              placeholder="请输入目录名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
              :data="catalogOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="catalogTreeRef"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>



<!--      商品列表-->
      <el-col :span="21" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="商品编号" prop="productCode">
            <el-input
                v-model="queryParams.productCode"
                placeholder="请输入商品编号"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品名称" prop="productName">
            <el-input
                v-model="queryParams.productName"
                placeholder="请输入商品名称"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品来源" prop="productSource">
            <el-input
                v-model="queryParams.productSource"
                placeholder="请输入商品来源"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleAdd"
                v-hasPermi="['erp:product:add']"
            >查看出入库信息</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="warning"
                plain
                icon="Download"
                @click="handleExport"
                v-hasPermi="['erp:product:export']"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="success"
                plain
                icon="Edit"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['erp:product:edit']"
            >调整库位信息</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['erp:product:remove']"
            >自动补货</el-button>
          </el-col>

          <right-toolbar v-model:showSearch="showSearch" @queryTable="getInventoryList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="商品编号" align="center" prop="productCode" />
          <el-table-column label="商品来源" align="center" prop="productVO.productAddOrigin" />
          <el-table-column label="商品信息" align="center">
            <template #default="scope">
              <span style="display: block;">商品:{{ scope.row.productVO.productName }}</span>
              <span style="display: block;">封装规格:{{ scope.row.productVO.encapStandard }}</span>
              <span style="display: block;">厂家型号:{{ scope.row.productVO.productModel }}</span>

              <span style="display: block;">最小包装数量:{{ scope.row.productVO.minpacketNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品图片" prop="productImage" align="center" >
            <template  #default="scope" width="100">
              <ImagePreview style="width:70px;height:60px;" :src="scope.row.productVO.productImage" />
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" />

          <el-table-column label="成本价" align="center" prop="costPrice" />
          <el-table-column label="库存上限" align="center" prop="productWeight" />
          <el-table-column label="库存下限" align="center" prop="encapStandard" />
<!--          <el-table-column label="成本价" align="center" prop="costPrice" />-->
<!--          <el-table-column label="售价" align="center" prop="salePrice" />-->
          <el-table-column label="在库库存数量" align="center" prop="balanceNumber">
            <template  #default="scope" width="100">
              <button @click="showPositionDetail(scope.row)" class="positionButton">
                <span>{{scope.row.balanceNumber}}</span>
              </button>
            </template>
          </el-table-column>
          <el-table-column label="批次信息" align="center" prop="batchNumber">
            <template  #default="scope" width="100">
              <button @click="showPositionDetail(scope.row)" class="positionButton">
                <span>{{scope.row.batchNumber}}</span>
              </button>
            </template>
          </el-table-column>
          <el-table-column label="库位信息" align="center" prop="stockPositionVOList.length">
            <template  #default="scope" width="100">
              <button @click="showPositionDetail(scope.row)" class="positionButton">
                <span>{{scope.row.stockPositionVOList.length}}</span>
              </button>
            </template>
          </el-table-column>

        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getInventoryList"
        />
      </el-col>
    </el-row>



    <el-dialog
        title="库位明细" v-model="openProductPosition"
        append-to-body class="dialog-selectOrder"
        :style="{ 'max-height': '50vh' }"
    >

      <table :data="form.productVO" class="top-title" hight="350px" style="border: 1px solid rgb(230, 235, 245);">
        <tr >
          <td  class="tex" >
            <div  class="dis">
              商品编号：
              <div   tabindex="0" class="tex-color">{{ form.productVO.productCode}}</div>
            </div>
          </td>
          <td  class="tex">
            <div  class="dis">
              商品名称：
              <div   tabindex="0" class="tex-color">{{ form.productVO.productName}}</div>
            </div>
          </td>
          <td  class="tex">
            <div  class="dis">
              厂家型号：
              <div   tabindex="0" class="tex-color">{{ form.productVO.productModel }} </div>
            </div>
          </td>
          <td  class="tex">
            <div  class="dis">
              封装规格：
              <div   tabindex="0" class="tex-color">{{ form.productVO.encapStandard }}</div></div></td>
          <td  class="tex">
            <div  class="dis">
              封装单位：
              <div  tabindex="0" class="tex-color">{{ form.productVO.minpacketUnit}}</div></div></td>
        </tr></table>


      <el-form
          :style="{ 'max-height': '60vh' }"
      >

        <el-table
            :data="form.stockPositionVOList"
            height="250px"
            style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
            :span-method="objectSpanMethod"
            class="el-table__header"
        >
          <el-table-column label="父仓名称" align="center" prop="warehouseParent" />
          <el-table-column label="子仓名称" align="center" prop="warehousePath" />
          <el-table-column label="库位名称" align="center" prop="stockPositionName" />
          <el-table-column label="库存数量" align="center" prop="stockQuantity" >
          </el-table-column>


        </el-table>


      </el-form>



    </el-dialog>

  </div>
</template>

<script setup name="Product">
import { listInventory, getProduct, delProduct, addProduct, updateProduct } from "@/api/erp/inventoryList";
import {ref} from "vue";
import {catalogTreeSelect} from "../../../../api/erp/catalog";
import {addBrand, listBrand} from "../../../../api/erp/brand";

const { proxy } = getCurrentInstance();

const productList = ref([]);
const brandList = ref([]);
const catalogOptions = ref(undefined);
const catalogName = ref("");
const open = ref(false);
const openProductPosition = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {
    productVO: ref({}),
    stockPositionVOList: ref([])

  },
  brandForm: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    brandId: null,
    catalogId: null,
    productCode: null,
    productName: null,
    productSource: null,
    productAddOrigin: null,
    status: null,
    statusValue: false
  },
  rules: {
    catalogId: [
      { required: true, message: "目录id不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form,brandForm, rules } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(catalogName, val => {
  proxy.$refs["catalogTreeRef"].filter(val);
});
/** 查询目录下拉树结构 */
function getCatalogTree() {
  catalogTreeSelect().then(response => {
    catalogOptions.value = response.data;
  });
};
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.catalogId = data.id;
  handleQuery();
};

function getBrandClick(){
  title.value = "选择商品品牌"
  openBrand.value=true;
  getBrandList();
}
function handleBrand(row){
  form.value.brandId = row.brandId;
  form.value.brandName = row.brandName;

  openBrand.value=false;
}

function formatStatus(status) {
  if (status === '0') {
    return '已启用'
  } else if (status === '1') {
    return '已停用'
  } else {
    return '错误状态'
  }
}

/** 查询商品库存列表 */
function getInventoryList() {
  loading.value = true;
  listInventory(queryParams.value).then(response => {
    productList.value = response.rows;
    form
    total.value = response.total;
    loading.value = false;
  });
}


/** 查询品牌列表列表 */
function getBrandList() {
  loading.value = true;
  listBrand(queryParams.value).then(response => {
    brandList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}



// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 品牌新增取消按钮
function cancelAddBrand() {
  openAddBrand.value = false;
  brandReset();
}

// 表单重置
function reset() {
  form.value = {
    productId: null,
    brandId: null,
    brandName:null,
    remark: null
  };
  proxy.resetForm("productRef");
}



/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getInventoryList();
}

/** 搜索按钮操作 */
function handleBrandQuery() {
  queryParams.value.pageNum = 1;
  getBrandList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 品牌重置按钮操作 */
function resetBrandQuery() {
  proxy.resetForm("brandRef");
  handleBrandQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.productId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  brandReset();
  open.value = true;
  title.value = "添加商品列表";
}
/** 新增品牌按钮操作 */
function handleAddBrand() {
  brandReset();
  openAddBrand.value = true;
  title.value = "添加商品列表";
}

/** 查看详细按钮操作 */
function handleDetail(row) {
  reset();
  const _productId = row.productId || ids.value
  getProduct(_productId).then(response => {
    form.value = response.data;
    form.value.brandName = form.value.brand.brandName
    open.value = true;
    title.value = "修改商品列表";
  });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _productId = row.productId || ids.value
  getProduct(_productId).then(response => {
    form.value = response.data;
    form.value.brandName = form.value.brand.brandName
    open.value = true;
    title.value = "修改商品列表";
  });
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["productRef"].validate(valid => {
    if (valid) {
      if (form.value.productId != null) {
        updateProduct(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getInventoryList();
        });
      } else {
        addProduct(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getInventoryList();
        });
      }
    }
  });
}
/** 品牌新增提交按钮 */
function submitBrandForm() {
  proxy.$refs["brandRef"].validate(valid => {
    if (valid) {
        addBrand(brandForm.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          openAddBrand.value = false;
          getBrandList();
        });
      }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const _productIds = row.productId || ids.value;
  proxy.$modal.confirm('是否确认删除商品列表编号为"' + _productIds + '"的数据项？').then(function() {
    return delProduct(_productIds);
  }).then(() => {
    getInventoryList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/product/export', {
    ...queryParams.value
  }, `product_${new Date().getTime()}.xlsx`)
}

function showPositionDetail(row){
  openProductPosition.value = true;
  form.value.stockPositionVOList = row.stockPositionVOList;
  form.value.productVO = row.productVO
}






getInventoryList();
getCatalogTree();
</script>


<style>
.add-label{
  margin-left: 30px;
  margin-right: 20px;
  margin-top: 5px;
}

.top-title{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  border: 1px solid #ebeef5;
  padding: 4px 4px;
  margin-bottom: 4px;
  background-color: rgba(176,196,222, 0.2); /* 淡灰色 */

}


.dis{
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 6px;
  margin: 0 16px;
}
.tex-color{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 1000;
}
.tex{
  margin: 5px;
}
.el-table__header{
  table-layout: fixed;
  border-collapse: separate;
}
.positionButton{
  background-color: transparent;
  border: none;
  box-shadow: none;
  cursor: pointer;
}
.positionButton span {
  color: skyblue;
}
.dialog-selectOrder{
  /*width: 85% ;*/
  /*!*height: 90%;*!*/
  margin-top: 80px;
  height: 70%;
  width: 48%;
  /*max-width: calc(100% - 300px);*/
}
</style>