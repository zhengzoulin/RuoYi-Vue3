<template>


  <div>
    <el-table v-loading="props.loading" :data="props.orderList" :style="props.tableStyle" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"  />
      <el-table-column label="订单编号" align="center"  >
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
      <el-table-column label="单据名称" align="center" prop="purchaseOrderName" />
      <el-table-column label="供应商" align="center" prop="unit.unitName" />
      <el-table-column label="所属仓库" align="center" prop="warehouse.warehousePath" />

      <el-table-column align="center" label="审核状态" prop="auditId">
        <template #default="scope">
          <el-tooltip
              class="box-item"
              effect="dark"
              :content="props.tooltipAuditContent"
              placement="right"
              :style="{ 'max-height': '200px', 'overflow-y': 'auto' }"
          >
            <el-tag :type="{
            '0': 'info',       // 未审核状态
            '1': 'success',    // 审核通过状态
            '2': 'danger'      // 审核未通过状态
          }[scope.row.auditId]"
                    @mouseover="showAuditTooltip(scope.row)"> {{ orderAuditStatus(scope.row.auditId) }} </el-tag>
          </el-tooltip>

        </template>
      </el-table-column>
      <el-table-column label="订单交货日期" align="center" prop="purchaseOrderTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.purchaseOrderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购订单总金额" align="center" prop="purchaseAllAmount" />
      <el-table-column align="center" label="付款状态" prop="paymentId">
        <template #default="scope">
          <el-tag :type="{
            '0': 'info',       // 未审核状态
            '1': 'success',    // 审核通过状态
            '2': 'danger'      // 审核未通过状态
          }[scope.row.paymentId]"> {{ orderPayStatus(scope.row.paymentId) }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单进度" align="center" prop="orderProgress" />

      <el-table-column label="订单备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="props.disabledOper">
        <template #default="scope">
          <el-button :disabled="props.single" link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:order:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:order:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script  setup>

//状态显示
import {defineEmits, defineProps} from "vue";

function orderPayStatus(paymentId) {
  if (paymentId === '0') {
    return '未付款'
  } else if (paymentId === '1') {
    return '已付款'
  } else if(paymentId === '2'){
    return '部分付款'
  }else {
    return '错误状态'
  }
}
//状态显示
function orderAuditStatus(auditId) {
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


// *********************
// 接收父组件传递过来的值
const props = defineProps({
  tooltipAuditContent:{
    type:Object,
    default:{}
  },
  loading:{
    type:Boolean,
    default: true
  },
  orderList:{
    type:Array,
    default:[]
  },
  tableStyle:{
    type:Object
  },
  single:{
    type:Boolean,
    default: true
  },
  disabledOper:{
    type: Boolean,
    default: true
  }
})


// 接收父组件传递过来的方法--------------------------------------------------------------------------
const emit = defineEmits(['handleSelectionChange','handleOrderDetailClick','showAuditTooltip','handleUpdate'])

function handleSelectionChange(selection){
  emit('handleSelectionChange', selection)
}
function handleOrderDetailClick(row){
  emit('handleOrderDetailClick', row)
}
function showAuditTooltip(row){
  emit('showAuditTooltip', row)
}
function handleUpdate(row){
  emit('handleUpdate', row)
}
//-----------------------------------------------------------------------------------------------


</script>




<style scoped>



</style>