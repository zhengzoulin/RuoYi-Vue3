<template>
<div class="app-container">
  <el-table v-loading="loading" :data="props.planList"  @selection-change="handleSelectionChange" class="el-table">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="计划单号" align="center" prop="planCode" width="120px">
      <template #default="scope">
        <!-- 使用 <a> 标签来包装数据，并添加样式 -->
        <a
            href="#"
            style="color: rgba(40,177,232,0.83); text-decoration: underline; font-size: 12px"
            @click="handlePlanDetailClick(scope.row)"
        >
          {{ scope.row.planCode }}
        </a>
      </template>
    </el-table-column>
    <el-table-column label="单据名称" align="center" prop="planName" />
    <el-table-column label="计划日期" align="center" prop="planTime" width="160px">
      <template #default="scope">
        <span>{{ parseTime(scope.row.planTime, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="成品编号" align="center" prop="productForm.productCode" />
    <el-table-column label="厂家型号" align="center" prop="productForm.productModel" />
    <el-table-column label="封装规格" align="center" prop="productForm.encapStandard" />


    <el-table-column label="所属仓库" align="center" prop="warehouse.warehousePath" />
    <el-table-column label="生产线" align="center" prop="line.lineName">

    </el-table-column>
    <el-table-column label="生产状态" align="center" prop="planStatus">
      <template #default="scope">
        <el-tag :type="{
            '0': 'info',       // 未状态
            '1': 'warning',    // 已领料状态
            '2': 'danger',    // 正在生产状态
            '3': 'success',    // 完成状态

          }[scope.row.planStatus]" @click="goProduceLine(scope.row)"> {{ PlanStatus(scope.row.planStatus) }} </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="入库状态" align="center" prop="status">
      <template #default="scope">
        <el-tag :type="{
            '0': 'info',       // 待生产
            '1': 'danger',    // 待入库
             '2': 'success'      // 已入库
          }[scope.row.status]"> {{ addStocktatus(scope.row.status) }} </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="已生产数量" align="center" prop="produceNumber" />
    <el-table-column label="未生产数量" align="center" prop="noProduceNumber" />
    <el-table-column label="审核状态" align="center" prop="auditId">
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
                  @mouseover="showAuditTooltip(scope.row)"> {{ AuditStatus(scope.row.auditId) }} </el-tag>
        </el-tooltip>

      </template>
    </el-table-column>
    <el-table-column label="备注" align="center" prop="remark" />
    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="props.selectPlanOrderShow">
      <template #default="scope">
        <el-button link type="primary" icon="Edit" :disabled="props.single" @click="handleUpdate(scope.row)" v-hasPermi="['erp:plan:edit']">修改</el-button>
        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:plan:remove']">删除</el-button>
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

const tooltipAuditContent = ref({})

// 接收父组件传递过来的值
import {defineEmits, defineProps} from "vue";
import {getAuditRecord} from "../../../api/erp/bom";

const props = defineProps({
  planList:{
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
  }
})
// 接收父组件传递过来的方法--------------------------------------------------------------------------
const emit = defineEmits(['handleUpdate','handleSelectionChange','getProductDetail','goProduceLine'])

function handleUpdate (row) {
  //调用父组件传递过来的方法，传入参数修改父组件的值
  emit('handleUpdate',row)
}
function handleSelectionChange(selection){
  emit('handleSelectionChange',selection)
}
function goProduceLine(row){
  emit('goProduceLine',row)
}

/** 审核记录 */
const showAuditTooltip = (row) => {
  // 生成tooltip的内容，可以根据rowData的信息来设置tooltip内容
  if(row.auditId == 0){
    tooltipAuditContent.value = {}

    return;
  }
  getAuditRecord(row.planId).then(response=>{
    tooltipAuditContent.value= response.data

    tooltipAuditContent.value = '审核人: '+tooltipAuditContent.value.userName +
        '  审核时间:'+ tooltipAuditContent.value.createTime +
        '  备注:'+tooltipAuditContent.value.auditRemark;

    console.log(tooltipAuditContent.value)
  })
};
//状态显示
function PlanStatus(planId) {
  if (planId === '0') {
    return '待领料'
  } else if (planId === '1') {
    return '已领料'
  } else if(planId === '2'){
    return '正在生产'
  }else if(planId === '3'){
    return '生产完成'
  }
  else {
    return '错误状态'
  }
}
function addStocktatus(status) {
  if (status === '0') {
    return '待生产'
  } else if (status === '1') {
    return '待入库'
  } else if(status === '2'){
    return '已入库'
  }else {
    return '错误状态'
  }
}
//状态显示
function AuditStatus(auditId) {
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

function handlePlanDetailClick(row){

  router.push({
    path:'/produce/plan/planDetail',
    query:{planId : row.planId}
  });
}
</script>

<style scoped>

</style>