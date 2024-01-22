<template>
  <div class="app-container">
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
        <el-button type="primary" plain >打印</el-button>
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
            <el-row class="el-row">

              <el-col :span="6">
                <el-form-item label="计划编号">
                  <el-input v-model="form.planCode" placeholder="保存后自动生成" clearable class="readonly-tree-select"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单据名称">
                  <el-input v-model="form.planName" placeholder="请输入单据名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="生产线" >
                  <el-select v-model="form.lineId" class="m-2" placeholder="请选择生产线">
                    <el-option
                        v-for="item in lineOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                        :props="{ value: 'id', label: 'label'}"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="目标仓库" >
                  <el-tree-select
                      v-model="form.warehouseId"
                      :data="warehouseOptions"
                      :props="{ value: 'id', label: 'label', children: 'children' }"
                      value-key="id"
                      placeholder="请选择仓库"
                      class="readonly-tree-select"

                  />
                </el-form-item>
              </el-col>
            <el-col :span="6">
              <el-form-item label="计划日期"   prop="planTime">
                <el-date-picker clearable
                                v-model="form.planTime"
                                type="date"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择订单交货日期"
                                style="height: 45px">
                </el-date-picker>
              </el-form-item>
            </el-col>
              <el-col :span="6">
                <el-form-item label="交货日期"   prop="warehouseId">
                  <el-date-picker clearable
                                  v-model="form.purchaseOrderTime"
                                  type="date"
                                  value-format="YYYY-MM-DD"
                                  placeholder="请选择订单交货日期"
                                  style="height: 46px">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单备注">
                  <el-input v-model="form.remark" placeholder="请输入BOM表备注" style="height: 60px" clearable />
                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </div>

        <!-- Bom成品信息 -->
        <div class="section" v-show="orderBOMDetailFormShow">
          <div class="section-header">
            成品信息
            <el-button link type="primary"  @click=" " class="followButton"> 重置</el-button>
          </div>
          <div class="section-content">
            <!-- Form items for product info -->
            <el-form :model="form.productForm" :inline="true" :rules="rules" class="BomForm">
            <el-row>
              <el-col :span="6">
                <el-form-item label="成品商品名称" >
                  <el-input v-model="form.productForm.productName" placeholder="请输入成品商品名称" prop="productName" clearable >
                    <template v-slot:append>
                      <el-button plain style="width: 80px; padding: 0;" @click="handleSelectProduct">
                        <span style="color: #409eff!important; font-size: 12px;">选择商品</span>
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="封装规格" class="select-container">
                  <el-input v-model="form.productForm.encapStandard" placeholder="请输入封装规格" clearable class="readonly-tree-select" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="厂家型号" class="select-container">
                  <el-input v-model="form.productForm.productModel" placeholder="请输入厂家型号" clearable class="readonly-tree-select"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="成品商品编号" class="select-container">
                  <el-input v-model="form.productForm.productCode" placeholder="请输入成品商品编号" clearable class="readonly-tree-select"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="包装单位" class="select-container">
                  <el-input v-model="form.productForm.minpacketUnit" placeholder="请输入重量" clearable class="readonly-tree-select"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="包装数量" class="select-container">
                  <el-input v-model="form.productForm.minpacketNumber" placeholder="请输入备注" clearable class="readonly-tree-select"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="品牌" class="select-container">
                  <el-input v-model="form.productForm.warehouse" placeholder="请输入备注" clearable class="readonly-tree-select"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="重量" >
                  <el-input v-model="form.productForm.productWeight" placeholder="请输入重量" clearable class="readonly-tree-select"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>

              <el-col :span="6">
                <el-form-item label="备注" class="select-container">
                  <el-input v-model="form.productForm.remark" placeholder="请输入备注" clearable class="readonly-tree-select"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="套数" class="select-container" prop="groupNumber">
                  <el-input v-model="form.groupNumber" placeholder="请输入套数" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            </el-form>
          </div>
        </div>

        <!-- Bom用料信息 -->
        <div class="section">
          <div class="section-header">
            Bom用料信息
           </div>
          <div class="section-content">
            <!-- Buttons for importing and downloading -->
