<template>
  <div >

    <el-table v-loading="props.loading" :data="props.salesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单编号1" align="center" prop="salesOrderCode" >
        <template #default="scope">
          <span
              style="color: rgba(40,177,232,0.72); ;  font-size: 12px;font-weight: bold;"
              @click="handleSalesDetailClick(scope.row)"
          >
            {{ scope.row.salesOrderCode }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="单据名称" align="center" prop="salesOrderName" />
      <el-table-column label="客户信息" align="center" prop="unit.unitName">

      </el-table-column>
      <el-table-column label="所属仓库" align="center" prop="warehouse.warehousePath" />
      <el-table-column label="订单交货日期" align="center" prop="salesOrderTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.salesOrderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单总金额" align="center" prop="salesTotalAmount" />

      <el-table-column align="center" label="审核状态" prop="auditId">
        <template #default="scope">
          <el-tooltip
              class="box-item"
              effect="dark"
              :content="tooltipAuditContent"
              placement="right"
              :style="{ 'max-height': '200px', 'overflow-y': 'auto' }"
          >
            <el-tag :type="{
            '0': 'info',       // 未审核状态
            '1': 'success',    // 审核通过状态
            '2': 'danger'      // 审核未通过状态
          }[scope.row.auditId]"
                    @mouseover="showAuditTooltip(scope.row)"> {{ salesAuditStatus(scope.row.auditId) }} </el-tag>
          </el-tooltip>

        </template>
      </el-table-column>
      <el-table-column label="订单进度" align="center" prop="orderProgress">
        <template #default="scope">
          <el-tag :type="{
            '0': 'info',       // 待生产
            '1': 'danger',    // 待出库
             '2': 'success'      // 已出库
          }[scope.row.orderProgress]"> {{ OrderProgress(scope.row.orderProgress) }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="收款状态" align="center" prop="receiptStatus" />
      <el-table-column label="订单备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" :disabled="props.single" @click="handleUpdate(scope.row)" >修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:sales:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="props.total>0"
        :total="props.total"
        v-model:page="props.queryParams.pageNum"
        v-model:limit="props.queryParams.pageSize"
        @pagination="getList"
    />

  </div>
</template>
<script setup>

import {getOrderAuditRecord} from "../../../api/erp/order";

const router = useRouter();
const route = useRoute();
const tooltipAuditContent = ref({})

// 接收父组件传递过来的值
import {defineEmits, defineProps} from "vue";
import {getAuditRecord} from "../../../api/erp/bom";
import {useRoute, useRouter} from "vue-router";

const props = defineProps({
  salesList:{
    type:Array,
    default:[]
  },
  queryParams:{
    type:Object,
    default:{}
  },
  total:{
    type:Number,
    default:0
  },
  single:{
    type:Boolean,
    default:true
   },
  selectPlanOrderShow:{
    type:Boolean,
    default:false
  },
  showSearch:{
    type:Boolean,
    default:false
  }
})
// 接收父组件传递过来的方法--------------------------------------------------------------------------
const emit = defineEmits(['handleUpdate','handleSelectionChange','handleDelete'])

function handleUpdate (row) {
  //调用父组件传递过来的方法，传入参数修改父组件的值
  emit('handleUpdate',row)
}
function handleSelectionChange(selection){
  emit('handleSelectionChange',selection)
}
function handleDelete(row){
   emit(('handleDelete',row))
}


/** 审核记录 */
const showAuditTooltip = (row) => {
  // 生成tooltip的内容，可以根据rowData的信息来设置tooltip内容
  if(row.auditId == 0){
    tooltipAuditContent.value = {}
    return;
  }
  getOrderAuditRecord(row.salesOrderId).then(response=>{
    tooltipAuditContent.value= response.data

    tooltipAuditContent.value = '审核人: '+tooltipAuditContent.value.userName +
        '  审核时间:'+ tooltipAuditContent.value.createTime +
        '  备注:'+tooltipAuditContent.value.auditRemark;
  })
};

//状态显示
function salesAuditStatus(auditId) {
  if (auditId === '0') {
    return '未审核'
  } else if (auditId === '1') {
    return '审核通过'
  } else if(auditId === '2'){
    return '审核不通过'
  }else {
    return '错误状态'
  }
}
function OrderProgress(status) {
  if (status === '0') {
    return '待处理'
  } else if (status === '1') {
    return '待出库'
  } else if(status === '2'){
    return '已出库'
  }else {
    return '已结束'
  }
}


function handleSalesDetailClick(row){

  router.push({
    path:'/salesManage/sales/salesDetail',
    query:{salesOrderId: row.salesOrderId}
  });
}
</script>

<style scoped>

</style>