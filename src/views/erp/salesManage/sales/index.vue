<template>
  <div class="app-container">
    <el-row>
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" class="custom-form">
        <el-form-item  prop="keyWord" v-show="showQuery">
          <el-input
              v-model="queryParams.keyWord"
              placeholder="请输入关键字"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="订单编号" prop="salesOrderCode" v-show="!showQuery">
          <el-input
              v-model="queryParams.salesOrderCode"
              placeholder="请输入订单编号"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="单据名称" prop="salesOrderName" v-show="!showQuery">
          <el-input
              v-model="queryParams.salesOrderName"
              placeholder="请输入单据名称"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="客户" prop="unitName" v-if="!showQuery">
          <el-select v-model="queryParams.unitId"  placeholder="请选择"  style="width: 185px;">
            <el-option
                v-for="item in unitOptions"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
                :disabled="item.status == 1"

            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标仓库" prop="warehouseName" v-if="!showQuery">
          <el-tree-select
              v-model="queryParams.warehouseId"
              :data="warehouseOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="请选择仓库"
              style="width: 170px"
          />
        </el-form-item>
        <el-form-item label="审核状态" prop="auditId" v-if="!showQuery">
          <el-select
              v-model="queryParams.auditId"
              placeholder="请选择审核状态"
              clearable
              style="width: 180px"
          >
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单进度" prop="orderProgress" v-if="!showQuery">
          <el-select
              v-model="queryParams.orderProgress"
              placeholder="请选择订单进度"
              clearable
              style="width: 175px"
          >
            <el-option label="待处理" value="0"></el-option>
            <el-option label="待出库" value="1"></el-option>
            <el-option label="已出库" value="2"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="制单人" prop="createBy" v-if="!showQuery">
          <el-select v-model="queryParams.createBy"  placeholder="请选择" style="width: 175px">
            <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
                :disabled="item.status == 1"

            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交货日期" v-if="!showQuery">
          <el-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
              unlink-panels
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              ref="queryRef"
              style="width: 220px;"
          />
        </el-form-item>


        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button class="el-button--text" @click="changeQuery"><span>切换高级搜素</span></el-button>
        </el-form-item>
      </el-form>

    </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['erp:sales:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:sales:edit']"
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
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['erp:sales:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['erp:sales:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Odometer"
            :disabled="MRPCalculate"
            @click="beganMRP"
        >出库库存计算</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <sales-order-table
        :salesList = "salesList"
        :total="total"
        :loading="loading"
        :queryParams="queryParams"
        @handleSelectionChange="handleSelectionChange"
        @handleUpdate="handleUpdate"
        @handleDelete="handleDelete"
    />

    <!-- 添加或修改销售订单管理对话框 -->
    <!--    审核弹窗-->
    <AuditDialog
        :auditAddDTO="auditAddDTO"
        :openAudit = "openAudit"
        :AuditTitle="AuditTitle"
        @submitOrderAudit="submitOrderAudit"
    />
  </div>
</template>

<script setup name="Sales">
import { listSales, getSales, delSales, addSales, updateSales } from "@/api/erp/sales";
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getOrderAuditRecord} from "../../../../api/erp/order";
import {addSalesAudit, getSalesAuditRecord} from "../../../../api/erp/sales";
import {addAddStockAudit} from "../../../../api/erp/addStock";
import AuditDialog from "../../../../components/zerp/public/auditDialog";
import {warehouseParentTreeSelect} from "../../../../api/erp/position";
import {listUnit} from "../../../../api/erp/unit";
import SalesOrderTable from "../../../../components/zerp/table/salesOrderTable";
import {listUser} from "../../../../api/system/user";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const salesList = ref([]);
 const userOptions =  ref([])
const open = ref(false);
const openAudit = ref(false);

const auditAddDTO = ref({})

const loading = ref(true);
const showSearch = ref(true);
const showQuery = ref(true);
const auditDisabled = ref(true);


const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const MRPCalculate = ref(true)
const total = ref(0);
const title = ref("");
const AuditTitle = ref("");

