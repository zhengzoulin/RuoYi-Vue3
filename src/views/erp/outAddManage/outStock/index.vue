<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="75px" class="custom-form">
      <el-form-item  prop="keyWord" v-show="showQuery">
        <el-input
            v-model="queryParams.keyWord"
            placeholder="请输入关键字"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出库单号" prop="outStockCode" v-if="!showQuery">
        <el-input
          v-model="queryParams.outStockCode"
          placeholder="请输入出库单号"
          clearable
          @keyup.enter="handleQuery"
          style="width: 180px;"

        />
      </el-form-item>
      <el-form-item label="单据名称" prop="outStockName" v-if="!showQuery">
        <el-input
          v-model="queryParams.outStockName"
          placeholder="请输入单据名称"
          clearable
          @keyup.enter="handleQuery"
          style="width: 185px;"
        />
      </el-form-item>
      <el-form-item label="收货方" prop="unitName" v-if="!showQuery">
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
      <el-form-item label="出库仓库" prop="warehouseName" v-if="!showQuery" style="width: 290px">
        <el-tree-select
            v-model="queryParams.warehouseId"
            :data="warehouseOptions"
            :props="{ value: 'id', label: 'label', children: 'children' }"
            value-key="id"
            placeholder="请选择仓库"

        />
      </el-form-item>
      <el-form-item label="审核状态" prop="auditId" v-if="!showQuery">
        <el-select
            v-model="queryParams.auditId"
            placeholder="请选择审核状态"
            clearable
            style="width: 170px"
        >
          <el-option label="未审核" value="0"></el-option>
          <el-option label="审核通过" value="1"></el-option>
          <el-option label="审核未通过" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="制单人" prop="createBy" v-if="!showQuery">
        <el-select v-model="queryParams.createBy"  placeholder="请选择" style="width: 180px">
          <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
              :disabled="item.status == 1"

          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="日期" v-if="!showQuery"  >
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">

        <el-dropdown class="el-dropdown-order" trigger="click"  >
          <el-button type="primary"   style="width: 80px;">
            新增<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleAdd">新增出库单</el-dropdown-item>
              <el-dropdown-item @click="handSalesOutOrder">新增销售出库单</el-dropdown-item>
              <el-dropdown-item @click="handlePlanOutOrder">新增生产领料出库单</el-dropdown-item>
              <el-dropdown-item @click="handlePurchaseReturnOutOrder">新增采购退货出库单</el-dropdown-item>

              <el-dropdown-item >新增调拨出库单</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:outStock:edit']"
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
          v-hasPermi="['erp:outStock:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['erp:outStock:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="outStockList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="出库单号" align="center">
      <template #default="scope">
        <a
            href="#"
            style="color: rgba(40,177,232,0.83); text-decoration: underline;"
            @click="handleOutStockDetailClick(scope.row)"
        >
          {{ scope.row.outStockCode }}
        </a>
      </template>
      </el-table-column>
      <el-table-column label="单据名称" align="center" prop="outStockName" />

      <el-table-column label="出库类型" align="center" prop="outStockType" />
      <el-table-column label="出库仓库" align="center" prop="warehouse.warehousePath" />
      <el-table-column label="收货方" align="center" prop="unit.unitName" />

      <el-table-column label="出库日期" align="center" prop="outStockTime" />
<!--      <el-table-column label="发货方" align="center" prop="unit.unitName" />-->
      <el-table-column label="操作人" align="center" prop="createBy" />

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
                    @mouseover="showAuditTooltip(scope.row)"> {{ outStockAuditStatus(scope.row.auditId) }} </el-tag>
          </el-tooltip>

        </template>
      </el-table-column>

      <el-table-column label="创建日期" align="center" prop="createTime" />
      <el-table-column label="订单备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button  :disabled="single" link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:outStock:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:outStock:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />


<!--    审核弹窗-->
    <AuditDialog
        :auditAddDTO="auditAddDTO"
        :openAudit = "openAudit"
        :AuditTitle="AuditTitle"
        @submitOrderAudit="submitOrderAudit"
    />




  </div>
</template>

