<template>
  <div>
    <el-button  style="margin-right: 10px" @click="submitProductList">确 定</el-button>

    <el-form :model="queryProductParams" ref="queryProductRef"
             :inline="true"
             v-show="showSearch"
             label-width="90px"
             label-position="left"
             style="width: 100%;
                  margin-left: 30px; display:flex;align-items: center;justify-content: center"
    >

      <el-form-item label="商品编号" prop="productCode">
        <el-input
            v-model="queryProductParams.productCode"
            placeholder="请输入商品编号"
            clearable
            @keyup.enter="handleProductQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input
            v-model="queryProductParams.productName"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter="handleProductQuery"
        />
      </el-form-item>
      <el-form-item label="商品来源" prop="productSource">
        <el-input
            v-model="queryProductParams.productSource"
            placeholder="请输入商品来源"
            clearable
            @keyup.enter="handleProductQuery"
        />
      </el-form-item>

      <el-form-item>
        <div style="display: flex;justify-content: center;align-items: center">
          <el-button type="primary" icon="Search" @click="handleProductQuery1">搜索</el-button>
          <el-button icon="Refresh" @click="resetProductQuery">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="props.productList" style="height: 380px" @selection-change="handleDemandSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品编号" align="center" prop="productCode" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="商品图片" prop="productImage" align="center" >
        <template  #default="scope" width="100">
          <ImagePreview style="width:70px;height:60px;" :src="scope.row.productImage" />
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center" prop="brand.brandName" />
      <el-table-column label="描述" align="center" prop="productIntro" />
      <el-table-column label="厂家型号" align="center" prop="productModel" />
      <el-table-column label="商品来源" align="center" prop="productSource" />
      <el-table-column label="录入方式" align="center" prop="productAddOrigin" />
      <el-table-column label="重量" align="center" prop="productWeight" />
      <el-table-column label="封装规格" align="center" prop="encapStandard" />
      <el-table-column label="成本价" align="center" prop="costPrice" />
      <el-table-column label="售价" align="center" prop="salePrice" />
      <el-table-column label="包装单位" align="center" prop="minpacketUnit" />
      <el-table-column label="包装数量" align="center" prop="minpacketNumber" />
      <el-table-column align="center" label="商品状态" prop="status">
        <template #default="scope">
          <el-tag :type="scope.row.status == '0' ?'success':'warning'"> {{ formatStatus(scope.row.status) }} </el-tag>
        </template>
      </el-table-column>
      <!--          <el-table-column label="备注" align="center" prop="remark" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220px">
        <template #default="scope">
          <el-button link type="primary" icon="list" @click="handleProductDetail(scope.row)" v-hasPermi="['erp:product:edit']">详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryProductParams.pageNum"
        v-model:limit="queryProductParams.pageSize"
        @pagination="getProductList"
    />
  </div>

</template>

<script setup>
// 从 vue 中引入defineProps, defineEmits
import {defineProps, defineEmits, ref} from 'vue'
import {listProduct} from "../../../api/erp/product";

const loading = ref(false);
const rowData = ref();
const queryProductParams = ref({
    pageNum: 1,
    pageSize: 100,
    brandId: null,
    productId: null,
    catalogId: null,
    productCode: null,
    productName: null,
    productSource: null,
    productAddOrigin: null,
    status: null,
    statusValue: false
})

// 接收父组件传递过来的值
const props = defineProps({
  productList:{
    type:Array,
    default:[]
  },
  productRows:{
    type:Array,
    default:[]
  }
})

function reset(){
  queryProductParams.value = {
    pageNum: 1,
    pageSize: 100,
    brandId: null,
    productId: null,
    catalogId: null,
    productCode: null,
    productName: null,
    productSource: null,
    productAddOrigin: null,
    status: null,
    statusValue: false
  }
}


// 接收父组件传递过来的方法--------------------------------------------------------------------------
const emit = defineEmits(['queryProduct','getSelectProduct','getProductDetail'])

function handleProductQuery1 () {
  //调用父组件传递过来的方法，传入参数修改父组件的值
  emit('queryProduct', queryProductParams.value)
}
function submitProductList(){
  emit('getSelectProduct', props.productRows)
}
function handleProductDetail(row){
  rowData.value = row
  emit('getProductDetail', rowData.value)
}
//-----------------------------------------------------------------------------------------------


// 当表格选择项发生变化时会触发该事件
const handleDemandSelectionChange = (val) => {
  if (val) {
    val.forEach((row) => {
      if (row && !props.productRows.some(item => item.productId === row.productId)) {
        props.productRows.push(row);
      }
    });
  }
}

/** 重置商品按钮操作 */
function resetProductQuery() {
    reset();
  handleProductQuery1()
}
//状态显示
function formatStatus(status) {
  if (status === '0') {
    return '已启用'
  } else if (status === '1') {
    return '已停用'
  } else {
    return '错误状态'
  }
}

</script>

<style scoped>

</style>