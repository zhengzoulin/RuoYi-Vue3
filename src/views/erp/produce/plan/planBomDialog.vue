<template>
<div>
  <el-dialog :title="title" v-model="props.openPlanAdd" :width="dialogWidth" style="height: 43%" append-to-body>

    <!--      //第一步:定义出4个步骤-->
    <el-steps :active="active" finish-status="success">
      <el-step title="第一步" />
      <el-step title="第二步" />
    </el-steps>

    <!--      //第二步:定义form表单-->
    <el-form
        ref="demandRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        style="width: 850px;
          margin-left: 30px">

      <!--        //第三步:定义4个盒子对象active => 1 到 4-->
      <div v-show="active === 1">
        <el-row>

          <el-form :model="props.queryBom" ref="queryRef" :inline="true" label-width="75px" class="custom-form">
            <el-form-item  prop="bomKey" label="关键字">
              <el-input
                  v-model="props.queryBom.keyWord"
                  placeholder="请输入关键字"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="bom编号" prop="bomCode" >
              <el-input
                  v-model="props.queryBom.bomCode"
                  placeholder="请输入bom编号"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="成品编号" prop="bomProductId" >
              <el-input
                  v-model="props.queryBom.bomProductId"
                  placeholder="请输入成品编号"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="成品商品" prop="bomProductId" >
              <el-input
                  v-model="props.queryBom.bomProductId"
                  placeholder="请输入成品编号"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>


            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetBOMQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-row>


        <el-table v-loading="loading" :data="props.bomList" @selection-change="handleBomSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="bom编号" align="center" width="120" prop="bomCode">
            <template #default="scope">
              <!-- 使用 <a> 标签来包装数据，并添加样式 -->
              <a
                  href="#"
                  style="color: rgba(40,177,232,0.83); text-decoration: underline; font-size: 12px"
                  @click="handleBomDetailClick(scope.row)"
              >
                {{ scope.row.bomCode }}
              </a>
            </template>
          </el-table-column>
          <el-table-column label="成品编号" align="center" prop="productForm.productCode" />
          <el-table-column label="成品商品" align="center" prop="productForm.productName" />
          <el-table-column label="厂家型号" align="center" prop="productForm.productModel" />
          <el-table-column label="封装规格" align="center" prop="productForm.encapStandard" />
          <el-table-column label="品牌名称" align="center" prop="productForm.brand.brandName" />
          <el-table-column label="创建时间" align="center" prop="createTime" />
          <el-table-column label="备注" align="center" prop="remark" />
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
          <el-table-column label="bom状态" align="center" prop="status" />
          <el-table-column label="单据名称" align="center" prop="bomName" />
          <el-table-column label="bom总金额" align="center" prop="bomCostPrice" />


        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="props.queryBom.pageNum"
            v-model:limit="props.queryBom.pageSize"
            @pagination="getList"
        />
      </div>
      <div v-show="active === 2" style="align-items: center">
        <div style="padding-left: 10%">
          <el-form-item label="计划套数" prop="groupNumber">
            <el-input
                v-model="form.groupNumber"
                placeholder="请输入生产线id"
                clearable
                style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="选择目标仓库" prop="warehouseId">
            <el-tree-select
                v-model="form.warehouseId"
                :data="props.warehouseOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                placeholder="请选择仓库"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!--      第五步:设置上一步和下一步的按钮-->
    <el-button v-if="active === 2" style="margin-left: 18%;margin-top: 20px" @click="preStep" >上一步</el-button>

    <el-button v-if="active === 1" style="margin-top: 20px;margin-left: 85%" @click="nextStep" :disabled="single">下一步</el-button>
    <el-button v-if="active === 2" style="margin-top: 20px;" @click="submitBomSelect">确 定</el-button>

  </el-dialog>


</div>
</template>

<script setup>




// 接收父组件传递过来的值
import {defineEmits, defineProps, ref} from "vue";
import {getAuditRecord} from "../../../../api/erp/bom";

 const single = ref(true)
 const active =ref(1);
const dialogWidth = ref('950px')
const tooltipAuditContent = ref({})

const data = reactive({
  form : ref({
    groupNumber : 0,
    warehouseId : null,
    productForm:ref({
      productName : null
    }),
    productList: ref([{
      product:{},
      costPrice: 2,
      usageAmount: 0
    }
    ])
  }),
    bomRow : ref({
      bomId: null,
    productForm:ref({
      productName : null
    }),
    productList: ref([{
      product:{},
      costPrice: 2,
      usageAmount: 0
    }])
  })

 });

const {   form,bomRow } = toRefs(data);
 const rules = ref({
  groupNumber: [
    { required: true, message: "套数不能为空", trigger: "blur" }
  ],
  warehouseId: [
    { required: true, message: "目标仓库不能为空", trigger: "blur" }
  ]
})


const props = defineProps({
  bomList:{
    type:Array,
    default:[]
  },
  queryBom:{
    type:Object,
    default:{}
  },
  openPlanAdd:{
    type:Boolean,
    default:true
  },
  warehouseOptions:{
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

function resetBOMQuery(){
  emit('resetBOMQuery')}

// 接收父组件传递过来的方法--------------------------------------------------------------------------
const emit = defineEmits(['submitBomSelect','queryBomSelect','getSelectProduct','showBomDetail','resetBOMQuery'])

function handleQuery () {
  //调用父组件传递过来的方法，传入参数修改父组件的值
  emit('queryBomSelect',props.queryBom)
}
 
function showBomDetail(row){
  bomList.value = row
  emit('showBomDetail', rowData.value)
}

// 当表格选择项发生变化时会触发该事件
function handleBomSelectionChange(val){
  if (val) {
    val.forEach((row) => {
        bomRow.value = row;
    });
  }
  if (bomRow.value != null){
    single.value = false
  }
}
/** 分布弹窗选择Bom单 */
function submitBomSelect(){

  form.value.productForm = bomRow.value.productForm;
  form.value.productList = bomRow.value.productList;
  form.value.bomId = bomRow.value.bomId;



  emit('submitBomSelect',form)

}

//-----------------------------------------------------------------------------------------------

/** 重置商品按钮操作 */
function resetProductQuery() {
  reset();
  handleQuery()
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
/** 审核记录 */
const showAuditTooltip = (row) => {
  // 生成tooltip的内容，可以根据rowData的信息来设置tooltip内容
  if(row.auditId == 0){
    return;
  }
  getAuditRecord(row.bomId).then(response=>{
    tooltipAuditContent.value= response.data

    tooltipAuditContent.value = '审核人: '+tooltipAuditContent.value.userName +
        '  审核时间:'+ tooltipAuditContent.value.createTime +
        '  备注:'+tooltipAuditContent.value.auditRemark;

    console.log(tooltipAuditContent.value)
  })
};
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

// 步骤条下一步的方法
function nextStep() {
  dialogWidth.value = '600px'
  active.value += 1;
  if (active > 2){
    active.value = 1
  }
}
// 步骤条上一步的方法
function preStep() {
  dialogWidth.value = '950px'
  active.value--;
  if (active < 1){
    active.value = 1
  }
}




</script>

<style scoped>

</style>