<template>
  <div class="app-container" v-loading="loading">
    <!-- Header section with buttons -->
    <el-row class="header">
      <router-link to="/bom">
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
        <el-button type="warning" plain @click="handleUpdate"  :disabled="isAudited" >修改</el-button>
        <el-button type="primary" @click="pdfFunc" plain >打印</el-button>
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
            <el-descriptions border="true" column="3" size="large" class="my-descriptions" v-show="orderBOMDetailFormShow">
              <el-descriptions-item label="BOM表编号"  label-align="center">
                {{form.bomCode}}
              </el-descriptions-item>

              <el-descriptions-item label="单据名称"  label-align="center">
                {{form.bomName }}
                <el-button link type="primary"  icon="Edit"  @click=" " class="followButton"></el-button>
              </el-descriptions-item>

              <el-descriptions-item label="BOM表备注"  label-align="center">
                {{form.remark}}
              </el-descriptions-item>
              <el-descriptions-item label="交货日期"  label-align="center">
                {{form.createTime}}
              </el-descriptions-item>





            </el-descriptions>

          </div>
        </div>

        <!-- Bom成品信息 -->
        <div class="section" v-show="orderBOMDetailFormShow">
          <div class="section-header">
            Bom成品信息
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
              <el-descriptions-item label="目录"  label-align="center">{{form.catalogId}}</el-descriptions-item>
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

              <el-table
                  :data="form.productList"
                  v-loading="loading"
                >
                <el-table-column label="原材料商品信息"  align="center" >
                  <el-table-column type="selection" width="55" align="center" />
                  <el-table-column type="index" label="序号" width="55" align="center" />
                  <el-table-column label="商品编号" align="center" prop="productCode" />
                  <el-table-column label="商品名称" align="center" prop="productName" />
                  <el-table-column label="厂家型号" align="center" prop="productModel" />
                  <el-table-column label="封装" align="center" prop="encapStandard" />
                  <el-table-column label="品牌" align="center" prop="brand.brandName" />
                  <el-table-column label="备注" align="center" prop="remark" />
                  <el-table-column label="成本" align="center" prop="costPrice" />
                </el-table-column>

                <el-table-column label="商品用量" align="center" >
                  <el-table-column label="用量" prop="singleGroupNumber" align="center" >
                  </el-table-column>
                  <el-table-column label="预损耗量" prop="estimatedLoss" align="center">
                  </el-table-column>
                </el-table-column>

              </el-table>
          </div>
        </div>
      </el-form>
    </el-row>



    <div id="pdfDom" v-show="loading">
      <el-row style="justify-content: center;margin: 15px;font-size: 28px">   <span >{{form.bomCode}}表-{{form.createTime}}</span></el-row>

      <div class="description-container">
        <el-row style="justify-content: center;margin: 10px">   <span > BOM单基本信息</span></el-row>
        <el-descriptions border="true" column="3" size="large" class="my-descriptions" >
          <el-descriptions-item label="BOM表编号"  label-align="center">
            {{form.bomCode}}
          </el-descriptions-item>
          <el-descriptions-item label="单据名称"  label-align="center">
            {{form.bomName }}
           </el-descriptions-item>

          <el-descriptions-item label="BOM表备注"  label-align="center">
            {{form.remark}}
          </el-descriptions-item>
          <el-descriptions-item label="交货日期" label-align="center">
           {{form.createTime}}
          </el-descriptions-item>

        </el-descriptions>

      </div>
      <div class="description-container">
        <el-row style="justify-content: center;margin: 10px">   <span > BOM成品信息</span></el-row>
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
          <el-descriptions-item label="目录"  label-align="center">{{form.catalogId}}</el-descriptions-item>
          <el-descriptions-item label="备注"  label-align="center">{{form.productForm.remark}}</el-descriptions-item>
          <el-descriptions-item label="套数"  label-align="center">{{form.groupNumber}}</el-descriptions-item>

        </el-descriptions>
      </div>

      <div >
        <el-row style="justify-content: center;margin-top: 10px">   <span > Bom用料信息</span></el-row>
        <el-table
            :data="form.productList"
             class="el-table"
        >
          <el-table-column label="原材料商品信息"  align="center" >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column label="商品编号" align="center" prop="productCode" />
            <el-table-column label="商品名称" align="center" prop="productName" />
            <el-table-column label="厂家型号" align="center" prop="productModel" />
            <el-table-column label="封装" align="center" prop="encapStandard" />
            <el-table-column label="品牌" align="center" prop="brand.brandName" />
            <el-table-column label="成本" align="center" prop="costPrice" />
          </el-table-column>
          <el-table-column label="商品用量" align="center" >
            <el-table-column label="用量" prop="singleGroupNumber" align="center" >
            </el-table-column>
            <el-table-column label="预损耗量" prop="estimatedLoss" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" />


        </el-table>
      </div>



    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import {getProduct, listProduct} from "../../../../api/erp/product";
import ProductTable from "../../../../components/zerp/table/productTable";
import {addBom, getBom, updateBom} from "../../../../api/erp/bom";
import {useRoute, useRouter} from "vue-router";
import htmlToPdf from "../../../../utils/htmlToPdf";
const { proxy } = getCurrentInstance();

const router = useRouter();
const route = useRoute();
const title = ref("");

const loading = ref(false)
const orderBOMDetailFormShow = ref(true)
const isAudited = ref(false)
const radioSelect = ref(true)
const productList = ref([]);
const productRows = ref([]);
const bomTotalCount = ref(0);
const bomTotalCost = ref(0);

// Your reactive data
const pdfFunc = () => {

  loading.value = true;
  // 调用htmlToPdf工具函数
  setTimeout(() => {
    let fileName = form.value.bomCode+'表-'+form.value.createTime
    htmlToPdf.getPdf(fileName);  }, 100);
  // 定时器模拟按钮loading动画的时间
  setTimeout(() => {
    proxy.$modal.msgSuccess("导出成功");
    loading.value = false;
  }, 1000);
}

const data = reactive({
  form: ref({
    createTime: "",
    bomCostPrice: 0,
    productForm:ref({
      brand:{
        brandName:''
      }
    }),
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
/** 修改按钮操作 */
function handleUpdate() {
  const _bomId = bomId.value

  router.push({
    path:'/bom/addBom',
    query:{bomId : _bomId}
  });
  console.log("sss"+_bomId)
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
function getBomRow(){
  console.log("getgetget")
  getBom(bomId.value).then(response => {
    form.value = response.data;

    if(form.value.auditId === "1"){
      isAudited.value = true;
    }
    title.value = "bom物料";
  });
}

// 接收参数
const bomId = ref(route.query.bomId);


getBomRow()
</script>

<style >


.header {
  justify-content: space-between;
  margin-bottom: 9px;
  padding-right: 2%;
}

.form-section {
  width: 100%;

  /*background-color: #f9f9f9;*/
  padding: 0px 1px 2px 5px;
  border-radius: 8px;
  margin-bottom: 5px;
}



.section-header {
  width: 100%;
  font-weight: bold;
  display: flex;
  font-size: 15px;
  margin: 12px 0;
  padding-bottom: 1px;
  border-bottom: 1px dashed #d8dce5;
  /*justify-content: space-between;*/
}
.section-content{
  font-size: 18px;
}
.followButton{
  margin-left: 14px;
  font-size: 12px;
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

</style>
