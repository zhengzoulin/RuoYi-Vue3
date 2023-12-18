


<template>


  <div>
      <span > 采购订单基本信息
        <el-button link type="primary" icon="list" @click="changeOrderShow()" > {{ orderDetailShow ? '收起' : '详细' }}</el-button>
      </span>

    <el-form ref="orderRef" v-show="orderDetailShow"  :model="form" :rules="rules" :inline="true" label-width="80px"
             style="border-top: dashed 1.3px rgba(187,199,191,0.35) ;padding: 8px">
      <el-row>
        <el-form-item label="订单编号" prop="purchaseOrderCode" class="select-container" >
          <el-input v-model="form.purchaseOrderCode" placeholder="保存后自动生成" class="readonly-tree-select" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="下单日期" prop="createTime" class="select-container">
          <el-input v-model="form.createTime" placeholder="" class="readonly-tree-select"  style="width: 180px;"/>
        </el-form-item>

        <el-form-item label="目标仓库" prop="warehouseName" class="select-container">
          <el-tree-select
              v-model="form.warehouseId"
              :data="warehouseOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="请选择仓库"
              check-strictly
              class="readonly-tree-select"
              style="width: 160px;"
          />
        </el-form-item>
        <el-form-item label="供应商1" prop="unitName">
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
        <el-form-item label="交货日期" prop="purchaseOrderTime">
          <el-date-picker clearable
                          v-model="form.purchaseOrderTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择订单交货日期"
                          style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单据名称" prop="purchaseOrderName">
          <el-input v-model="form.purchaseOrderName" placeholder="请输入单据名称" style="width: 180px;" />
        </el-form-item>


        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="text" placeholder="请输入" style="width: 180px;"/>
        </el-form-item>
      </el-row>
    </el-form>

    <span > 采购订单商品信息  </span>
    <br>

    <span style="margin-top:100px"> 采购种数： {{productListSize}}        采购总额：{{form.purchaseAllAmount}}</span>
    <el-table v-loading="loading"
              :data="form.demandProductsList"
              :rules="rules"
              height="350"
              @cell-click="tabClick">

      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品编号" align="center" prop="product.productCode" />
      <el-table-column label="商品信息" align="center">
        <template #default="scope">
          <span style="display: block;">商品:{{ scope.row.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
          <span style="display: block;">最小包装数量:{{ scope.row.minpacketNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" prop="product.productImage" align="center" >
        <template  #default="scope" width="90">
          <ImagePreview style="width:60px;height:60px;" :src="scope.row.productImage" />
        </template>
      </el-table-column>
      <el-table-column label="需求数量" align="center" prop="demandNumber" />
      <el-table-column label="采购价" align="center" prop="costPrice" />
      <el-table-column label="金额" align="center" prop="orderMoney" />

      <!--        <el-table-column label="需求数量" prop="demandNumber" >-->
      <!--          <template #default="scope">-->
      <!--            <span>-->
      <!--              <el-input v-model="scope.row.demandNumber" @input="calculateorderMoney(scope.row)" type="number" maxlength="26" placeholder="请输入需求" size="mini"  />-->
      <!--            </span>-->
      <!--          </template>-->
      <!--        </el-table-column>-->

      <!--        <el-table-column label="金额" prop="orderMoney" class="select-container">-->
      <!--          <template #default="scope">-->
      <!--            <span>-->
      <!--              <span class="readonly-tree-select">{{ scope.row.orderMoney ? scope.row.orderMoney : '0.00' }}</span>-->
      <!--            </span>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <el-table-column label="备注" prop="remark">

      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="list" @click="handleProductDetail(scope.row)" >详细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


</template>





<script setup>
import {defineProps, defineEmits, ref} from 'vue'


const loading = ref(false);
const orderDetailShow = ref(true);
const rowData = ref();


// 接收父组件传递过来的值
const props = defineProps({

  form:{
    type: Object,
    required: true,
    default: () => ({})
  },
  productListSize:{
    type: [String, Number],
    default: 0,
    required: true
  },
  warehouseOptions:{
    type: Object,
    required:true,
    default: () => ({})
  },
  unitOptions:{
    type: Object,
    required:true,
    default: () => ({})
  }
})

// 接收父组件传递过来的方法--------------------------------------------------------------------------
const emit = defineEmits(['getProductDetail'])


function handleProductDetail(row){
  rowData.value = row
  emit('getProductDetail', rowData.value)
}


/** 搜索按钮操作 */
function changeOrderShow() {
  orderDetailShow.value = !orderDetailShow.value;
}
</script>

<style scoped>

</style>