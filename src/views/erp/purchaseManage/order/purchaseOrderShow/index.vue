<template>

  <div class="app-container">
    <el-row class="header">
      <router-link to="/purchaseManage/order">
        <el-button type="primary"     icon="Back"
                   plain style=" color: #fff;background-color: #909399;
                                  border-color: #909399; font-size: 12px;padding-left: 18px">
          <span>返回</span>
        </el-button>
      </router-link>
      <div style="margin-left: 38%">
        <span style="color: #1c84c6;font-size: 25px"> {{ displayTitleText }}</span>
      </div>

    </el-row>
    <el-row :gutter="10" class="mb8" style="border-top: dashed 1.3px rgba(187,199,191,0.35) ; padding: 8px">
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Edit"
            :disabled="isAudited"
            @click="handleOrderUpdate"
            v-hasPermi="['erp:order:add']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            :disabled="isAudited"
            @click="submitOrderAudit(1)"
            v-hasPermi="['erp:order:edit']"
        >审核通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="isAudited"
            @click="submitOrderAudit(2)"
            v-hasPermi="['erp:order:remove']"
        >审核不通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            plain
            type="primary"
            icon="Download"
            @click="handleExport"
            v-hasPermi="['erp:order:export']"
        >打印</el-button>
      </el-col>
    </el-row>
    <div >
      <el-row style="  margin-bottom: 20px !important;">
             <span > 采购订单基本信息
        <el-button link type="primary" icon="list" @click="orderDetailFormShow = !orderDetailFormShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
      </el-row>

        <el-descriptions  border="true" column="3" size="large"   class="my-descriptions" v-show="orderDetailFormShow" width="900px">
          <el-descriptions-item label="订单编号"  label-align="center">{{form.purchaseOrderCode}}</el-descriptions-item>
          <el-descriptions-item label="单据名称"  label-align="center">
            <span>{{form.purchaseOrderName}}</span>
            <el-button link type="primary"  @click="editOrderName"  icon="Edit" class="followButton"> </el-button>
           </el-descriptions-item>
          <el-descriptions-item label="供应商"  label-align="center">{{form.unit.unitName}}</el-descriptions-item>
          <el-descriptions-item label="下单时间"  label-align="center">{{form.createTime}}</el-descriptions-item>
          <el-descriptions-item label="交货日期"  label-align="center">{{form.purchaseOrderTime}}</el-descriptions-item>
          <el-descriptions-item label="目标仓库"  label-align="center">{{form.warehouse.warehousePath}}</el-descriptions-item>
          <el-descriptions-item label="入库单数"  label-align="center">{{form.demandProductsList.length}}</el-descriptions-item>
          <el-descriptions-item label="订单总金额"  label-align="center">{{form.purchaseAllAmount}}</el-descriptions-item>
          <el-descriptions-item label="创建人"  label-align="center">{{form.createBy}}</el-descriptions-item>
          <el-descriptions-item label="审核人"  label-align="center">{{form.createBy}}</el-descriptions-item>

          <el-descriptions-item label="备注"  label-align="center">{{form.remark}}</el-descriptions-item>

        </el-descriptions>


      <el-row>
        <span style="font-size: 16px"> 采购订单商品信息 </span>
      </el-row>


      <span >采购种数：{{form.demandProductsList.length}}</span>
      <span style="margin-left: 20px">采购总额：{{getPurchaseAllAmount()}}</span>

      <el-table v-loading="loading"
                :data="form.demandProductsList"
                height="450"
                @cell-click="tabClick">

        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="商品编号" align="center" prop="productCode">
          <template #default="scope">
          <span>
              {{ scope.row.productCode}}
          </span>
          </template>
        </el-table-column>

        <el-table-column label="商品信息" align="center" prop="productName" >
          <template #default="scope">
          <span>
              {{ scope.row.productName}}
          </span>
          </template>
        </el-table-column>

        <el-table-column label="商品图片" prop="productImage" align="center" >
          <template  #default="scope" width="90">
            <ImagePreview style="width:60px;height:60px;" :src="scope.row.productImage" />
          </template>
        </el-table-column>

        <el-table-column label="需求数量" prop="demandNumber" align="center" >
          <template #default="scope">
            <span>
              {{scope.row.demandNumber}}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="采购价" align="center" prop="costPrice" >
          <template #default="scope">
            <span>
             {{ scope.row.costPrice }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="orderMoney" class="select-container" align="center">
          <template #default="scope">
            <span>
              <span class="readonly-tree-select">{{ scope.row.orderMoney ? scope.row.orderMoney : '0.00' }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark">
          <template #default="scope">
            <span>
             {{scope.row.remark }}
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

    <el-dialog title="修改单据名称" v-model="editNameDialog" width="450px" style="margin-top: 15%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="单据名称" prop="newOrderName"   >
          <el-input v-model="newOrderName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="right">
        <el-button @click="editNameDialog = false" style="margin-right: 0px">取消</el-button>
        <el-button type="primary" @click="saveName">确定</el-button>
      </div>
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
import {addOrder, addOrderAudit, getOrder, updateOrder, updateOrderName} from "../../../../../api/erp/order";
import {catalogTreeSelect} from "../../../../../api/erp/catalog";
import {getBom} from "../../../../../api/erp/bom";
import ProductTable from "../../../../../components/zerp/table/productTable";

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
 const editNameDialog = ref(false)
 const isAudited = ref(false)

const ids = ref([]);
const productList = ref([]);
const productRows = ref([]);

const warehouseOptions = ref([]);
const unitOptions = ref([]);
const catalogOptions = ref(undefined);

const data = reactive({
  form: {
    unit:{
      unitName:''
    },
    warehouse:{
      warehousePath:''
    },
    createTime: "",
    demandProductsList: ref([]),
  },

  productForm:{},

  queryParams: {
    pageNum: 1,
    pageSize: 10,
    purchaseOrderCode: null,
    purchaseOrderName: null,
    productId: null,
    unitId: null,
    warehouseId: null,
    warehouseName: null,
    warehouse:{
      warehouseName: null,

    },
    userName:null,
    auditStatus:null,
    purchaseOrderTime: null,
    paymentStatus:null,
    auditId: null,
    paymentId: null,
    orderProgress: null,
    purchaseAllAmount: null,
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
    demandNumber: [
      { required: true, message: "需求数量不能为空", trigger: "blur" }
    ],
    paymentId: [
      { required: true, message: "订单支付状态id不能为空", trigger: "blur" }
    ],
    orderProgress: [
      { required: true, message: "订单进度不能为空", trigger: "blur" }
    ],
    purchaseAllAmount: [
      { required: true, message: "采购订单总金额不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules ,productForm,queryProductParams} = toRefs(data);



const displayTitleText = computed(() => {
  if (purchaseOrderId.value == null) {
    return '新增采购订单';
  } else {
    return '采购订单详情';
  }
});


const newOrderName = ref(null)
function editOrderName(){
  editNameDialog.value = true;
  // newOrderName.value =  form.value.purchaseOrderName
}
//修改名称
function saveName(){

  if(newOrderName.value === form.value.purchaseOrderName){
    editNameDialog.value = false
  }else{
    form.value.purchaseOrderName = newOrderName.value
    updateOrderName(form.value).then(response =>{
      proxy.$modal.msgSuccess("修改成功");
    })
  }
  editNameDialog.value = false;

  console.log(form.value)
}
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
  proxy.$refs["orderRef"].validate(valid => {
    if (valid) {
      if (form.value.purchaseOrderId != null) {
        updateOrder(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
        });
      } else {
        addOrder(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
        });
      }
    }
  });

  router.push('/purchaseManage/order')
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
  console.log('tabClick', this.tabClickIndex, row.demandNumber)
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
    const index = form.value.demandProductsList.findIndex(item => item.productId === row.productId);
    if (index !== -1) {
      form.value.demandProductsList.splice(index, 1);
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
  console.log(productRows.value)
  form.value.demandProductsList = productRows.value
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
  form.value.demandProductsList.forEach(row=>{
    row.orderMoney = (row.costPrice * row.demandNumber || 0).toFixed(3);

    price += parseFloat(row.orderMoney) || 0;
    form.value.purchaseAllAmount = price;
  })
  if(price < 0 || price==null){
    price=0
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

function handleOrderUpdate(){

  const _purchaseOrderId = form.value.purchaseOrderId

  router.push({
    path:'/purchaseManage/order/addOrder',
    query:{purchaseOrderId : _purchaseOrderId}
  });
}

//审核订单

//提交审核
const auditAddDTO = ref({})

function submitOrderAudit(auditType){
  auditAddDTO.value.auditType = auditType;

  if(auditType == 1){
  }else{
  }
  auditAddDTO.value.orderId = form.value.purchaseOrderId;

  addOrderAudit(auditAddDTO.value).then(response => {
    proxy.$modal.msgSuccess("审核成功");

    setTimeout(function (){
      location.reload();
    },500)
   })


  console.log(auditAddDTO.value)
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
  form.value.demandProductsList = data
}

//******************************************************
function getOrderDetail(){
  getOrder(purchaseOrderId.value).then(response => {
    form.value = response.data;
    form.value.demandProductsList =response.data.demandProductsList;
    if(form.value.auditId === "1"){
      isAudited.value = true
    }
    console.log(form.value.demandProductsList)
   });
}
// 接收参数
const isShowP = ref()
const purchaseOrderId = ref(route.query.purchaseOrderId ? route.query.purchaseOrderId : null);


function addOrUpdate() {
  getCurrentDate();
  console.log(purchaseOrderId.value);

if (purchaseOrderId.value !== null ) {
    alert("订单详情")
    isShowP.value = purchaseOrderId.value;
    openWarehouse.value = false;
    loading.value = false;
    getOrderDetail();
  }
}


addOrUpdate()
getWarehouseTree()
getUnitList();
</script>

<style scoped>

.header {
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
  top: 1px;
  bottom: 1px;
  right: 1px;
  left: 1px;
  z-index: 1;
  background-color: rgba(176,196,222, 0.2); /* 淡灰色 */
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

.app-container{
  background-color: rgba(245, 246, 244, 0.64);
}


/*描述框*/

.my-descriptions {

  margin-bottom: 20px !important;
  border-width: 12px !important;
  width: 90%;
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

.el-table{

}
</style>

