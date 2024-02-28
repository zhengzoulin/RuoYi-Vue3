<template>

  <div class="app-container" v-loading="loading">

    <el-row class="header">
      <router-link to="/purchaseManage/purchaseReturn">
        <el-button type="primary"     icon="Back"
                   plain style=" color: #fff;background-color: #909399;
                              border-color: #909399; font-size: 12px">
          <span>返回</span>
        </el-button>

      </router-link>
      <div>
        <span style="color: #1c84c6;font-size: 24px">BOM详情</span>
      </div>
      <div>
        <el-button type="warning" plain @click="handleOrderUpdate"  :disabled="isAudited" >修改</el-button>
        <el-button type="primary" @click="pdfFunc" plain >打印</el-button>
      </div>
    </el-row>
    <div >
      <el-row style="  margin-bottom: 20px !important;">
             <span > 采购退货单基本信息
        <el-button link type="primary" icon="list" @click="orderDetailFormShow = !orderDetailFormShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
      </el-row>

        <el-descriptions  border="true" column="3" size="large"   class="my-descriptions" v-show="orderDetailFormShow" width="900px">
          <el-descriptions-item label="退货单号"  label-align="center">{{form.purchaseOrderReturnCode}}</el-descriptions-item>
          <el-descriptions-item label="单据名称"  label-align="center">
            <span>{{form.purchaseOrderReturnName}}</span>
            <el-button link type="primary"  @click="editOrderName"  icon="Edit" class="followButton"> </el-button>
           </el-descriptions-item>
          <el-descriptions-item label="退货原因"  label-align="center">{{form.outStockType}}</el-descriptions-item>
          <el-descriptions-item label="创建时间"  label-align="center">{{form.createTime}}</el-descriptions-item>
          <el-descriptions-item label="退货日期"  label-align="center">{{form.purchaseOrderReturnTime}}</el-descriptions-item>
          <el-descriptions-item label="所属仓库"  label-align="center">{{form.warehouse.warehousePath}}</el-descriptions-item>
          <el-descriptions-item label="审核人"  label-align="center">{{form.createBy}}</el-descriptions-item>
          <el-descriptions-item label="备注"  label-align="center">{{form.remark}}</el-descriptions-item>
          <el-descriptions-item label="供应商"  label-align="center">{{form.unit.unitName}}</el-descriptions-item>
        </el-descriptions>

      <div style="margin-top: 10px "> <span >采购订单信息 </span></div>

      <el-table
          :data="form.purchaseOrderSelection"
          height="140px"
          style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
      >

        <el-table-column label="#" type="index" width="55" align="center" />
        <el-table-column label="采购单号" align="center"   >
          <template #default="scope">
            <!-- 使用 <a> 标签来包装数据，并添加样式 -->
            <a
                href="#"
                style="color: rgba(40,177,232,0.83); text-decoration: underline;"
                @click="handleOrderDetailClick(scope.row)"
            >
              {{ scope.row.purchaseOrderCode }}
            </a>
          </template>
        </el-table-column>

        <el-table-column label="单据名称" align="center" prop="purchaseOrderName"  />
        <el-table-column label="创建日期" prop="createTime" align="center"/>
        <el-table-column label="交货日期" prop="purchaseOrderTime" align="center"/>
        <!--      <el-table-column label="出货仓库" align="center" prop="warehouse.warehousePath"  />-->
        <el-table-column label="订单备注" prop="remark"  align="center"/>

      </el-table>
      <el-row>
        <span style="font-size: 16px;margin-bottom: 10px"> 退货商品信息 </span>
      </el-row>


      <span >采购种数：{{form.purchaseOrderSelection.length}}</span>
      <span style="margin: 20px">采购总额：{{getPurchaseAllAmount()}}</span>

      <el-table v-loading="loading"
                :data="form.orderProductsList"
                height="450">

        <el-table-column type="index" width="55" align="center" label="#" />

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

      </el-table>
    </div>


    <div id="pdfDom" v-show="loading">
      <el-row style="justify-content: center;margin: 15px;font-size: 28px">   <span >{{form.purchaseOrderReturnCode}}-采购退货订单-{{form.createTime}}</span></el-row>

      <div class="description-container">
        <el-row style="justify-content: center;margin: 10px">   <span > 退货单基本信息</span></el-row>
        <el-descriptions  border="true" column="3" size="large"   class="my-descriptions" v-show="orderDetailFormShow" width="900px">
          <el-descriptions-item label="订单编号"  label-align="left">{{form.purchaseOrderReturnCode}}</el-descriptions-item>
          <el-descriptions-item label="单据名称"  label-align="left">
            <span>{{form.purchaseOrderReturnName}}</span>
           </el-descriptions-item>
          <el-descriptions-item label="供应商"  label-align="left">{{form.unit.unitName}}</el-descriptions-item>
          <el-descriptions-item label="下单时间"  label-align="left">{{form.createTime}}</el-descriptions-item>
          <el-descriptions-item label="交货日期"  label-align="left">{{form.purchaseOrderReturnTime}}</el-descriptions-item>
          <el-descriptions-item label="目标仓库"  label-align="left">{{form.warehouse.warehousePath}}</el-descriptions-item>
          <el-descriptions-item label="入库单数"  label-align="left">{{form.purchaseOrderSelection.length}}</el-descriptions-item>
          <el-descriptions-item label="订单总金额"  label-align="left">{{form.purchaseAllAmount}}</el-descriptions-item>
          <el-descriptions-item label="创建人"  label-align="left">{{form.createBy}}</el-descriptions-item>
          <el-descriptions-item label="审核人"  label-align="left">{{form.createBy}}</el-descriptions-item>

          <el-descriptions-item label="备注"  label-align="left">{{form.remark}}</el-descriptions-item>

        </el-descriptions>
      </div>
      <div class="table-container">
        <el-row style="justify-content: center;margin-top: 10px">   <span > 采购订单信息</span></el-row>

        <el-table :data="form.purchaseOrderSelection">

          <el-table-column label="#" type="index" width="55" align="center" />

          <el-table-column label="采购订单编号" align="center" prop="purchaseOrderReturnId">
            <template #default="scope">
              <!-- 使用 <a> 标签来包装数据，并添加样式 -->
              <a
                  href="#"
                  style="color: rgba(40,177,232,0.83); text-decoration: underline;"
                  @click="handleOrderDetailClick(scope.row)"
              >
                {{ scope.row.purchaseOrderCode }}
              </a>
            </template>
          </el-table-column>

          <el-table-column label="单据名称" align="center" prop="purchaseOrderName"/>

          <el-table-column label="下单日期" prop="createTime" align="center" />
          <el-table-column label="交货日期" prop="purchaseOrderTime" align="center" />

          <el-table-column label="供应商" align="center" prop="unit.unitName"/>
          <el-table-column label="备注" prop="remark"/>

        </el-table>
      </div>

      <div class="table-container">
        <el-row style="justify-content: center;margin-top: 10px">   <span > 退货商品信息</span></el-row>
        <el-table
            :data="form.orderProductsList">

          <el-table-column type="index" width="55" align="center" label="#" />

          <el-table-column label="商品编号" align="center" prop="productCode" width="120px"/>

          <el-table-column label="商品信息" align="center" width="140px">
            <template #default="scope">
              <span style="display: block;"> {{ scope.row.productName }}</span>
              <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
              <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
              <span style="display: block;">最小包装数量:{{ scope.row.minpacketNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" prop="demandNumber" align="center" class="select-container" width="130px"/>

          <el-table-column label="采购价格" prop="costPrice" align="center" class="select-container" width="130px"/>
          <el-table-column label="金额" prop="orderMoney" align="center" class="select-container" width="130px"/>

          <el-table-column label="已入库数量" prop="alreadyAddStockNumber" align="center" width="130px"/>

          <el-table-column label="可退货数量" prop="canReturnNumber" align="center" width="130px">
            <template #default="scope">
              <span style="color: red;">{{scope.row.canReturnNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column label="退货数量"  prop="canReturnNumber"  align="center" />

        </el-table>
      </div>
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
import htmlToPdf from "../../../../../utils/htmlToPdf";
import {getPurchaseReturn} from "../../../../../api/erp/purchaseReturn";

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const total = ref(0);
const title = ref("");
const loading = ref(false);
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



const pdfFunc = () => {
  loading.value = true;
  // 调用htmlToPdf工具函数
  setTimeout(() => {
    let fileName = form.value.purchaseOrderReturnCode+'-采购退货订单-'+form.value.createTime
    htmlToPdf.getPdf(fileName);  }, 100);
  // 定时器模拟按钮loading动画的时间
  setTimeout(() => {
    proxy.$modal.msgSuccess("导出成功");
    loading.value = false;
  }, 1000);
}
const data = reactive({
  form: {
    unit:{
      unitName:''
    },
    warehouse:{
      warehousePath:''
    },
    createTime: "",
    purchaseOrderSelection: ref([]),
  },

  productForm:{},

  rules: {
    purchaseOrderReturnName: [
      { required: true, message: "单据名称不能为空", trigger: "blur" }
    ]
  }
});

const {  form, rules ,productForm} = toRefs(data);



const displayTitleText = computed(() => {
  if (purchaseOrderReturnId.value == null) {
    return '新增采购订单';
  } else {
    return '采购退货订单详情';
  }
});


const newOrderName = ref(null)
function editOrderName(){
  editNameDialog.value = true;
  // newOrderName.value =  form.value.purchaseOrderReturnName
}
//修改名称
function saveName(){

  if(newOrderName.value === form.value.purchaseOrderReturnName){
    editNameDialog.value = false
  }else{
    form.value.purchaseOrderReturnName = newOrderName.value
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
      if (form.value.purchaseOrderReturnId != null) {
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
    const index = form.value.purchaseOrderSelection.findIndex(item => item.productId === row.productId);
    if (index !== -1) {
      form.value.purchaseOrderSelection.splice(index, 1);
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
  form.value.purchaseOrderSelection = productRows.value
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
  form.value.purchaseOrderSelection.forEach(row=>{
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

  const _purchaseOrderReturnId = form.value.purchaseOrderReturnId

  router.push({
    path:'/purchaseManage/order/addOrder',
    query:{purchaseOrderReturnId : _purchaseOrderReturnId}
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
  auditAddDTO.value.orderId = form.value.purchaseOrderReturnId;

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
  form.value.purchaseOrderSelection = data
}

//******************************************************
function getOrderDetail(){
  getOrder(purchaseOrderReturnId.value).then(response => {
    form.value = response.data;
    form.value.purchaseOrderSelection =response.data.purchaseOrderSelection;
    if(form.value.auditId === "1"){
      isAudited.value = true
    }
    console.log(form.value.purchaseOrderSelection)
   });
}
 
// 接收参数
const purchaseOrderReturnId = ref(route.query.purchaseOrderReturnId);
function addOrUpdate(){
  if(purchaseOrderReturnId.value == null){
    alert("新增")
  }else{
    alert("修改xiaos")
    getPurchaseReturn(purchaseOrderReturnId.value).then(response => {
      form.value = response.data;
      if(form.value.auditId !== "0"){
        isAudited.value = true
      }
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
  margin-bottom: 20px;
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
.description-container {
  /* 描述框的样式 */
  border: 1px solid #ddd;
  border-color: #ddd; /* 设置边框颜色与描述框默认边框颜色一致 */
}

.table-container {
  /* 表格的样式 */
  border: 1px solid #ddd;
  border-color: #ddd; /* 设置边框颜色与描述框默认边框颜色一致 */
}
</style>

