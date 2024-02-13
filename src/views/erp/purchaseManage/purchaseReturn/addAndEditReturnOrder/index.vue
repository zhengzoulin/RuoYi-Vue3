<template>

  <div class="app-container">

    <el-row class="header">
      <router-link to="/purchaseManage/purchaseReturn">
        <el-button type="primary"     icon="Back"
                   plain style=" color: #fff;background-color: #909399;
                              border-color: #909399; font-size: 12px;padding-left: 18px">
          <span>返回</span>
        </el-button>
      </router-link>
      <div>
        <span style="color: #1c84c6;font-size: 28px"> {{ displayTitleText }}</span>
      </div>
      <div>
        <el-col :span="24" style="position: absolute; top: 0; right: 105px; width: auto;">
          <el-button type="primary" plain  icon="primary" @click="subMitOutStockAndAuditPass">保存并审核通过</el-button>
        </el-col>
        <el-col :span="24"    style="position: absolute; top: 0; right: 20px; width: auto;">
          <el-button type="primary" plain icon="primary" @click="subMitOutStockList">保存</el-button>
        </el-col>
      </div>

    </el-row>
    <span > 采购退货单基本信息
        <el-button link type="primary" icon="list" @click="orderDetailFormShow = !orderDetailFormShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
    <el-form ref="orderRef" v-show="orderDetailFormShow"  :model="form" :rules="rules" :inline="true" label-width="80px"
             style="border-top: dashed 1.3px rgba(187,199,191,0.35) ;padding: 8px;margin-top: 10px">
      <el-row>
        <el-form-item label="退货单号" prop="outStockCode" class="select-container" >
          <el-input v-model="form.purchaseOrderReturnCode" placeholder="保存后自动生成" class="readonly-tree-select" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="单据名称" prop="outStockName">
          <el-input v-model="form.purchaseOrderReturnName" placeholder="请输入单据名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item label="退货原因" prop="outStockType" >
          <el-select v-model="form.outStockType" placeholder="请选择退货原因" style="width: 180px;">
            <el-option label="收到商品少件或破损" value="少件或破损"></el-option>
            <el-option label="卖家发错货" value="卖家发错货"></el-option>
            <el-option label="客户不想要" value="客户不想要"></el-option>
            <el-option label="质量问题" value="质量问题"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属仓库" prop="warehouseName" class="select-container">
          <el-tree-select
              v-model="form.warehouseId"
              :data="warehouseOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="由采购订单带入"
              class="readonly-tree-select"
              style="width: 160px;"
          />
        </el-form-item>
      </el-row>
      <el-row>

        <el-form-item label="退货日期" prop="purchaseOrderReturnTime">
          <el-date-picker clearable
                          v-model="form.purchaseOrderReturnTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择订单交货日期"
                          style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单备注" prop="remark">
          <el-input v-model="form.remark" type="text" placeholder="请输入" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="供应商" prop="unitName">
          <el-select v-model="form.unitId"  placeholder="由采购订单带入"   class="readonly-tree-select">
            <el-option
                v-for="item in unitOptions"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
                :disabled="item.status == 1"
                style="width: 140px;"
                class="readonly-tree-select"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-row>
    </el-form>


    <br>
    <div style="margin-top: 10px "> <span >采购订单信息 </span>
      <el-button
          type="primary"
          plain
          icon="Plus"
          size="small"
          style="margin-left: 10px;"
          @click="handleSelectOrder"
      >选择采购订单</el-button>
    </div>

    <el-table
        :data="purchaseOrderSelection"
        height="220px"
        style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
    >

      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="采购单号" align="center"   >
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

      <el-table-column label="单据名称" align="center" prop="purchaseOrderName"  />
      <el-table-column label="创建日期" prop="createTime" align="center"/>
      <el-table-column label="交货日期" prop="purchaseOrderTime" align="center"/>
