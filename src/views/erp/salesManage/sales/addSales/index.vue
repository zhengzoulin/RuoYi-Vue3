<template>

  <div class="app-container">
    <el-row class="header">
      <router-link to="/salesManage/sales">
        <el-button type="primary"     icon="Back"
                   plain style=" color: #fff;background-color: #909399;
                                  border-color: #909399; font-size: 12px;padding-left: 18px">
          <span>返回</span>
        </el-button>
      </router-link>
      <div>
        <span style="color: #1c84c6;font-size: 28px"> {{ displayTitleText }}</span>
      </div>
      <div>
        <el-col :span="24" style="position: absolute; top: 0; right: 105px; width: auto;">
          <el-button type="primary" plain  icon="primary" @click="subMitAddStockAndAuditPass">保存并审核通过</el-button>
        </el-col>
        <el-col :span="24"    style="position: absolute; top: 0; right: 20px; width: auto;">
          <el-button type="primary" plain icon="primary" @click="submitForm">保存</el-button>
        </el-col>
      </div>
    </el-row>
    <div >
      <el-row>
             <span > 销售订单基本信息
        <el-button link type="primary" icon="list" @click="orderDetailFormShow = !orderDetailFormShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
      </el-row>
      <el-form ref="orderRef" v-show="orderDetailFormShow"  :model="form" :rules="rules" :inline="true" label-width="80px"
               style="border-top: dashed 1.3px rgba(187,199,191,0.35) ;padding: 8px">
        <el-row>
          <el-form-item label="订单编号" prop="salesOrderCode" class="select-container" >
            <el-input v-model="form.salesOrderCode" placeholder="保存后自动生成" class="readonly-tree-select" style="width: 180px;"/>
          </el-form-item>
          <el-form-item label="下单日期" prop="createTime" class="select-container">
            <el-input v-model="form.createTime" placeholder="" class="readonly-tree-select"  style="width: 180px;"/>
          </el-form-item>

          <el-form-item label="出货仓库" prop="warehouseName" class="select-container">
            <el-tree-select
                v-model="form.warehouseId"
                :data="warehouseOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                placeholder="请选择仓库"
                class="readonly-tree-select"
                style="width: 160px;"
            />
          </el-form-item>
          <el-form-item label="客户" prop="unitName">
            <el-select v-model="form.unitId"  placeholder="请选择">
              <el-option
                  v-for="item in unitOptions"
                  :key="item.unitId"
                  :label="item.unitName"
                  :value="item.unitId"
                  :disabled="item.status == 1"
                  style="width: 140px;"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="交货日期" prop="salesOrderTime">
            <el-date-picker clearable
                            v-model="form.salesOrderTime"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择订单交货日期"
                            style="width: 180px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="单据名称" prop="salesOrderName">
            <el-input v-model="form.salesOrderName" placeholder="请输入单据名称" style="width: 180px;" />
          </el-form-item>


          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="text" placeholder="请输入" style="width: 180px;"/>
          </el-form-item>
        </el-row>
      </el-form>

      <el-row style="margin-top: 10px">
        <span > 采购订单商品信息 </span>
      </el-row>

      <el-row :gutter="4" class="mb8" style="border-top: dashed 1.3px rgba(187,199,191,0.35) ; padding: 8px">
        <el-col :span="1.2">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAddProduct"
              v-hasPermi="['erp:order:add']"
          >添加商品</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button
              type="primary"
              plain
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['erp:order:edit']"
          >导入历史订单</el-button>
        </el-col>

        <el-col :span="1.2">
          <el-button
              type="primary"
              plain
              @click="handleExport"
              v-hasPermi="['erp:order:export']"
          >Excel导入</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button
              type="danger"
              plain
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['erp:order:remove']"
          >删除</el-button>
        </el-col>



        <!--        <right-toolbar >dsf</right-toolbar>-->
      </el-row>

      <span >出售种数：{{form.saleProductsList.length}}</span>
      <span style="margin-left: 20px">订单总额：{{getPurchaseAllAmount()}}</span>


      <el-table v-loading="loading"
                :data="form.saleProductsList"
                height="450"
                :row-style="{ height: '140px'}"
                @cell-click="tabClick"
                style="font-size: 14px">

        <el-table-column type="selection" width="55"  align="center" />
        <el-table-column type="index" width="30" align="center"/>



        <el-table-column label="商品编号" width="110" align="center" prop="productCode" >
          <template #default="scope">
          <span class="readonly-column-select">
              {{ scope.row.productCode}}
          </span>
          </template>
        </el-table-column>


        <el-table-column label="商品信息" width="110" align="center"  >
          <template #default="scope" >
            <span style="display: block;font-weight: bold;" class="readonly-column-select">{{ scope.row.productName }}</span>
            <span style="display: block;">目录:{{ scope.row.catalog.catalogName }}</span>
            <span style="display: block;">规格:{{ scope.row.encapStandard }}</span>
            <span style="display: block;">型号:{{ scope.row.productModel }}</span>
            <span style="display: block;">包装数量:{{ scope.row.minpacketNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品在库库存" width="110" align="center" prop="balanceNumber" >
          <template #default="scope">
          <span class="readonly-column-select" >
              {{ scope.row.balanceNumber}}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="占用库存" align="center" prop="occupiedNumber" >
          <template #default="scope">
          <span >
              {{ scope.row.occupiedNumber}}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="可用库存"  align="center" prop="availableNumber" >
          <template #default="scope">
          <span>
              {{ scope.row.availableNumber}}
          </span>
          </template>
        </el-table-column>


        <el-table-column label="出售数量" prop="saleNumber" >
          <template #default="scope">
            <span>
              <el-input v-model="scope.row.saleNumber"  type="number" maxlength="26" placeholder="请输入需求" size="mini"  />
            </span>
          </template>
        </el-table-column>

        <el-table-column label="单价" align="center" prop="salePrice" >
          <template #default="scope">
            <span>
              <el-input v-model="scope.row.salePrice"  type="number" maxlength="26" placeholder="请输入" size="mini"  />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="amountPrice"  >
          <template #default="scope">
            <span>
              <span >{{ scope.row.amountPrice ? scope.row.amountPrice : '0.00' }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark">
          <template #default="scope">
            <span>
              <el-input v-model="scope.row.remark" type="text" maxlength="50" placeholder="备注" size="mini"  />
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="list" @click="handleDetail(scope.row)" v-hasPermi="['erp:product:edit']">详细</el-button>
            <el-button link type="danger" icon="delete" @click="removeRow(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>




    <el-dialog :title="title" v-model="openWarehouse" width="500px" append-to-body>
      <el-form-item label="选择出货仓库" prop="warehouseName">
        <el-tree-select
            v-model="form.warehouseId"
            :data="warehouseOptions"
            :props="{ value: 'id', label: 'label', children: 'children' }"
            value-key="id"
            placeholder="请选择仓库"
            @change="handleChange"
        />
      </el-form-item>
      <el-button type="primary" @click="nextStep">确 定</el-button>
    </el-dialog>

    <!--  商品选择框-->
    <el-dialog :title="title" v-model="openProduct" width="950px"  append-to-body >
      <!-- 查看商品详细对话框 -->
      <el-button style="margin-right: 10px" @click="submitProductList">确 定</el-button>
      <!--      //第二步:定义form表单-->
      <ProductTable  :productList="productList"
                     :productRows="productRows"
                     @queryProduct="childProductQuery"
                     @getSelectProduct="getChildProductList"
                     @getProductDetail="getChildProductDetail"
      >

      </ProductTable>

    </el-dialog>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {AddStockList, updateAddStock} from "../../../../../api/erp/addStock";
import {warehouseParentTreeSelect} from "../../../../../api/erp/position";
import {listUnit} from "../../../../../api/erp/unit";
import {getProduct, listProduct} from "../../../../../api/erp/product";
import {addOrder, getOrder, updateOrder} from "../../../../../api/erp/order";
import {catalogTreeSelect} from "../../../../../api/erp/catalog";
import {getBom} from "../../../../../api/erp/bom";
import ProductTable from "../../../../../components/zerp/table/productTable";
import {addSales, getInventoryBySales, getSales, updateSales} from "../../../../../api/erp/sales";

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const total = ref(0);
const title = ref("");
const loading = ref(true);
const openWarehouse = ref(false);
const openProduct = ref(false);
const orderDetailFormShow = ref(true);
 const openProductDetail = ref(false);

const ids = ref([]);
const productList = ref([]);
const productRows = ref([]);

const warehouseOptions = ref([]);
const unitOptions = ref([]);
const catalogOptions = ref(undefined);

const data = reactive({
  form: ref({
    createTime: "",
    saleProductsList: ref([]),

  }),

  productForm:{},

  queryParams: {
    pageNum: 1,
    pageSize: 10,
    salesOrderCode: null,
    salesOrderName: null,
    salesProducts: null,
    unit: null,
    warehouseId: null,
    warehouse: null,
    salesOrderTime: null,
    auditId: null,
    orderProgress: null,
    salesTotalAmount: null,
    currentReceiptAmount: null,
    receiptStatus: null,
    status: null,
  },
  queryProductParams: {
    pageNum: 1,
    pageSize: 10,
    brandId: null,
    productId: null,
    catalogId: null,
    productCode: null,
    productName: null,
    productSource: null,
    productAddOrigin: null,
    status: null,
    statusValue: false
  },
  rules: {
    purchaseOrderName: [
      { required: true, message: "单据名称不能为空", trigger: "blur" }
    ],
    productId: [
      { required: true, message: "商品id不能为空", trigger: "blur" }
    ],
    unitId: [
      { required: true, message: "供应商id不能为空", trigger: "blur" }
    ],
    warehouseId: [
      { required: true, message: "所属仓库不能为空", trigger: "blur" }
    ],
    auditId: [
      { required: true, message: "订单审核状态id不能为空", trigger: "blur" }
    ],
    saleNumber: [
      { required: true, message: "需求数量不能为空", trigger: "blur" }
    ],
    paymentId: [
      { required: true, message: "订单支付状态id不能为空", trigger: "blur" }
    ],
    orderProgress: [
      { required: true, message: "订单进度不能为空", trigger: "blur" }
    ],
    salesTotalAmount: [
      { required: true, message: "采购订单总金额不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules ,productForm,queryProductParams} = toRefs(data);

const displayTitleText = computed(() => {
  if (salesOrderId.value == null) {
    return '新增销售订单';
  } else {
    return '修改销售订单';
  }
});

//提交入库单到后端
function subMitAddStockList(){

  console.log("id是：")

  if (form.value.addStockId == null) {

  }else {

  }
  router.push("/outAddManage/addStock");
}
/** 查询仓库下拉树结构 */
function getWarehouseTree() {
  warehouseParentTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};

/** 查询往来单位列表 */
function getUnitList() {
  listUnit().then(response => {
    unitOptions.value = response.rows;
  });
}
/** 新增选择商品按钮操作 */
function handleAddProduct() {
  getProductList();
  openProduct.value = true;
  title.value = "添加采购需求";
  loading.value = false
}
/** 查询商品列表 */
function getProductList() {
  loading.value = true;
  listProduct(queryProductParams.value).then(response => {

    productList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 采购提交按钮 */
function submitForm() {


  console.log(form.value)
  proxy.$refs["orderRef"].validate(valid => {
    if (valid) {
      if (form.value.salesOrderId != null) {
        updateSales(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
        });
      } else {
        addSales(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
        });
      }
    }
  });

  router.push('/salesManage/sales')
}
// tabClick row 当前行 column 当前列
function tabClick (row, column, cell, event) {
  switch (column.label) {
    case '顺序':
      tabClickIndex.value = row.index
      tabClickLabel.value = column.label
      break
    default: return
  }
  console.log('tabClick', this.tabClickIndex, row.saleNumber)
}

/** 查看详细按钮操作 */
function handleDetail(row) {
  getCatalogTree();

  const _productId = row.productId || ids.value
  getProduct(_productId).then(response => {
    productForm.value = response.data;
    openProductDetail.value = true;
    title.value = "商品详情";
  });
}
//确定要移除这一行
const removeRow = (row) => {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    const index = form.value.saleProductsList.findIndex(item => item.productId === row.productId);
    if (index !== -1) {
      form.value.saleProductsList.splice(index, 1);
      alert('成功移除该行');
    } else {
      alert('未找到对应行');
    }
  } else {
    alert('已取消移除');
  }
};
//将
function submitProductList(){
  // productRows.value = [];
  openProduct.value=false;
  console.log("哈哈哈哈")


  productRows.value.forEach(row=>{
    // form.value.saleProductsList.push(row)
    if (row && !form.value.saleProductsList.some(item => item.productId === row.productId)) {
      alert(row.productName)
      form.value.saleProductsList.push(row);
    }
  })


  getInventoryBySales(form.value).then(response=>{
    form.value.saleProductsList = response.data;
    console.log(form.value.saleProductsList)
  })

 }
/** 商品搜索按钮操作 */
function handleProductQuery() {
  queryProductParams.value.pageNum = 1;
  getProductList();
}
/** 查询目录下拉树结构 */
function getCatalogTree() {
  catalogTreeSelect().then(response => {
    catalogOptions.value = response.data;
  });
};

/** 新增采购订单按钮操作，第二步开始选择订单 */
function nextStep() {
  openWarehouse.value = false;
  getCurrentDate();
  getUnitList()
  loading.value= false
  title.value = "新增采购订单";
}

//采购总额
function getPurchaseAllAmount(){
  let price = 0
  form.value.saleProductsList.forEach(row=>{

    row.amountPrice = (row.salePrice * row.saleNumber || 0).toFixed(3);
    
    price += parseFloat(row.amountPrice) || 0;
    form.value.salesTotalAmount = price;
  })
  if(price < 0 || price == null){
    price = 0
  }

  return price;
}
//获取订单生成时间
function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  form.value.createTime = `${year}-${month}-${day}`;
}
//父子件方法********************************************



function childProductQuery(data){
  queryProductParams.value = data
  handleProductQuery();
}

function getChildProductDetail(data){
  getCatalogTree();
  const _productId = data.productId
  getProduct(_productId).then(response => {
    productForm.value = response.data;
    openProductDetail.value = true;
    title.value = "商品详情";
  });
}
function getChildProductList(data){
  openProduct.value=false;
  form.value.saleProductsList = data
}

//******************************************************
function getOrderDetail(){
  getOrder(salesOrderId.value).then(response => {
    form.value = response.data;
    form.value.saleProductsList =response.data.productList;
    console.log(form.value.saleProductsList)
    title.value = "修改bom物料";
  });
}
// 接收参数
const isShowP = ref()
const salesOrderId = ref(route.query.salesOrderId ? route.query.salesOrderId : null);


function addOrUpdate() {
  getCurrentDate();
  console.log(salesOrderId.value);

  if (salesOrderId.value === null ) {
    alert("新增")

    openWarehouse.value = true;
    isShowP.value = null; // 或者适当的默认值

  } else if (salesOrderId.value !== null ) {
    alert("修改")

    isShowP.value = salesOrderId.value;
    openWarehouse.value = false;
    loading.value = false;
     getSales(salesOrderId.value).then(response => {
      form.value = response.data;
       form.value.saleProductsList = response.data.saleProductsList;
       form.value.unitId = response.data.unit
      });

  }
}


addOrUpdate()
getWarehouseTree()
getUnitList();
</script>

<style scoped>

.header {
  justify-content: space-between;
  margin-bottom: 10px;
  padding-right: 2%;
}
.select-container {
  position: relative;
}

/* 添加蒙版效果 */
.readonly-tree-select {
  pointer-events: none;
}

/* 给蒙版添加样式 */
.readonly-tree-select::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(176,196,222, 0.2); /* 淡灰色 */
}

/* 给蒙版添加样式 */
.readonly-column-select::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(219,238,242,0.3); /* 淡灰色 */
}

.dialog-addOrder{
  /*height: 90%;*/
  /*max-width: calc(100% - 300px);*/
}

.dialog-OrderDetail{
  width: 85% ;
  /*height: 90%;*/
  margin-left: 200px;
  /*max-width: calc(100% - 300px);*/
}

.form-with-border{
  border: 1px solid #ccc; /* 添加边线样式 */
  padding: 20px; /* 可选：增加一些内边距 */
}

.box-item{
  height: 100px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}


.el-dropdown-order{
  margin-right: 10px;
  display: flex;
}
.el-table{

}

</style>

