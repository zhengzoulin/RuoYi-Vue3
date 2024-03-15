<template>
  <div class="app-container" v-loading="loading">
    <!-- Header section with buttons -->
    <el-row class="header">
      <router-link to="/produce/plan">
        <el-button type="primary"     icon="Back"
                   plain style=" color: #fff;background-color: #909399;
                              border-color: #909399; font-size: 12px">
          <span>返回</span>
        </el-button>

      </router-link>
      <div>
        <span style="color: #1c84c6;font-size: 24px">生产计划详情</span>
      </div>
      <div>
        <el-button type="warning" plain @click="handleUpdate">修改</el-button>
        <el-button type="primary" plain @click="pdfFunc">导出pdf</el-button>
      </div>
    </el-row>



    <!-- Form section -->
    <el-row class="form-section">
      <el-form :model="form" :inline="true" class="BomForm" :rules="rules">
        <!-- Bom基本信息 -->
        <div class="section">
          <div class="section-header">
            计划基本信息
            <el-button link type="primary" icon="list" class="followButton"
                       @click="orderBOMDetailFormShow = !orderBOMDetailFormShow"> {{ orderBOMDetailFormShow ? '收起' : '详细' }}</el-button>
          </div>
          <div class="section-content" v-show="orderBOMDetailFormShow">
            <!-- Form items for basic info -->
            <el-descriptions border="true" column="3" size="large" class="my-descriptions" v-show="orderBOMDetailFormShow">
              <el-descriptions-item label="计划编号"  label-align="center">
                {{form.planCode }}
              </el-descriptions-item>

              <el-descriptions-item label="单据名称"  label-align="center">
                {{form.planName }}
                <el-button link type="primary"  icon="Edit"  @click=" " class="followButton"></el-button>
              </el-descriptions-item>

              <el-descriptions-item label="生产线"  label-align="center">
               {{form.line.lineName}}
              </el-descriptions-item>

              <el-descriptions-item label="目标仓库"  label-align="center">
                {{form.warehouse.warehousePath}}
              </el-descriptions-item>

              <el-descriptions-item label="计划日期" prop="planTime"  label-align="center">
                <el-date-picker clearable
                                v-model="form.planTime"
                                type="date"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择订单交货日期"
                                style="height: 46px">
                </el-date-picker>
              </el-descriptions-item>

              <el-descriptions-item label="交货日期" prop="warehouseId"  label-align="center">
                <el-date-picker clearable
                                v-model="form.planTime"
                                type="date"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择订单交货日期"
                                style="height: 46px">
                </el-date-picker>
              </el-descriptions-item>

              <el-descriptions-item label="订单备注"  label-align="center">
               {{form.remark}}
              </el-descriptions-item>
            </el-descriptions>

          </div>
        </div>

        <!-- Bom成品信息 -->
        <div class="section" v-show="orderBOMDetailFormShow">
          <div class="section-header">
            成品信息
          </div>

          <div class="section-content">
            <!-- Form items for product info -->
            <el-descriptions  border="true" column="3" size="large"   class="my-descriptions" >
              <el-descriptions-item label="成品商品名称"  label-align="center">{{form.productForm.productName}}</el-descriptions-item>
              <el-descriptions-item label="封装规格"  label-align="center">
                <span>{{form.productForm.encapStandard}}</span>
               </el-descriptions-item>
              <el-descriptions-item label="厂家型号"  label-align="center">{{form.productForm.productModel}}</el-descriptions-item>
              <el-descriptions-item label="成品商品编号"  label-align="center">{{form.productForm.productCode}}</el-descriptions-item>
              <el-descriptions-item label="包装单位"  label-align="center">{{form.productForm.minpacketUnit}}</el-descriptions-item>
              <el-descriptions-item label="包装数量"  label-align="center">{{form.productForm.minpacketNumber}}</el-descriptions-item>
              <el-descriptions-item label="品牌"  label-align="center">{{form.productForm.brand.brandName}}</el-descriptions-item>
              <el-descriptions-item label="重量"  label-align="center">{{form.productForm.productWeight}}</el-descriptions-item>
              <el-descriptions-item label="目录"  label-align="center">{{form.createBy}}</el-descriptions-item>
              <el-descriptions-item label="备注"  label-align="center">{{form.productForm.remark}}</el-descriptions-item>
              <el-descriptions-item label="套数"  label-align="center">{{form.groupNumber}}</el-descriptions-item>

            </el-descriptions>

          </div>
        </div>

        <!-- Bom用料信息 -->
        <div class="section">
          <div class="section-header">
            Bom用料信息
           </div>
          <div class="section-content">

            <el-row>
              <span style="margin-right: 20px">BOM总数：{{ form.productList.length }}</span>
              <span>BOM总成本：￥{{ getBomTotalCost() }}</span>
            </el-row>
            <el-scrollbar style="height: 520px;">
              <el-table
                  :data="form.productList"
                  v-loading="openPlanAdd"
                  style="width: 100%"
                  :cell-class-name="addSeparate"
                  :header-cell-style="tableHeaderColor"
              >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="编号" align="center" prop="productCode" >
                  <template #default="scope">
                      <span class="readonly-column-select">
                          {{ scope.row.productCode}}
                      </span>
                  </template>
                </el-table-column>
                <el-table-column label="商品信息" align="center"  width="140" prop="productName" class="readonly-column-select">
                  <template #default="scope">
                    <span style="display: block;font-family: '微软雅黑'" class="readonly-column-select">商品:{{ scope.row.productName }}</span>
                    <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
                    <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
                    <span style="display: block;">包装数量:{{ scope.row.minpacketNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="单套用量" prop="usageAmount" align="center" width="124px" >
                  <template #default="scope">
                       <span >
                        {{scope.row.usageAmount}}
                      </span>
                  </template>
                </el-table-column>
                <el-table-column label="用料总数" align="center" prop="encapStandard" >
                  <template #default="scope">
                      <span style="color: rgba(40,177,232,0.83); ">
                        {{scope.row.usageAmount * form.groupNumber}}
                      </span>
                  </template>
                </el-table-column>
                <el-table-column label="单个成本" align="center" prop="costPrice" width="134px">
                  <template #default="scope">
                       <span >
                        {{scope.row.costPrice}}
                      </span>
                  </template>

                </el-table-column>
                <el-table-column label="金额" align="center" prop="remark" >
                  <template #default="scope">
                      <span>
                          {{ (scope.row.usageAmount * scope.row.costPrice).toFixed(3)}}
                      </span>
                  </template>
                </el-table-column>
                <el-table-column label="预损耗量" prop="estimatedLoss" align="center">
                  <template #default="scope">
                       <span >
                        {{scope.row.estimatedLoss}}
                      </span>
                  </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="remark" />

                <el-table-column label="库存数量" align="center" prop="balanceNumber" />
                <el-table-column label="占用数量" align="center">
                  <template #default="scope">
                    <a  style="color: rgb(241,54,36); text-decoration: underline;">{{scope.row.balanceNumber - scope.row.availableNumber}}</a>
                  </template>
                </el-table-column>
                <el-table-column label="可用数量" align="center" prop="availableNumber" />
              </el-table>
            </el-scrollbar>


          </div>
        </div>
      </el-form>
    </el-row>


    <plan-table
        :openPlanAdd="openPlanAdd"
        :bomList="bomList"
        :queryBom="queryBom"
         :warehouseOptions="warehouseOptions"
         @queryBomSelect="queryBomSelect"
        @showBomDetail="showBomDetail"
        @submitBomSelect="submitBomSelect"
    />

    <div id="pdfDom" v-show="loading">
      <el-row style="justify-content: center;margin: 15px;font-size: 28px">   <span >{{form.planCode}}生产计划-{{form.createTime}}</span></el-row>

      <div class="description-container">
        <el-row style="justify-content: center;margin: 10px">   <span > 生产计划基本信息</span></el-row>
        <el-descriptions border="true" column="3" size="large" class="my-descriptions"  >
          <el-descriptions-item label="计划编号"  label-align="left">
            {{form.planCode }}
          </el-descriptions-item>

          <el-descriptions-item label="单据名称"  label-align="left">
            {{form.planName }}
            <el-button link type="primary"  icon="Edit"  @click=" " class="followButton"></el-button>
          </el-descriptions-item>

          <el-descriptions-item label="生产线"  label-align="left">
            {{form.line.lineName}}
          </el-descriptions-item>

          <el-descriptions-item label="目标仓库"  label-align="left">
            {{form.warehouse.warehousePath}}
          </el-descriptions-item>

          <el-descriptions-item label="计划日期" prop="planTime"  label-align="left">
            {{form.planTime}}
          </el-descriptions-item>

          <el-descriptions-item label="交货日期" prop="warehouseId"  label-align="left">
           {{form.planTime}}
          </el-descriptions-item>

          <el-descriptions-item label="订单备注"  label-align="left">
            {{form.remark}}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="description-container">
        <el-row style="justify-content: center;margin: 10px">   <span > 成品信息</span></el-row>
        <el-descriptions  border="true" column="3" size="large"   class="my-descriptions" >
          <el-descriptions-item label="成品商品名称"  label-align="left">{{form.productForm.productName}}</el-descriptions-item>
          <el-descriptions-item label="封装规格"  label-align="left">
            <span>{{form.productForm.encapStandard}}</span>
          </el-descriptions-item>
          <el-descriptions-item label="厂家型号"  label-align="left">{{form.productForm.productModel}}</el-descriptions-item>
          <el-descriptions-item label="成品商品编号"  label-align="left">{{form.productForm.productCode}}</el-descriptions-item>
          <el-descriptions-item label="包装单位"  label-align="left">{{form.productForm.minpacketUnit}}</el-descriptions-item>
          <el-descriptions-item label="包装数量"  label-align="left">{{form.productForm.minpacketNumber}}</el-descriptions-item>
          <el-descriptions-item label="品牌"  label-align="left">{{form.productForm.brand.brandName}}</el-descriptions-item>
          <el-descriptions-item label="重量"  label-align="left">{{form.productForm.productWeight}}</el-descriptions-item>
          <el-descriptions-item label="目录"  label-align="left">{{form.createBy}}</el-descriptions-item>
          <el-descriptions-item label="备注"  label-align="left">{{form.productForm.remark}}</el-descriptions-item>
          <el-descriptions-item label="套数"  label-align="left">{{form.groupNumber}}</el-descriptions-item>

        </el-descriptions>
      </div>
      <div class="table-container">
        <el-row style="justify-content: center;margin-top: 10px">   <span > Bom用料信息</span></el-row>
        <el-table
            :data="form.productList"
             style="width: 100%"
            :cell-class-name="addSeparate"
            :header-cell-style="tableHeaderColor"
        >
          <el-table-column type="index" width="55" align="center" label="#" />
          <el-table-column label="编号" align="center" prop="productCode" >
            <template #default="scope">
                      <span class="readonly-column-select">
                          {{ scope.row.productCode}}
                      </span>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" align="center"  width="140" prop="productName" class="readonly-column-select">
            <template #default="scope">
              <span style="display: block;font-family: '微软雅黑'" class="readonly-column-select">商品:{{ scope.row.productName }}</span>
              <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
              <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
              <span style="display: block;">包装数量:{{ scope.row.minpacketNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单套用量" prop="usageAmount" align="center" width="124px" >
            <template #default="scope">
                       <span >
                        {{scope.row.usageAmount}}
                      </span>
            </template>
          </el-table-column>
          <el-table-column label="用料总数" align="center" prop="encapStandard" >
            <template #default="scope">
                      <span style="color: rgba(40,177,232,0.83); ">
                        {{scope.row.usageAmount * form.groupNumber}}
                      </span>
            </template>
          </el-table-column>
          <el-table-column label="单个成本" align="center" prop="costPrice" width="134px">
            <template #default="scope">
                       <span >
                        {{scope.row.costPrice}}
                      </span>
            </template>

          </el-table-column>
          <el-table-column label="金额" align="center" prop="remark" >
            <template #default="scope">
                      <span>
                          {{ (scope.row.usageAmount * scope.row.costPrice).toFixed(3)}}
                      </span>
            </template>
          </el-table-column>
          <el-table-column label="预损耗量" prop="estimatedLoss" align="center">
            <template #default="scope">
                       <span >
                        {{scope.row.estimatedLoss}}
                      </span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" />

          <el-table-column label="库存数量" align="center" prop="balanceNumber" />
          <el-table-column label="占用数量" align="center">
            <template #default="scope">
              <a  style="color: rgb(241,54,36); text-decoration: underline;">{{scope.row.balanceNumber - scope.row.availableNumber}}</a>
            </template>
          </el-table-column>
          <el-table-column label="可用数量" align="center" prop="availableNumber" />
        </el-table>
      </div>



    </div>




  </div>
</template>

<script setup>
import { ref } from 'vue';
import BigNumber from 'bignumber.js';
import {getProduct, listProduct} from "../../../../../api/erp/product";
import ProductTable from "../../../../../components/zerp/table/productTable";
import {addBom, getBom, listBom, updateBom} from "../../../../../api/erp/bom";
import {useRoute, useRouter} from "vue-router";
import PlanTable from "../planBomDialog";
import {warehouseParentTreeSelect} from "../../../../../api/erp/position";
import {addPlan, getInventoryByBom, getPlan, updatePlan} from "../../../../../api/erp/plan";
import {addLineAudit, getLinesByWarehouse} from "../../../../../api/erp/line";
import {addAddStockAudit} from "../../../../../api/erp/addStock";
import htmlToPdf from "../../../../../utils/htmlToPdf";
const { proxy } = getCurrentInstance();

const router = useRouter();
const route = useRoute();
const title = ref("");


const loading = ref(false)
const orderBOMDetailFormShow = ref(true)
const openProduct = ref(false);
const openPlanAdd = ref(true)


const radioSelect = ref(true)
const auditDisabled = ref(true);
const productList = ref([]);
const productRows = ref([]);
const bomTotalCount = ref(0); //
const bomTotalCost = ref(0);
const warehouseOptions = ref(undefined);
 const lineOptions = ref([])

// Your reactive data

const queryBom = ref({});
const bomList = ref([]);

const pdfFunc = () => {

  loading.value = true;
  // 调用htmlToPdf工具函数
  setTimeout(() => {
    let fileName = form.value.planCode+'-生产计划-'+form.value.createTime
    htmlToPdf.getPdf(fileName);  }, 100);
  // 定时器模拟按钮loading动画的时间
  setTimeout(() => {
    proxy.$modal.msgSuccess("导出成功");
    loading.value = false;
  }, 1000);
}
const data = reactive({
  form: ref({
    line:{
      lineName:""
    },
    warehouse:{
      warehousePath:''
    },
    createTime: "",
    bomCostPrice: 0,
    groupNumber :0,
    warehouseId: 0,
    lineId:"",
    productForm:ref({
      brand:{
        brandName:''
      }
    }),
    productList: ref([{
        product:{},
        costPrice: 2,
        usageAmount: 0
    }
    ])
  })

});

const { form, productForm} = toRefs(data);
/** 商品搜索按钮操作 */
function handleProductQuery() {
  queryProductParams.value.pageNum = 1;
  getProductList();
}
/** 查询商品列表 */
function getProductList() {
  listProduct(queryProductParams.value).then(response => {
    productList.value = response.rows;
  });
}
/** 新增选择商品按钮操作 */
function handleSelectProduct() {
  getProductList();

  productRows.value = []
  openProduct.value = true;
  radioSelect.value = true;
  title.value = "选择成品商品";
}
/** 查询仓库下拉树结构 */
function getWarehouseTree() {
  warehouseParentTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};
function submitProductList(){
  // productRows.value = [];
  openProduct.value=false;

  if(radioSelect.value){
    if (productRows.value.length === 1) {
      form.value.productForm = productRows.value[0];
    } else {
      // 处理错误，例如抛出一个错误或者提醒用户只能有一个对象
      // 例如抛出一个错误
      return('成品只能选择一个');
    }
  }else{
    console.log("原材料")
    productRows.value.forEach((row) => {
      if (row && !form.value.productList.some(item => item === row)) {
        console.log(row)
        form.value.productList.push(row);
      }
    });

    loading.value = false
  }

}

//
const handleNumberChange = () => {
  console.log()
}

function submitPlanForm(){
  console.log(form.value)
  if(planId.value == null){
    addPlan(form.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      getList();
    });
  }else{
    updatePlan(form.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      getList();
    });
  }

  router.push("/produce/plan");
}


function getBomTotalCost(){
  if (form.value.productList.length > 0) {
    let totalCount = 0;
    let totalCost = 0;
    form.value.productList.forEach((row) => {
      totalCount++;
      totalCost += row.usageAmount * row.costPrice;
    });
    bomTotalCount.value = totalCount;
    bomTotalCost.value = totalCost;
  } else {
    bomTotalCount.value = 0;
    bomTotalCost.value = 0;
  }
  form.value.bomCostPrice = bomTotalCost.value
  return bomTotalCost.value;
}

function getPlanDetail(){
  getPlan(planId.value).then(response => {
    form.value = response.data;
    title.value = "修改bom物料";
  });
}

const displayTitleText = computed(() => {
  if (planId.value == null) {
    return '新增生产计划';
  } else {
    return '修改修改生产计划';
  }
});


function getLineOptions(){
  const _warehouseId = form.value.warehouseId
  getLinesByWarehouse(_warehouseId).then(response =>{
    // 处理数据，将长整数转换为字符串，使用 bignumber.js
    const processedData = response.data.map(item => ({
      id: new BigNumber(item.id).toString(),
      label: item.label
    }));

    // 将处理后的数据赋值给 lineOptions
    lineOptions.value = processedData;

    console.log(lineOptions.value)

  })
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

function getBomList(){
  listBom(queryBom.value).then(response => {
    bomList.value = response.rows;
  });

  getWarehouseTree()

 }

function addSeparate(row) {
  if (row.columnIndex % 1  == 0) {
    return "separator-border"
  }
}
// 根据data返回的每个单元格的数据判断,再修改单个表头单元格的颜色
function tableHeaderColor(data) {
  if (data.column.property == "equip") {
    return { background: "#a0cfff", color: "#000", textAlign: "center" };
  } else if (
      data.column.property == "value1" ||
      data.column.property == "value2" ||
      data.column.property == "name1"
  ) {
    return { color: "#000", textAlign: "center" };
  } else if (data.column.property == "value3") {
    return { color: "#117ecc", textAlign: "center" };
  }
}
/** 分布弹窗选择Bom单 */
function submitBomSelect(data){
  // openPlanAdd.value = false;
  console.log("返回data：")
  form.value = data

  console.log(form.value.bomId)
  //带着参数去后端，查询bom单物料的库存情况，如何再返回
  getInventoryByBom(form.value.bomId).then(response=>{
    form.value.productList = response.data
  })
  console.log(form.value.warehouseId)
  getLineOptions()

  console.log(data.productList)
  openPlanAdd.value = false

}
/** 分布弹窗搜素Bom单 */

function queryBomSelect(data){

}
function addOrUpdate(){
  if(planId.value==null){

  }else{
    openPlanAdd.value = false
    getPlanDetail()
  }
}


// 接收参数
const planId = ref(route.query.planId);


addOrUpdate()
getBomList()
 </script>

<style >
/* Your CSS styles for layout and components */

.app-container{

}


.header {
  justify-content: space-between;
  margin-bottom: 10px;
  padding-right: 2%;
}

.form-section {
  width: 100%;

  /*background-color: #f9f9f9;*/
  padding: 2px 1px 2px 5px;
  border-radius: 8px;
  margin-bottom: 5px;
}

.section {
  margin-bottom: 5px;
  /*border: 1px solid #ccc;*/
  border-radius: 5px;
  width: 100%;
}

.section-header {
  width: 100%;

  font-weight: bold;
  display: flex;
  font-size: 14px;
  margin: 10px 0;
  padding-bottom: 6px;
  border-bottom: 1px dashed #d8dce5;
  /*justify-content: space-between;*/
}
.section-content{
  font-size: 13px;
}
.followButton{
  margin-left: 14px;
  font-size: 12px;
}

.el-row{
  margin-left : 1%;
  width: 100%;
}
.BomForm{
  width: 95%;
}
.BomForm .el-form-item {
  display: flex;
  align-items: center; /* 让内部元素垂直居中 */
}
.BomForm .el-form-item label {
  flex: 0 0 30%; /* 调整 label 占据的宽度，可以根据需要进行调整 */
  font-family: '微软雅黑', sans-serif !important;
}
.BomForm .el-input {
  font-size: 12px; /* 设置输入框字体大小为 14px */
  padding: 5px; /* 调整输入框内边距 */

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
  background-color: rgba(133, 203, 217, 0.3); /* 淡灰色 */
  /*background-color: rgba(219,238,242,0.3); !* 淡灰色 *!*/
}






</style>