<!--            <el-row>-->
<!--              <el-button size="mini">导入BOM表</el-button>-->
<!--              <el-button>下载BOM模板</el-button>-->
<!--            </el-row>-->

            <!-- Display BOM total count and cost -->
            <el-row>
              <span style="margin-right: 20px">BOM总数：{{ form.productList.length }}</span>
              <span>BOM总成本：￥{{ getBomTotalCost() }}</span>
            </el-row>

              <el-table
                  :data="form.productList"
                  v-loading="openPlanAdd"
                  style="width: 100%"
                  :cell-class-name="addSeparate"
                  :header-cell-style="tableHeaderColor"
              >

                  <el-table-column type="selection" width="55" align="center" />
                   <el-table-column label="编号" align="center" prop="productCode" />
                  <el-table-column label="商品信息" align="center" prop="productName" >
                    <template #default="scope">
                      <span style="display: block;font-family: '微软雅黑'">商品:{{ scope.row.productName }}</span>
                      <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
                      <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
                      <span style="display: block;">包装数量:{{ scope.row.minpacketNumber }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="单套用量" prop="usageAmount" align="center" width="124px" >
                    <template #default="scope">
                      <el-input v-model="scope.row.usageAmount" type="number" size="small"  :min="1" />
                    </template>
                  </el-table-column>
                  <el-table-column label="总数" align="center" prop="encapStandard" >
                    <template #default="scope">
                      <span style="color: rgba(40,177,232,0.83); ">
                        {{scope.row.usageAmount * form.groupNumber}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="单个成本" align="center" prop="costPrice" width="134px">
                    <template #default="scope">
                      <el-input-number v-model="scope.row.costPrice" size="small"  :min="1" />
                    </template>
                  </el-table-column>
                  <el-table-column label="金额" align="center" prop="remark" >
                    <template #default="scope">
                      <span>
                        {{scope.row.usageAmount * scope.row.costPrice}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="预损耗量" prop="estimatedLoss" align="center">
                    <template #default="scope">
                      <span>
                        <el-input v-model="scope.row.estimatedLoss"  type="number" maxlength="26" placeholder="请输入" size="mini"  />
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注" align="center" prop="remark" />

                <el-table-column label="库存数量" align="center" prop="balanceNumber" />
                <el-table-column label="占用数量" align="center">
                  <template #default="scope">
                    <a  style="color: rgba(40,177,232,0.83); text-decoration: underline;">{{scope.row.balanceNumber - scope.row.availableNumber}}</a>
                  </template>
                </el-table-column>
                <el-table-column label="可用数量" align="center" prop="availableNumber" />
              </el-table>


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




<!--    分布弹窗-->
    <!--    商品选择框-->

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

const router = useRouter();
const route = useRoute();
const title = ref("");


const loading = ref(true)
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
const data = reactive({
  form: ref({
    createTime: "",
    bomCostPrice: 0,
    groupNumber :0,
    warehouseId: 0,
    lineId:"",
    productForm:ref({}),
    productList: ref([{
        product:{},
        costPrice: 2,
        usageAmount: 0
    }
    ])
  }),
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    purchaseOrderCode: null,
    purchaseOrderName: null
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
    planTime: [
      { required: true, message: "日期不能为空", trigger: "blur" }
    ],
    planName: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    groupNumber: [
      { required: true, message: "套数不能为空", trigger: "blur" }
    ],
    productId: [
      { required: true, message: "商品id不能为空", trigger: "blur" }
    ],

  }
});

const { queryParams, form, rules ,productForm,queryProductParams} = toRefs(data);
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


/* 添加蒙版效果 */
.readonly-tree-select {
  pointer-events: none;
}
/* 给蒙版添加样式 */
/* 给蒙版添加样式 */
.readonly-tree-select::after {
  content: '';
  position: absolute;
  top: 6px; /* 调整蒙版顶部偏移 */
  bottom: 6px; /* 调整蒙版底部偏移 */
  left: 6px;
  right: 6px;
  z-index: 1;
  background-color: rgba(204, 219, 238, 0.43); /* 淡灰色 */
  box-sizing: border-box; /* 让蒙版尺寸包括 border 和 padding */
  padding: 1px; /* 调整蒙版内边距，使其与输入框内容更贴近 */
  border-radius: 4px; /* 添加圆角 */
}

.el-table .custom-header th {
  background-color: #e6f7ff !important;
}

.separator-border {
  border-right: 1px solid #eeeff2!important;
}
</style>
