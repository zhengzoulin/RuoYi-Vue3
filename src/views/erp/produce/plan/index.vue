<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" class="custom-form">
      <el-form-item   prop="planCode" v-show="showQuery">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入关键字"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划单号" prop="planCode" v-show="!showQuery">
        <el-input
            v-model="queryParams.planCode"
            placeholder="请输入计划单号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划单据名称" prop="planName" v-show="!showQuery">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入计划单据名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联单据号" prop="associatedCode" v-show="!showQuery">
        <el-input
          v-model="queryParams.associatedCode"
          placeholder="请输入关联单据号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品编号" prop="productCode" v-show="!showQuery">
        <el-input
          v-model="queryParams.productCode"
          placeholder="请输入商品编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产线id" prop="lineId" v-show="!showQuery">
        <el-input
          v-model="queryParams.lineId"
          placeholder="请输入生产线id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button class="el-button--text" @click="showQuery = !showQuery"><span>切换高级搜素</span></el-button>
      </el-form-item>
    </el-form>


    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
           @click="handleAdd"
          v-hasPermi="['erp:plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
           :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:plan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown class="el-dropdown-order" trigger="click"  @command="handleAuditCommand">
          <el-button type="primary" :disabled="auditDisabled"  style="width: 80px;">
            审核订单<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="1">审核通过</el-dropdown-item>
              <el-dropdown-item command="2">审核不通过</el-dropdown-item>

            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['erp:plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          @click="handleExport"
          v-hasPermi="['erp:plan:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Odometer"
            :disabled="production"
            @click="beganProduceClick"
            v-hasPermi="['erp:plan:edit']"
        >开始生产</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Odometer"
            :disabled="production"
            @click="beganMRP"
        >MRP计算</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <produceOrderTable
        :planList = "planList"
        :queryParams="queryParams"
        :total="total"
        :single="single"
        :tooltipAuditContent="tooltipAuditContent"
        @handleUpdate="handleUpdate"
        @handleSelectionChange="handleSelectionChange"
        @goProduceLine="goProduceLine"
    />


    <!-- 添加或修改生产管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="planRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计划单号" prop="planCode">
          <el-input v-model="form.planCode" placeholder="请输入计划单号" />
        </el-form-item>
        <el-form-item label="计划单据名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入计划单据名称" />
        </el-form-item>
        <el-form-item label="关联单据号" prop="associatedCode">
          <el-input v-model="form.associatedCode" placeholder="请输入关联单据号" />
        </el-form-item>
        <el-form-item label="bom单json" prop="bom">
          <el-input v-model="form.bom" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="计划日期" prop="planTime">
          <el-date-picker clearable
            v-model="form.planTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择计划日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品编号" prop="productCode">
          <el-input v-model="form.productCode" placeholder="请输入商品编号" />
        </el-form-item>
        <el-form-item label="商品json" prop="product">
          <el-input v-model="form.product" placeholder="请输入商品json" />
        </el-form-item>
        <el-form-item label="已生产数量" prop="produceNumber">
          <el-input v-model="form.produceNumber" placeholder="请输入已生产数量" />
        </el-form-item>
        <el-form-item label="未生产数量" prop="noProduceNumber">
          <el-input v-model="form.noProduceNumber" placeholder="请输入未生产数量" />
        </el-form-item>
        <el-form-item label="生产线id" prop="lineId">
          <el-input v-model="form.lineId" placeholder="请输入生产线id" />
        </el-form-item>
        <el-form-item label="生产线" prop="line">
          <el-input v-model="form.line" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="生产所属仓库" prop="warehouse">
          <el-input v-model="form.warehouse" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--    审核弹窗-->
    <AuditDialog
        :auditAddDTO="auditAddDTO"
        :openAudit = "openAudit"
        :AuditTitle="AuditTitle"
        @submitOrderAudit="submitOrderAudit"
    />

  </div>
</template>

<script setup name="Plan">
import { listPlan, getPlan, delPlan, addPlan, updatePlan } from "@/api/erp/plan";
import {useRoute, useRouter} from "vue-router";
import {addLineAudit} from "../../../../api/erp/line";
import {ref} from "vue";
import AuditDialog from "../../../../components/zerp/public/auditDialog";
import produceOrderTable from "../../../../components/zerp/table/produceOrderTable"
import {getAuditRecord} from "../../../../api/erp/bom";
import {beganProduce} from "../../../../api/erp/plan";

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const planList = ref([]);
const open = ref(false);
const openAudit = ref(false);
const auditAddDTO = ref({})
const tooltipAuditContent = ref({})

const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const production = ref(true)
const auditDisabled = ref(true);
const showQuery = ref(false);

const multiple = ref(false);
const total = ref(0);
const title = ref("");
const AuditTitle = ref("");


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planCode: null,
    planName: null,
    associatedCode: null,
    productCode: null,
    planStatus: null,
    lineId: "",
    warehouse: null,
    status: null,
  },
  rules: {
    associatedCode: [
      { required: true, message: "关联单据号不能为空", trigger: "blur" }
    ],
    productCode: [
      { required: true, message: "商品编号不能为空", trigger: "blur" }
    ],
    lineId: [
      { required: true, message: "生产线id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询生产管理列表 */
function getList() {
  loading.value = true;
  listPlan(queryParams.value).then(response => {
    planList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    planId: null,
    planCode: null,
    planName: null,
    associatedCode: null,
    bom: null,
    planTime: null,
    productCode: null,
    product: null,
    planStatus: null,
    produceNumber: null,
    noProduceNumber: null,
    lineId: null,
    line: null,
    warehouse: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("planRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
const selection = ref([])
const selectRowPlan = ref({})
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.planId);

  const array = ref(Array.from(selection));
  array.value.forEach(item => {
    selectRowPlan.value = item
  })
  multiple.value = !selection.length;
   if(selection.length ==  1){
    const auditId = selection.map(item => item.auditId)
     if(auditId == 0){
      auditDisabled.value = false;
      single.value = false;

    }else if(auditId == 1 && selection.map(item => item.planStatus)==0){
      production.value = false
    }else{
       auditDisabled.value = true;
       single.value = true
       production.value = true
    }
  }else{
     auditDisabled.value = true;
     single.value = true
     production.value = true
   }
  console.log(auditDisabled.value+" "+single.value+" "+production.value)

}

/** 新增按钮操作 */
function handleAdd() {
  reset();
   title.value = "添加生产管理";

  router.push("/produce/plan/addPlan");
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const planId = row.planId || ids.value

  router.push({
    path:'/produce/plan/addPlan',
    query:{planId : planId}
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["planRef"].validate(valid => {
    if (valid) {
      if (form.value.planId != null) {
        updatePlan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPlan(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _planIds = row.planId || ids.value;
  proxy.$modal.confirm('是否确认删除生产管理编号为"' + _planIds + '"的数据项？').then(function() {
    return delPlan(_planIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/plan/export', {
    ...queryParams.value
  }, `plan_${new Date().getTime()}.xlsx`)
}
/** 开始生产 */
function beganProduceClick(){
  const _planId = ids.value
  console.log(  selectRowPlan.value)
  if(selectRowPlan.value.planStatus === "0"){
    console.log(selectRowPlan.value)
    proxy.$modal.msgWarning("当前生产订单未领料");
  }
  loading.value = true;

//进行生产前物料统计
//   console.log(  selectRowPlan.value)

  // beganProduce(_planId).then(response=>{
  //   proxy.$modal.msgSuccess("生产启动成功");
  //   getList();
  // })
  loading.value = false
}
/** MRP计算 */
function beganMRP(){
  const _planId = ids.value
  alert("s")
  router.push({
    path:'/produce/plan/MRPCompute',
    query:{planId : _planId}
  });
}


//*****************************************************************
function goProduceLine(row){
  console.log(row.line.lineCode)
  console.log(row.line.warehouseId)

  router.push({
    path:'/produce/line',
    query:{lineCode : row.line.lineCode,
            warehouseId:row.line.warehouseId}
  });
}
//审核订单
const handleAuditCommand = (command) => {
  loading.value = true
  auditAddDTO.value.auditType = command;
  console.log(ids)
  ids.value.forEach((id) => {
    // 遍历 ids 数组中的每个元素，并赋值给 orderId
    auditAddDTO.value.orderId = id;
  });
  openAudit.value = true;

  if(auditAddDTO.value.auditType == 1){
    AuditTitle.value = "审核通过"
  }else{
    AuditTitle.value = "审核不通过"
  }

  console.log(AuditTitle.value+"ddd:"+ openAudit.value)
}
//提交审核
function submitOrderAudit(data){
   auditAddDTO.value = data
   addLineAudit(auditAddDTO.value).then(response => {
    proxy.$modal.msgSuccess("审核成功");
    getList();
  })
  openAudit.value = false;
  title.value = ""
  loading.value = false

}



function handlePlanDetailClick(row){

  router.push({
    path:'/produce/plan/planDetail',
    query:{planId : row.planId}
  });
}


// 在组件挂载前监听路由变化
onBeforeMount(() => {
  watch(
      () => route.fullPath,
      async () => {
        if (route.name === 'Plan') {
          // 使用 nextTick 确保在 DOM 更新后执行刷新数据的逻辑
          await nextTick();
          getList();
        }
      }
  );
});

getList();
</script>

<style lang="less"  >

/*表头行*/

.el-table__header-wrapper /deep/, .el-table__fixed-header-wrapper{
th {
  word-break: break-word;
  background-color: #406d8e;
  color: #0f3868;
  height: 40px;
  font-size: 13px;
  text-align: center;
  padding: 0;
}
}


.custom-form .el-form-item {
  margin-bottom: 12px; /* 调整表单项之间的间距 */
}

.custom-form .el-form-item .el-input {
  font-size: 12px; /* 调整输入框中的字体大小 */
}

.custom-form .el-button {
  font-size: 12px; /* 调整按钮中的字体大小 */
  padding-top: 6px; /* 调整按钮的内边距 */
  padding-bottom: 6px; /* 调整按钮的内边距 */
  margin-right: 8px; /* 调整按钮之间的间距 */
}
.custom-form .el-form-item .el-form-item__label {
  max-width: 100px; /* 设置 label 的最大宽度 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 不换行 */
}
.custom-form .el-button:last-child {
  margin-right: 0; /* 最后一个按钮不需要右边距 */
}
</style>