const tooltipAuditContent = ref({})
const unitOptions = ref([]);
const warehouseOptions = ref(undefined);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    salesOrderCode: null,
    salesOrderName: null,
    salesProducts: null,
    unit: null,
    warehouseId: null,
    warehouse: null,
    salesOrderTime: null,
    auditId: null,
    orderProgress: null,
    salesTotalAmount: null,
    currentReceiptAmount: null,
    receiptStatus: null,
    status: null,
  },
  rules: {
    salesOrderCode: [
      { required: true, message: "订单编号不能为空", trigger: "blur" }
    ],
    salesOrderName: [
      { required: true, message: "单据名称不能为空", trigger: "blur" }
    ],
    salesProducts: [
      { required: true, message: "出售商品信息不能为空", trigger: "blur" }
    ],
    unit: [
      { required: true, message: "客户信息不能为空", trigger: "blur" }
    ],
    warehouseId: [
      { required: true, message: "所属仓库不能为空", trigger: "blur" }
    ],
    warehouse: [
      { required: true, message: "仓库json不能为空", trigger: "blur" }
    ],
    auditId: [
      { required: true, message: "订单审核状态不能为空", trigger: "blur" }
    ],
    orderProgress: [
      { required: true, message: "订单进度(0待出库，1已出库)不能为空", trigger: "blur" }
    ],
    salesTotalAmount: [
      { required: true, message: "采购订单总金额不能为空", trigger: "blur" }
    ],
    currentReceiptAmount: [
      { required: true, message: "已收款金额不能为空", trigger: "blur" }
    ],
    receiptStatus: [
      { required: true, message: "收款状态 ： 未收款，部分收款，收款完成不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "订单状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询销售订单管理列表 */
function getList() {
  loading.value = true;
  listSales(queryParams.value).then(response => {
    salesList.value = response.rows;
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
    salesOrderId: null,
    salesOrderCode: null,
    salesOrderName: null,
    salesProducts: null,
    unit: null,
    warehouseId: null,
    warehouse: null,
    salesOrderTime: null,
    auditId: null,
    orderProgress: null,
    salesTotalAmount: null,
    currentReceiptAmount: null,
    receiptStatus: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("salesRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
   queryParams.value = {}

  handleQuery();
}
function changeQuery(){
  showQuery.value = !showQuery.value;
  queryParams.value = {}
  proxy.resetForm("queryRef");
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.salesOrderId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;

  if(selection.length ==  1){
    const auditId = selection.map(item => item.auditId)
     if(auditId == 0){
      auditDisabled.value = false;
      single.value = false;
    }else if(auditId == 1){
       MRPCalculate.value = false;
       auditDisabled.value = true;
       single.value = true;
     }else{
      auditDisabled.value = true;
      single.value = true
    }
  }else{
    auditDisabled.value = true;
    MRPCalculate.value = true;

  }
}
/** 查询user列表 */
function getUserList() {
  listUser().then(response => {
    userOptions.value = response.rows;
  });
}
/** 查询仓库下拉树结构 */
function getWarehouseTree() {
  warehouseParentTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};
/** 新增按钮操作 */
function handleAdd() {
  reset();
  // open.value = true;
  // title.value = "添加销售订单管理";
  router.push('/salesManage/sales/addSales')

}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _salesOrderId = row.salesOrderId || ids.value
  // getSales(_salesOrderId).then(response => {
  //   form.value = response.data;
  //   open.value = true;
  //   title.value = "修改销售订单管理";
  // });
  router.push({
    path:'/salesManage/sales/addSales',
    query:{salesOrderId : _salesOrderId}
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["salesRef"].validate(valid => {
    if (valid) {
      if (form.value.salesOrderId != null) {
        updateSales(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSales(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}


/** 查询往来单位列表 */
function getUnitList() {
  listUnit().then(response => {
    unitOptions.value = response.rows;
  });
}


/** 删除按钮操作 */
function handleDelete(row) {
  const _salesOrderIds = row.salesOrderId || ids.value;
  proxy.$modal.confirm('是否确认删除销售订单管理编号为"' + _salesOrderIds + '"的数据项？').then(function() {
    return delSales(_salesOrderIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/sales/export', {
    ...queryParams.value
  }, `sales_${new Date().getTime()}.xlsx`)
}

/** MRP库存计算 */
function beganMRP(){
  const _salesId = ids.value
  console.log(_salesId)
   router.push({
    path:'/produce/plan/MRPCompute',
    query:{salesId : _salesId}
  });
}
// 子组件交互**********************子组件交互**********************************子组件交互
//审核订单
const handleAuditCommand = (command) => {
  auditAddDTO.value.auditType = command;
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
}

//提交审核
function submitOrderAudit(data){
  auditAddDTO.value = data
  addSalesAudit(auditAddDTO.value).then(response => {
    proxy.$modal.msgSuccess("审核成功");
    getList();
  })
  openAudit.value = false;
  title.value = ""
}




getWarehouseTree()
getUnitList();
getUserList();

getList();
</script>

<style>
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
 }
.custom-form .el-form-item .el-form-item__label {
  max-width: 80px; /* 设置 label 的最大宽度 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 不换行 */
}
.custom-form .el-button:last-child {
  margin-right: 0; /* 最后一个按钮不需要右边距 */
}
</style>