<script setup name="OutStock">
import {ref} from "vue";
import {addOrderAudit, getOrder, getOrderAuditRecord, listOrder} from "../../../../api/erp/order";
import {getWarehousePosition, warehouseParentTreeSelect, warehouseTreeSelect} from "../../../../api/erp/position";
import {listUnit} from "../../../../api/erp/unit";
import AuditDialog from "../../../../components/zerp/public/auditDialog";
import addStockDetail from "./addStockDetail/addStockDetail";
import OrderTable from "../../purchaseManage/order/orderTable";
import {useRoute, useRouter} from "vue-router";
import {addOutStock, addOutStockAudit, delOutStock, getOutStock, listOutStock, updateOutStock,OutStockList} from "../../../../api/erp/outStock";
import {listUser} from "../../../../api/system/user";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const outStockList = ref([]);
const orderList = ref([]);
const tooltipAuditContent = ref({})

const open = ref(false);
const openAddOrderStock = ref(false);
const openAddOrderStockDetail = ref(false);

const openAudit = ref(false);
const openSelectOrder = ref(false);
const openSelectoutStockPosition = ref(false);
const auditAddDTO = ref({})


const loading = ref(true);
const ProductsListLoading = ref(openSelectOrder);
const showSearch = ref(true);
const showQuery = ref(true);

const orderDetailFormShow = ref(true);
const auditDisabled = ref(true);

const ids = ref([]);
const orderIds = ref([]);
const unitOptions = ref([]);
const userOptions =  ref([])

const PositionOptions = ref([])
const warehouseOptions = ref(undefined);
const tabClickIndex = ref();
const tabClickLabel = ref();

const single = ref(true);
const multiple = ref(true);
const orderAuditShow = ref(true);
const updateOrderShow = ref(true);
const total = ref(0);
const title = ref("");
const AuditTitle = ref("");
const selection = ref([{}]);
const orderSelection = ref();

