<template>
  <div class="app-container">
    <!-- Header section with buttons -->
    <el-row class="header">
      <router-link to="/bom">
        <el-button>
          <i class="el-icon-back"></i>
          <span>返回</span>
        </el-button>
      </router-link>
      <div>
        <span style="color: #1c84c6;font-size: 24px"> {{ displayTitleText }}</span>
      </div>
      <div>
        <el-button type="primary" plain>审核并通过</el-button>
        <el-button type="primary" plain @click="submitBomForm">保存</el-button>
      </div>
    </el-row>



    <!-- Form section -->
    <el-row class="form-section">
      <el-form :model="form" :inline="true" class="BomForm">
        <!-- Bom基本信息 -->
        <div class="section">
          <div class="section-header">
            Bom基本信息
            <el-button link type="primary" icon="list" class="followButton" @click="orderBOMDetailFormShow = !orderBOMDetailFormShow"> {{ orderBOMDetailFormShow ? '收起' : '详细' }}</el-button>
          </div>
          <div class="section-content" v-show="orderBOMDetailFormShow">
            <!-- Form items for basic info -->
            <el-row class="el-row">
<!--              <el-col :span="6">-->
<!--                <el-form-item label="所属仓库">-->
<!--                  <el-input v-model="form.warehouseId" placeholder="请输入仓库" clearable />-->
<!--                </el-form-item>-->
<!--              </el-col>-->
              <el-col :span="6">
                <el-form-item label="BOM表编号">
                  <el-input v-model="form.bomCode" placeholder="保存后自动生成" clearable class="readonly-tree-select"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单据名称">
                  <el-input v-model="form.bomName" placeholder="请输入单据名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="BOM表备注">
                  <el-input v-model="form.remark" placeholder="请输入BOM表备注" clearable />
                </el-form-item>
              </el-col>

              <!-- Other form items for Bom基本信息 -->
              <!-- ... -->
            </el-row>
          </div>
        </div>

        <!-- Bom成品信息 -->
        <div class="section" v-show="orderBOMDetailFormShow">
          <div class="section-header">
            Bom成品信息
            <el-button link type="primary"  @click=" " class="followButton"> 重置</el-button>
          </div>
          <div class="section-content">
            <!-- Form items for product info -->
            <el-form :model="form.productForm" :inline="true" class="BomForm">
            <el-row>
              <el-col :span="6">
                <el-form-item label="成品商品名称" >
                  <el-input v-model="form.productForm.productName" placeholder="请输入成品商品名称" clearable >
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
            </el-row>
            </el-form>
          </div>
        </div>

        <!-- Bom用料信息 -->
        <div class="section">
          <div class="section-header">
            Bom用料信息
            <el-button link type="primary"  @click=" " class="followButton"> 重置</el-button>
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
                  v-loading="loading"
                  style="width: 100%"
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              >

                <el-table-column label="原材料商品信息"  align="center" >
                  <el-table-column type="selection" width="55" align="center" />
                  <el-table-column type="index" label="序号" width="55" align="center" />
                  <el-table-column label="商品编号" align="center" prop="productCode" />
                  <el-table-column label="商品名称" align="center" prop="productName" />
                  <el-table-column label="厂家型号" align="center" prop="productModel" />
                  <el-table-column label="封装" align="center" prop="encapStandard" />
                  <el-table-column label="品牌" align="center" prop="brandName" />
                  <el-table-column label="备注" align="center" prop="remark" />
                  <el-table-column label="成本" align="center" prop="costPrice" />


                </el-table-column>

                <el-table-column label="商品用量" align="center" >
                  <el-table-column label="用量" prop="singleGroupNumber" align="center" >
                    <template #default="scope">
                      <span>
                        <el-input v-model="scope.row.singleGroupNumber"  type="number" maxlength="26" placeholder="请输入" size="mini"  />
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
                </el-table-column>

               <el-table-column>
                 <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                   <template #default="scope">

                     <el-button link type="danger" icon="delete" @click="removeOrderRow(scope.row)">移除</el-button>
                   </template>
                 </el-table-column>
               </el-table-column>
              </el-table>
              <el-row>
                <div  class="el-row is-justify-end el-row--flex">
                  <el-button link type="primary" icon="Plus" @click="addOriginlProduct">添加商品</el-button>

                  <button  type="button" class="el-button lc-success el-button--text el-button--mini"
                           style="font-size: 16px;padding-right: 3%;color: #67c23a!important" @click="addProductRow">
                    <span>+新增行</span>
                  </button></div>
              </el-row>


          </div>
        </div>
      </el-form>
    </el-row>

    <!--  商品选择框-->
    <el-dialog :title="title" v-model="openProduct" width="950px"  append-to-body >
      <!-- 查看商品详细对话框 -->
      <el-button style="margin-right: 10px" @click="submitProductList">确 定</el-button>
      <!--      //第二步:定义form表单-->
      <ProductTable  :productList="productList"
                     :productRows="productRows"
                     :radioSelect="radioSelect"
                     @queryProduct="childProductQuery"
                     @getSelectProduct="getChildProductList"
                     @getProductDetail="getChildProductDetail"
      >

      </ProductTable>

    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {getProduct, listProduct} from "../../../../api/erp/product";