<!--      <el-table-column label="出货仓库" align="center" prop="warehouse.warehousePath"  />-->
      <el-table-column label="订单备注" prop="remark"  align="center"/>

    </el-table>

    <div style="margin-top: 10px "> <span >采购退货单商品明细 </span>
      <el-button
          type="danger"
          plain
          icon="Plus"
          size="small"
          style="margin-left: 10px;"
          @click="handleAddProduct"
          v-hasPermi="['erp:order:add']"
      >移出明细</el-button>
    </div>

    <br>
    <span style="margin-top:50px"> 出库种数：{{form.orderProductsList.length}}   </span>
    <!--      待退货商品明细表格-->
    <el-table
        :data="form.orderProductsList"
        height="350"
        style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"

    >

      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="商品编号" align="center" prop="productCode" width="120px"/>

      <el-table-column label="商品信息" align="center" width="140px">
        <template #default="scope">
          <span style="display: block;"> {{ scope.row.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
          <span style="display: block;">最小包装数量:{{ scope.row.minpacketNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" prop="demandNumber" align="center" class="select-container" width="130px"/>

      <el-table-column label="采购价格" prop="costPrice" align="center" class="select-container" width="130px"/>
      <el-table-column label="金额" prop="orderMoney" align="center" class="select-container" width="130px"/>

      <el-table-column label="已入库数量" prop="alreadyAddStockNumber" align="center" width="130px"/>

      <el-table-column label="可退货数量" prop="canReturnNumber" align="center" width="130px">
        <template #default="scope">
          <span style="color: red;">{{scope.row.canReturnNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column label="退货数量"   align="center"  >
        <template #default="scope">
                  <span>
                    <el-input-number v-model="scope.row.returnNumber"  type="number" maxlength="20" placeholder="请输入出库量" size="mini"  />
                  </span>
        </template>
      </el-table-column>

    </el-table>


    <!--    选择采购订单-->
    <el-dialog
        title="选择采购订单" v-model="openSelectOrder"
        append-to-body class="dialog-selectOrder">

      <el-form :model="queryOrderParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="订单编号" prop="purchaseOrderCode">
          <el-input
              v-model="queryOrderParams.purchaseOrderCode"
              placeholder="请输入订单编号"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="单据名称" prop="purchaseOrderName">
          <el-input
              v-model="queryOrderParams.purchaseOrderName"
              placeholder="请输入单据名称"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="入库仓库" prop="warehouseName">
          <el-tree-select
              v-model="queryOrderParams.warehouseId"
              :data="warehouseOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="请选择仓库"
              @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="交货日期" prop="purchaseOrderTime">
          <el-date-picker clearable
                          v-model="queryOrderParams.purchaseOrderTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择订单交货日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="Search" @click="handlePurchaseOrderQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!--采购订单-->
      <order-table
          :loading="loading"
          :orderList="orderList"
          :tooltipAuditContent="tooltipAuditContent"
          :disabledOper="disabledOper"
          @handleSelectionChange="handleOrderSelectionChange"
          @handleOrderDetailClick="handleOrderDetailClick"
          @showAuditTooltip="showAuditTooltip"
          :tableStyle="{ height: '350px' }"
      />

      <div style="padding-top: 10px; margin-bottom: 10px; display: flex; justify-content: flex-end;">
        <el-button type="primary" size="small"  style="width: 60px;">
          取消
        </el-button>
        <el-button type="primary" size="small"  style="width: 60px;" @click="selectedOrderList">
          确定
        </el-button>
      </div>

    </el-dialog>


  </div>

</template>

<script setup>


import {ref} from "vue";
import {addOutStock, addOutStockAudit, delOutStock, getOutStock, listOutStock, updateOutStock,OutStockList} from "../../../../../api/erp/outStock";

import {useRoute, useRouter} from "vue-router";
import {listUnit} from "../../../../../api/erp/customer";
import {
  getProductBatchNumberList,
  getWarehousePosition,
  warehouseParentTreeSelect,
  warehouseTreeSelect
} from "../../../../../api/erp/position";
import {getOrder, getOrderAuditRecord, listOrder} from "../../../../../api/erp/order";
import {listPlan} from "../../../../../api/erp/plan";
import SalesOrderTable from "../../../../../components/zerp/table/salesOrderTable";
import {getSales, listSales} from "../../../../../api/erp/sales";
import OrderTable from "../../order/orderTable";
import {
  addPurchaseReturn, getPurchaseReturn,
  getPurchaseReturnProducts,
  updatePurchaseReturn
} from "../../../../../api/erp/purchaseReturn";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const  orderDetailFormShow = ref(true)
const openAddOrderStock = ref(false);
 const openSelectOrder = ref(false);
const multiple = ref(true);
const loading = ref(true);
const selectPlanOrderShow = ref(false);
const showSearch = ref(true);
const showQuery = ref(true);
const disabledOper = ref(false)

const tabClickIndex = ref();
const tabClickLabel = ref();
const ProductsListLoading = ref(openSelectOrder);
const unitOptions = ref([]);
const warehouseOptions = ref(undefined);
const orderList = ref([]);
const tooltipAuditContent = ref({})
const PositionOptions = ref([])
 const purchaseOrderSelection = ref();
const total = ref(0);
 const tempProduct = ref({})
const productBatchNumbers = ref([])
const data = reactive({
  form: {
    addStockType: "采购入库",
    unit: {
      unitId:('')
    },
    warehouse: {
      warehouseId:('')
    },
    warehouseName: ref(''),
    orderProductsList: ref([   //订单多个商品列表
      {
        addStockProduct: ref({       //商品入库条
          batchPositionList: ref([{  //商品同一库位不同批次列表
            batchPosition: ref({
              productCode: ref(''),
              productName: ref(''),
              warehouseId: ref(''),
              positionId: ref('')
            })  //商品不同批次
          }])
        })
      }
    ])
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
const {  form,queryOrderParams, rules } = toRefs(data);


const validateMaxNumber = (rule, value, callback) => {
  const currentBatchNumber = scope.row.currentBatchNumber;
  if (value > currentBatchNumber) {
    callback(new Error('出库数量不能大于当前批次数量'));
  } else {
    callback();
  }
};
const displayTitleText = computed(() => {
  if (purchaseOrderReturnId.value == null) {
    return '新增采购退货';
  } else {
    return '修改采购退货单';
  }
});
/** 查询往来单位列表 */
function getUnitList() {
  listUnit().then(response => {
    unitOptions.value = response.rows;
  });
}
/** 查询仓库下拉树结构 */
function getWarehouseTree() {
  warehouseParentTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};
/** 查询生产管理列表 */
function getPurchaseOrderList() {
  loading.value = true;
  queryOrderParams.value.auditId="1"
  queryOrderParams.value.orderProgress = "已入库"

  listOrder(queryOrderParams.value).then(response => {
    orderList.value = response.rows;
    console.log(orderList.value)
    total.value = response.total;
    loading.value = false;
  });
}
function handlePurchaseOrderQuery(){
  listOrder(queryOrderParams.value).then(response => {
    orderList.value = response.rows;
    console.log(orderList.value)
    total.value = response.total;
    loading.value = false;
  });
}


//提交出库单到后端
function subMitOutStockList(){
  form.value.purchaseOrderSelection = purchaseOrderSelection.value;

  console.log(form.value)
  if (form.value.purchaseOrderReturnId == null) {
    addPurchaseReturn(form.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
    });

  }else {
    updatePurchaseReturn(form.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
    })
  }
  router.push("/purchaseManage/purchaseReturn");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryOrderParams.value.pageNum = 1;
  getPurchaseOrderList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}


//选择采购订单带入出库单
function selectedOrderList(){
  openSelectOrder.value = false;
}

function handleSelectOrder(){
  openSelectOrder.value = true;
  getPurchaseOrderList()
}
/** 查询采购订单列表 */

// 采购订单多选框选中数据（单选）
function handleOrderSelectionChange(data) {

  // alert("sw")
  purchaseOrderSelection.value = Array.from(data);

  console.log(purchaseOrderSelection.value)

  if(purchaseOrderSelection.value.length > 1){
    return "只能选择一条订单出库"
  }
  multiple.value = !purchaseOrderSelection.value.length;
  purchaseOrderSelection.value.forEach(item=>{
    getPurchaseReturnProducts(item.purchaseOrderId).then(response =>{

      form.value.warehouse = response.data.warehouse;
      form.value.warehouseId = response.data.warehouseId;
      form.value.unitId = response.data.unitId
      form.value.orderProductsList = response.data.demandProductsList;
      console.log(form.value.orderProductsList)
    })
  });
}



//计算当前已选数量和判断是否超过
const currentInputNum = () => {
  let currentCount = 0;
  form.value.orderProductsList.outStockProduct.batchPositionList.forEach((row) => {
    // 使用parseInt确保row.outNumber是数字类型
    currentCount += parseInt(row.outNumber, 10) || 0;
  });
  return currentCount;
};

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
}

const showAuditTooltip = (row) => {
  // 生成tooltip的内容，可以根据rowData的信息来设置tooltip内容
  if(row.auditId == 0){
    return;
  }
  getOrderAuditRecord(row.purchaseOrderReturnId).then(response=>{
    tooltipAuditContent.value= response.data

    tooltipAuditContent.value = '审核人: '+tooltipAuditContent.value.userName +
        '  审核时间:'+ tooltipAuditContent.value.createTime +
        '  备注:'+tooltipAuditContent.value.auditRemark;
  })
};

// 接收参数
const purchaseOrderReturnId = ref(route.query.purchaseOrderReturnId);
function addOrUpdate(){
  if(purchaseOrderReturnId.value == null){
    alert("新增")
  }else{
    alert("修改xiaos")
    getPurchaseReturn(purchaseOrderReturnId.value).then(response => {
      form.value = response.data;
      purchaseOrderSelection.value = form.value.purchaseOrderSelection;
    });
  }
}



addOrUpdate()
getUnitList()
getWarehouseTree()

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
.header {
  justify-content: space-between;
  margin-bottom: 10px;
  padding-right: 2%;
}
</style>