const data = reactive({
  form: {
    unit: {
      unitId:('')
    },
    warehouse: {
      warehouseId:('')
    },
    warehouseName: ref(''),
    orderProductsList: ref([   //订单多个商品列表
      {
        outStockProduct: ref({       //商品出库条
          batchPositionList: ref([{  //商品同一库位不同批次列表
            batchPosition: ref({
              warehouseId: ref(''),
              positionId: ref('')
            })  //商品不同批次
          }])
        })
      }
    ])
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    outStockCode: null,
    outStockName: null,
    outStockType: null,
    warehouseId: null,
    warehousePath: null,
    unitName: ref(''),
    auditId: null,
    status: null,
  },
  queryOrderParams: {
    pageNum: 1,
    pageSize: 10,
    auditId: 1,
    orderProgress: null,
    warehouseId: null,
    unitName: null,
  },
  rules: {

    outStockName: [
      { required: true, message: "单据名称不能为空", trigger: "blur" }
    ],
    outStockType: [
      { required: true, message: "出库类型不能为空", trigger: "change" }
    ],
    warehouseId: [
      { required: true, message: "所属仓库不能为空", trigger: "blur" }
    ],
    warehousePath: [
      { required: true, message: "仓库名不能为空", trigger: "blur" }
    ],
    unitName: [
      { required: true, message: "发货供应商不能为空", trigger: "blur" }
    ],
    auditId: [
      { required: true, message: "审核状态不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form,queryOrderParams, rules } = toRefs(data);

/** 查询出库表列表 */
function getList() {
  loading.value = true;
  listOutStock(queryParams.value).then(response => {
    outStockList.value = response.rows;
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
    outStockId: null,
    outStockCode: null,
    outStockName: null,
    outStockType: null,
    warehouseId: null,
    warehousePath: null,
    unitName: null,
    auditId: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    outStockTime:null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("outStockRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 搜索按钮操作 */
function handleOrderQuery() {
  queryOrderParams.value.pageNum = 1;
  getOrderList();
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
function handleSelectionChange(data) {

  selection.value = Array.from(data);
  ids.value = selection.value.map(item => item.outStockId);
  single.value = selection.value.length != 1;
  multiple.value = !selection.value.length;
  auditDisabled.value = selection.value.length != 1 ;

  if(selection.value.length == 1){
    if(selection.value.map(item => item.auditId) == 0){
      auditDisabled.value = false;
      single.value = false;
    }else{
      auditDisabled.value = true;
      single.value = true
    }
  }
  multiple.value = !selection.value.length;
}


/** 搜索按钮操作 */
function changeOrderShow() {
  orderDetailFormShow.value = !(orderDetailFormShow.value);
}
/** 新增出库单按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加出库表";
}
/** 新增采购出库单按钮操作 */
function handleAddOrder() {
  reset();
  // form.value.outStockType = "采购出库"
  // openAddOrderStock.value = true;
  // title.value = "采购出库";
  router.push('/outAddManage/outStock/purchaseoutStock');
}
/** 新增生产出库单按钮操作 */
function handlePlanOutOrder() {
  reset();
  // form.value.outStockType = "采购出库"
  // openAddOrderStock.value = true;
  // title.value = "采购出库";
  router.push('/outAddManage/outStock/producePlanOutStock');
}
/** 新增销售出库单按钮操作 */
function handSalesOutOrder(){
  router.push('/outAddManage/outStock/salesOutStock');

}
/** 新增采购退货出库单按钮操作 */
function handlePurchaseReturnOutOrder(){
  router.push('/outAddManage/outStock/purchaseReturnOutStock');
}



/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  // openAddOrderStock.value = true;

  let dataRow = {}
  selection.value.forEach(row =>{
    dataRow = row;
  })

  const outStockId = row.outStockId || ids.value
  const outStockType = row.addStockType || dataRow.outStockType
  if(outStockType === "销售出库"){
    router.push({
      path:'/outAddManage/outStock/salesOutStock',
      query:{outStockId : outStockId}
    });
  }else  if(outStockType === "采购退货出库"){
    router.push({
      path:'/outAddManage/outStock/purchaseReturnOutStock',
      query:{outStockId : outStockId}
    });
  }
  else{
    router.push({
      path:'/outAddManage/outStock/producePlanOutStock',
      query:{outStockId : outStockId}
    });
  }

}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["outStockRef"].validate(valid => {
    if (valid) {
      if (form.value.outStockId != null) {
        updateOutStock(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOutStock(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 查询仓库下拉树结构 */
function getWarehouseTree() {
  warehouseParentTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};

/** 查询往来单位列表 */
function getUnitList() {
  listUnit().then(response => {
    unitOptions.value = response.rows;
  });
}
/** 查询user列表 */
function getUserList() {
  listUser().then(response => {
    userOptions.value = response.rows;
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const _outStockIds = row.outStockId || ids.value;
  proxy.$modal.confirm('是否确认删除出库表编号为"' + _outStockIds + '"的数据项？').then(function() {
    return delOutStock(_outStockIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/outStock/export', {
    ...queryParams.value
  }, `outStock_${new Date().getTime()}.xlsx`)
}


// tabClick row 当前行 column 当前列
function tabClick (row, column, cell, event) {
  switch (column.label) {
    case '顺序':
      tabClickIndex.value = row.index
      tabClickLabel.value = column.label
      break
    default: return
  }
}


//选择采购订单带入出库单
function selectedOrderList(){
  openSelectOrder.value = false;
}
//确定要移除这一行
const removeOrderRow = (row) => {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    const index = form.value.orderList.findIndex(item => item.purchaseOrderId === row.purchaseOrderId);
    if (index !== -1) {
      form.value.orderList.splice(index, 1);
    } else {
      alert('未找到对应行');
    }
  } else {
    alert('已取消移除');
  }
};



//选择出库库位
function SelectoutStockPosition(row){
  openSelectoutStockPosition.value = true;
  form.value.orderProductsList.outStockProduct = row
  form.value.orderProductsList.outStockProduct.batchPositionList = [{}]

  getSpanArr(form.value.orderProductsList.outStockProduct.batchPositionList);
}



//获得仓库的库位数据
function selectPosition(warehouseId){
  getWarehousePosition(warehouseId).then(response => {
    PositionOptions.value = response.data;
  });

}

// 当需要添加新行时触发的函数或事件处理程序
function addProductBatchRow() {
  const firstRow = form.value.orderProductsList.outStockProduct.batchPositionList[0];

  // 创建一个空对象或空数据结构
  const batchPosition = {
    selectValue: [...firstRow.selectValue], // 复制第一行的仓库信息
    warehouseId: firstRow.warehouseId,
    positionId: firstRow.positionId,
    positionName: firstRow.positionName,
    warehouseName: firstRow.warehouseName,
    batch: '' // 你可能需要根据需要初始化其他属性
  };

  // 将新的空对象添加到数组中
  form.value.orderProductsList.outStockProduct.batchPositionList.push(batchPosition);
  getSpanArr(form.value.orderProductsList.outStockProduct.batchPositionList);
}


function removeProductBatchRow(row) {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    const index = form.value.orderProductsList.outStockProduct.batchPositionList.findIndex(item => item === row);
    if (index !== -1) {
      form.value.orderProductsList.outStockProduct.batchPositionList.splice(index, 1);
    } else {
      alert('未找到对应行');
    }
  } else {
    alert('已取消移除');
  }
  getSpanArr(form.value.orderProductsList.outStockProduct.batchPositionList);
}


// 定义变量
const spanArr = ref([]);
let pos = 0;


// 遍历数据
const getSpanArr = (data) => {
  spanArr.value = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      spanArr.value.push(1);
      pos = 0;
    } else {
      if (data[i].userName === data[i - 1].userName) {
        spanArr.value[pos] += 1;
        spanArr.value.push(0);
      } else {
        spanArr.value.push(1);
        pos = i;
      }
    }
  }
};

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    const _row = spanArr.value[rowIndex];
    const _col = _row > 0 ? 1 : 0;
    return {
      rowspan: _row,
      colspan: _col
    };
  } else if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
    return {
      rowspan: 1,
      colspan: 1
    };
  }
};


function formatBatchPosition(row) {
  const batchPositionList = row.batchPositionList
  if (Array.isArray(batchPositionList) && batchPositionList.length > 0) {
    const formattedList = batchPositionList.map(item => {
      const selectedLabels = [];

      if (item != null) {
        selectedLabels.push(item.warehouseName|| '-'); // 添加仓库名称
        selectedLabels.push(item.positionName|| '-'); // 添加库位名称
        // 添加批次信息
        selectedLabels.push(item.batchCode || '-');

        // 根据找到的仓库、库位和批次信息构建显示的字符串
        return `${selectedLabels.join('-')}（${item.addNumber}）个`;
      }

      return `N/A（${item.addNumber}）个`; // 如果选择值不符合预期的格式，返回默认值
    });

    return formattedList.join('<br>');
  }

  return '选择出库：位置-批次';
}

// 你的函数，根据传入的 unitId 返回对应的 unitName
function getUnitNameById(unitId) {
  // 将 unitId 转换为与 unitOptions.value 中的 unitId 类型相匹配的类型
  const foundUnit = ref({})
  foundUnit.value = unitOptions.value.find(item => String(item.unitId) === String(unitId));

  return foundUnit.value.unitName ? foundUnit.value.unitName : "";
}


function getReturnBatchPosition(){
  openSelectoutStockPosition.value=false;
}

//选择库位节点触发
const handlePositionChange = (selectValue) => {

  // 更新所有行的出库位置信息
  form.value.orderProductsList.outStockProduct.batchPositionList.forEach(row => {
    row.selectValue = selectValue; // 将出库位置设置为选择的值
    row.warehouseId = row.selectValue[0];
    row.positionId = row.selectValue[1];
    const foundWarehouse =  PositionOptions.value.find(option => option.id === row.warehouseId);
    row.warehouseName = foundWarehouse.label
    const foundPosition = foundWarehouse.children.find(child => child.id === row.positionId);
    row.positionName = foundPosition.label

  });

  // 其他可能的操作或逻辑
};

//提交出库单到后端
function subMitOutStockList(){

  if (form.value.outStockId != null) {
    updateOutStock(form.value).then(response=>{
      proxy.$modal.msgSuccess("修改成功");
      openAddOrderStock.value = false;
      getList();
    })

  }else{
    OutStockList(form.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      openAddOrderStock.value = false;
      getList();
    });
  }

}


function handleOutStockDetailClick(row){

  reset();
  if(row.outStockType === "生产计划出库"){
    router.push({
      path:'/outAddManage/outStock/producePlanOutStock/producePlanOutStockDetail',
      query:{outStockId : row.outStockId}
    });
  }else if(row.outStockType === "销售出库"){
    router.push({
      path:'/outAddManage/outStock/salesOutStock/salesOutStockDetail',
      query:{outStockId : row.outStockId}
    });
  }else if(row.outStockType === "采购退货出库"){
    router.push({
      path:'/outAddManage/outStock/purchaseReturnOutStock/purchaseReturnOutStockDetail',
      query:{outStockId : row.outStockId}
    });
  }

}
//状态显示
function outStockAuditStatus(auditId) {
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

const showAuditTooltip = (row) => {
  // 生成tooltip的内容，可以根据rowData的信息来设置tooltip内容
  if(row.auditId == 0){
    tooltipAuditContent.value = {}
    return;
  }
  getOrderAuditRecord(row.outStockId).then(response => {
    tooltipAuditContent.value = response.data;

    // Parse the existing timestamp into a Date object
    const auditTime = new Date(tooltipAuditContent.value.createTime);

    // Format the date as yyyy-mmdd-hh:mm:ss
    const formattedAuditTime =
        auditTime.getFullYear() +
        '-' + ('0' + (auditTime.getMonth() + 1)).slice(-2) +
        '-' + ('0' + auditTime.getDate()).slice(-2) +
        ' ' + ('0' + auditTime.getHours()).slice(-2) +
        ':' + ('0' + auditTime.getMinutes()).slice(-2) +
        ':' + ('0' + auditTime.getSeconds()).slice(-2);

    // Update tooltipAuditContent.value with the formatted timestamp
    tooltipAuditContent.value = '审核人: ' + tooltipAuditContent.value.userName +
        '  审核时间: ' + formattedAuditTime +
        '  备注: ' + tooltipAuditContent.value.auditRemark;
  });


};
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
  addOutStockAudit(auditAddDTO.value).then(response => {
    proxy.$modal.msgSuccess("审核成功");
    getList();
  })
  openAudit.value = false;
  title.value = ""
}
// 采购订单多选框选中数据
function handleOrderSelectionChange(data) {
  orderSelection.value = Array.from(data);
  if(orderSelection.value.length > 1){
    return "只能选择一条订单出库"
  }
  orderIds.value = orderSelection.value.map(item => item.purchaseOrderId);
  multiple.value = !orderSelection.value.length;
  form.value.selectedOrder = orderSelection.value   //暂存选中订单

  const warehouseArray = orderSelection.value.map(item => item.warehouse);  //选中
  const unitArray = orderSelection.value.map(item => item.unit);
  for (const unit of unitArray) {
    form.value.unit = unit;
    form.value.unitId = unit.unitId
  }
  for (const warehouse of warehouseArray) {
    form.value.warehouse = warehouse;
    form.value.warehouseId = warehouse.warehouseId;

  }
  // queryParams.value.unitName = getUnitNameById(form.value.unitId)

  //可能以后需要多选订单，这里遍历list只拿到一个订单包含的商品，放入下面的商品暂存表格
  form.value.orderProductsLists = orderSelection.value.map(item => item.productList)
// 遍历 orderProductsLists 数组
  for (const productList of form.value.orderProductsLists) {
     // form.value.orderProductsList.push(productList);
    // 这里可以对每个 productList 进行处理
    form.value.orderProductsList = productList;
  }
  selectPosition(form.value.warehouseId)
}

function handleSelectOrder(){
  openSelectOrder.value = true;
  getOrderList()
}
/** 查询采购订单列表 */
function getOrderList() {
  loading.value = true;
  queryOrderParams.value.auditId = 1
  queryOrderParams.value.orderProgress = "未开始"
  listOrder(queryOrderParams.value).then(response => {
    orderList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


const props = {
  expandTrigger: 'hover'
};





// 在组件挂载前监听路由变化
onBeforeMount(() => {
  watch(
      () => route.fullPath,
      async () => {
        if (route.name === 'outStock') {
          // 使用 nextTick 确保在 DOM 更新后执行刷新数据的逻辑
          await nextTick();
          getList();
        }
      }
  );
});

getUnitList();
getUserList()
getWarehouseTree();
getList();
</script>


<style>

.dialog-selectOrder{
  /*width: 85% ;*/
  /*!*height: 90%;*!*/
  margin-top: 80px;
  height: 80%;
  width: 65%;
  /*max-width: calc(100% - 300px);*/
}
.dialog-addOrder{
  width: 85% ;
  /*height: 90%;*/
  margin-left: 200px;
  /*max-width: calc(100% - 300px);*/
}


.tab-top-centent{
  width: 100%;
  border: 1px solid #e6ebf5;
  height: 30px;
  font-family: Arial;
  border-bottom: 0;
  font-weight: 700;
  background-color: #f4faff;
}
.dis{
  padding-left: 8px;
  display: flex;
}
.el-row{
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.page-center{
  text-align: right;
  margin-top: 15px;
}
.custom-link-style {
  color: rgba(40, 177, 232, 0.83);
  text-decoration: underline;
  font-size: 10px; /* 设置合适的字体大小 */
  /* 其他可能的样式 */
}


.select-container {
  position: relative;
}

/* 添加蒙版效果 */
.readonly-tree-select {
  pointer-events: none;
}

/* 给蒙版添加样式 */
.readonly-tree-select::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(176,196,222, 0.2); /* 淡灰色 */
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