import ProductTable from "../../../../components/zerp/table/productTable";
import {addBom, getBom, updateBom} from "../../../../api/erp/bom";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();
const title = ref("");

const loading = ref(false)
const orderBOMDetailFormShow = ref(true)
const openProduct = ref(false);
const radioSelect = ref(true)
const productList = ref([]);
const productRows = ref([]);
const bomTotalCount = ref(0); //
const bomTotalCost = ref(0); //

// Your reactive data

const data = reactive({
  form: ref({
    createTime: "",
    bomCostPrice: 0,
    productForm:ref({}),
    productList: ref([{
        product:{},
        costPrice: 2,
        singleGroupNumber: 0
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
// 当需要添加新行时触发的函数或事件处理程序
function addProductRow() {
  console.log("准备新增")
  // 创建一个空对象或空数据结构
  const rowNew = {};
  // 将新的空对象添加到数组中
  form.value.productList.push(rowNew);
}
//确定要移除这一行
const removeOrderRow = (row) => {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    const index = form.value.productList.findIndex(item => item === row);
    if (index !== -1) {
      form.value.productList.splice(index, 1);
    } else {
      alert('未找到对应行');
    }
  } else {
    alert('已取消移除');
  }
};

function addOriginlProduct(){
  console.log("开始添加原材料")
  radioSelect.value = false
  loading.value = true
  getProductList();
  productRows.value = []
  openProduct.value = true;
  title.value = "选择BOM原材料";
}

function submitBomForm(){
  console.log(form.value)
  if(bomId.value == null){
    addBom(form.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      getList();
    });
  }else{
    updateBom(form.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      getList();
    });
  }

  router.push("/bom");
}


function getBomTotalCost(){
  if (form.value.productList.length > 0) {
    let totalCount = 0;
    let totalCost = 0;
    form.value.productList.forEach((row) => {
      totalCount++;
      totalCost += row.singleGroupNumber * row.costPrice;
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

function getBomDetail(){
  getBom(bomId.value).then(response => {
    form.value = response.data;
    title.value = "修改bom物料";
  });
}

const displayTitleText = computed(() => {
  if (bomId.value == null) {
    return '新增BOM单';
  } else {
    return '修改Bom单';
  }
});


function addOrUpdate(){
  if(bomId.value==null){

  }else{
    getBomDetail()
  }
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


// 接收参数
const bomId = ref(route.query.bomId);


addOrUpdate()
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
  margin: 12px 0;
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
  font-family: '宋体', sans-serif !important;
}
.BomForm .el-input {
  font-size: 12px; /* 设置输入框字体大小为 14px */
  padding: 8px; /* 调整输入框内边距 */

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
  top: 8px; /* 调整蒙版顶部偏移 */
  bottom: 8px; /* 调整蒙版底部偏移 */
  left: 8px;
  right: 8px;
  z-index: 1;
  background-color: rgba(204, 219, 238, 0.43); /* 淡灰色 */
  box-sizing: border-box; /* 让蒙版尺寸包括 border 和 padding */
  padding: 1px; /* 调整蒙版内边距，使其与输入框内容更贴近 */
  border-radius: 4px; /* 添加圆角 */
}

.el-table .custom-header th {
  background-color: #e6f7ff !important;
}
</style>
