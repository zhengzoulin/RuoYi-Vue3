<template>

  <div class="app-container">

    <el-row class="header">
      <router-link to="/outAddManage/outStock">
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
    <span > 出库单基本信息
        <el-button link type="primary" icon="list" @click="orderDetailFormShow = !orderDetailFormShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
    <el-form ref="orderRef" v-show="orderDetailFormShow"  :model="form" :rules="rules" :inline="true" label-width="80px"
             style="border-top: dashed 1.3px rgba(187,199,191,0.35) ;padding: 8px">
      <el-row>
        <el-form-item label="出库单号" prop="outStockCode" class="select-container" >
          <el-input v-model="form.outStockCode" placeholder="保存后自动生成" class="readonly-tree-select" style="width: 180px;"/>
        </el-form-item>

        <el-form-item label="出库类型" prop="outStockType" class="select-container" >
          <el-input v-model="form.outStockType" placeholder="保存后自动生成" class="readonly-tree-select" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="客户" prop="unitName" class="select-container"  >
          <el-select v-model="form.unitId"  placeholder="请选择" class="readonly-tree-select">
            <el-option
                v-for="item in unitOptions"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
                :disabled="item.status == 1"
                class="readonly-tree-select"
                style="width: 140px;"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseName" class="select-container">
          <el-tree-select
              v-model="form.warehouseId"
              :data="warehouseOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="请选择仓库"
              class="readonly-tree-select"
              style="width: 160px;"
          />
        </el-form-item>
      </el-row>
      <el-row>



        <el-form-item label="出库日期" prop="outStockTime">
          <el-date-picker clearable
                          v-model="form.outStockTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择订单交货日期"
                          style="width: 180px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单据名称" prop="outStockName">
          <el-input v-model="form.outStockName" placeholder="请输入单据名称" style="width: 180px;" />
        </el-form-item>

        <el-form-item label="订单备注" prop="remark">
          <el-input v-model="form.remark" type="text" placeholder="请输入" style="width: 180px;"/>
        </el-form-item>
      </el-row>
    </el-form>


    <br>
    <div style="margin-top: 10px "> <span >销售订单信息 </span>
      <el-button
          type="primary"
          plain
          icon="Plus"
          size="small"
          style="margin-left: 10px;"
          @click="handleSelectOrder"
      >选择销售订单</el-button>
    </div>

    <el-table
        :data="salesOrderSelection"
        height="220px"
        style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
    >

      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="销售单号" align="center" width="120px" >
        <template #default="scope">
          <!-- 使用 <a> 标签来包装数据，并添加样式 -->
          <a
              href="#"
              style="color: rgba(40,177,232,0.83); text-decoration: underline;"
              @click="handleOrderDetailClick(scope.row)"
          >
            {{ scope.row.salesOrderCode }}
          </a>
        </template>
      </el-table-column>

      <el-table-column label="单据名称" align="center" prop="salesOrderName"  />
      <el-table-column label="创建日期" prop="createTime" align="center"/>
      <el-table-column label="交货日期" prop="salesOrderTime" align="center"/>
      <el-table-column label="客户" align="center" prop="unit.unitName"  />
      <el-table-column label="出货仓库" align="center" prop="warehouse.warehousePath"  />
      <el-table-column label="订单备注" prop="remark"  align="center"/>

    </el-table>

    <div style="margin-top: 10px "> <span >销售出库商品明细 </span>
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
    <span style="margin-top:50px"> 出库种数：{{form.orderPlanProductsList.length}}   </span>
    <!--      待领料出库商品明细表格-->
    <el-table
        :data="form.orderPlanProductsList"
        height="350"
        style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"

    >

      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="编号" align="center" prop="productCode" width="90px"/>

      <el-table-column label="商品信息" align="center" width="120px">
        <template #default="scope">
          <span style="display: block;"> {{ scope.row.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
          <span style="display: block;">最小包装数量:{{ scope.row.minpacketNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售数量" prop="salesNumber" align="center" class="select-container" width="110px"/>

      <el-table-column label="在库数量" prop="balanceNumber" align="center" class="select-container" width="110px"/>
      <el-table-column label="占用数量" prop="availableNumber" align="center" width="110px">
        <template #default="scope">
          {{scope.row.balanceNumber - scope.row.availableNumber}}
        </template>
      </el-table-column>
      <el-table-column label="可出库数量" prop="availableNumber" align="center" width="110px"/>

      <el-table-column label="出库数量"   align="center"  >
        <template #default="scope">
                  <span>
                    <el-input-number v-model="scope.row.outStockNumber"  type="number" maxlength="20" placeholder="请输入出库量" size="mini"  />
                  </span>
        </template>
      </el-table-column>

      <el-table-column label="出库位置相关信息" align="center" >
        <template #default="scope">
          <a
              href="#"
              class="custom-link-style"
              @click="SelectOutStockPosition(scope.row)"
              v-html="String.raw`${formatBatchPosition(scope.row)}`"
          ></a>
        </template>
      </el-table-column>


    </el-table>


    <el-dialog title="选择销售订单" v-model="openSelectOrder"
               append-to-body class="dialog-selectOrder">
      <div style="">
        <el-row>
          <el-form :model="querySalesParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" class="custom-form">
            <el-form-item  prop="bomKey" v-show="showQuery">
              <el-input
                  v-model="querySalesParams.bomKey"
                  placeholder="请输入关键字"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="订单编号" prop="salesOrderCode" v-show="!showQuery">
              <el-input
                  v-model="querySalesParams.salesOrderCode"
                  placeholder="请输入订单编号"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="单据名称" prop="salesOrderName" v-show="!showQuery">
              <el-input
                  v-model="querySalesParams.salesOrderName"
                  placeholder="请输入单据名称"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="客户信息" prop="unit" v-show="!showQuery">
              <el-input
                  v-model="querySalesParams.unit"
                  placeholder="请输入客户信息"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="所属仓库" prop="warehouseId" v-show="!showQuery">
              <el-input
                  v-model="querySalesParams.warehouseId"
                  placeholder="请输入所属仓库"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="订单交货日期" prop="salesOrderTime" v-show="!showQuery">
              <el-date-picker clearable
                              v-model="querySalesParams.salesOrderTime"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择订单交货日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="订单审核状态" prop="auditId" v-show="!showQuery">
              <el-input
                  v-model="querySalesParams.auditId"
                  placeholder="请输入订单审核状态"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="订单进度(0待出库，1已出库)" prop="orderProgress" v-show="!showQuery">
              <el-input
                  v-model="querySalesParams.orderProgress"
                  placeholder="请输入订单进度(0待出库，1已出库)"
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

        </el-row>
        <sales-order-table
            :salesList = "salesList"
            :total="total"
            :loading="loading"
            :queryParams="queryParams"
            @handleSelectionChange="handleOrderSelectionChange"
        />
        <div style="padding-top: 10px; margin-bottom: 10px; display: flex; justify-content: flex-end;">
          <el-button type="primary"   style="width: 60px;">
            取消
          </el-button>
          <el-button type="primary"   style="width: 60px;" @click="selectedOrderList">
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>


    <!--  选择出库位置批次  //-->
    <el-dialog
        title="选择出库位置" v-model="openSelectOutStockPosition"
        append-to-body class="dialog-selectOrder"
        :style="{ 'max-height': '60vh' }"
    >

      <table :data="tempProduct" class="tab-top-centent" style="border: 1px solid rgb(230, 235, 245);">
        <tr ><td  class="tex">
          <div  class="dis">
            商品编号：
            <div   tabindex="0">{{ tempProduct.productCode}}</div></div></td>
          <td  class="tex">
            <div  class="dis">
              商品名称：
              <div   tabindex="0">{{ tempProduct.productName}}</div></div></td>
          <td  class="tex">
            <div  class="dis">
              厂家型号：
              <div   tabindex="0">{{ tempProduct.productModel }} </div></div></td>
          <td  class="tex">
            <div  class="dis">
              封装规格：
              <div   tabindex="0">{{ tempProduct.encapStandard }}</div></div></td>
          <td  class="tex">
            <div  class="dis">
              封装单位：
              <div  tabindex="0">{{ tempProduct.minpacketUnit}}</div></div></td>
        </tr></table>

      <div  class="el-row" style="margin-top: 15px; margin-bottom: 15px; margin-left: 10px;">
        <span >
         可出库数量：<span  style="color: rgb(82, 153, 252);">{{ tempProduct.availableNumber }}</span> &nbsp;&nbsp;
        </span>
        已输入入库数量：<span  style="color: rgb(82, 153, 252);">{{currentInputNum()}}</span>
      </div>

      <el-form
          :style="{ 'max-height': '60vh' }"
      >

        <el-table
            :data="form.orderPlanProductsList.outStockProduct.batchPositionList"
            height="250px"
            @cell-click="tabClick"
            style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
        >
          <el-table-column label="出库位置" align="center">
            <template #default="scope">
              <el-cascader
                  v-model="scope.row.selectValue"
                  :options="PositionOptions"
                  :props="{ value: 'id', label: 'label', children: 'children' }"
                  @change="handlePositionChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="批次" align="center" width="245">
            <template #default="scope">
              <el-select v-model="scope.row.batchCode" placeholder="采购订单获取" >
                <el-option
                    v-for="item in scope.row.batchList"
                    :key="item.batchCode"
                    :label="item.batchName"
                    :value="item.batchCode"
                    style="width: 250px;"
                    class="custom-option"
                    @click="BatchCanbeSelected(scope.row)"
                ></el-option>
              </el-select>

            </template>
          </el-table-column>
          <el-table-column label="库存数量" align="center">
            <template #default="scope">
            <span>
              {{ scope.row.currentBatchNumber ? scope.row.currentBatchNumber:0}}
            </span>
            </template>
          </el-table-column>
          <el-table-column label="出库数量" align="center" >
            <template #default="scope">
            <span>
              <el-input v-model="scope.row.outNumber"  type="number" maxlength="5"  size="mini" :rule="validateMaxNumber">
                     <template #append>
                        <el-button style="color: #5bafe5" @click="MaxNumber(scope.row)">Max</el-button>
                     </template>
              </el-input>
            </span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="danger" icon="delete" @click="removeProductBatchRow(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div  class="el-row is-justify-end el-row--flex">
          <button  type="button" class="el-button lc-success el-button--text el-button--mini"
                   style="font-size: 18px;" @click="addProductBatchRow">
            <span>+新增行</span>
          </button></div>
        <div style="text-align: right;">
          <button type="button" class="el-button el-button--default el-button--mini" @click=" openSelectOutStockPosition=false">
            <span>取消</span>
          </button>
          <button type="button" class="el-button el-button--primary el-button--mini" @click="getReturnBatchPosition">
            <span>确定</span>
          </button>
        </div>

      </el-form>



    </el-dialog>
  </div>


</template>

<script setup>


import {ref} from "vue";
import {addOutStock, addOutStockAudit, delOutStock, getOutStock, listOutStock, updateOutStock,OutStockList} from "../../../../../api/erp/outStock";

import {useRoute, useRouter} from "vue-router";
import {listUnit} from "../../../../../api/erp/customer";
import {getProductBatchNumberList, getWarehousePosition, warehouseTreeSelect} from "../../../../../api/erp/position";
import {getOrderAuditRecord, listOrder} from "../../../../../api/erp/order";
import {listPlan} from "../../../../../api/erp/plan";
import SalesOrderTable from "../../../../../components/zerp/table/salesOrderTable";

import {getSales, listSales} from "../../../../../api/erp/sales";


const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const  orderDetailFormShow = ref(true)
const openAddOrderStock = ref(false);
const openSelectOutStockPosition = ref(false);
const openSelectOrder = ref(false);
const multiple = ref(true);
const loading = ref(true);
const selectPlanOrderShow = ref(false);
const showSearch = ref(true);
const showQuery = ref(true);


const tabClickIndex = ref();
const tabClickLabel = ref();
const ProductsListLoading = ref(openSelectOrder);
const orderIds = ref([]);
const unitOptions = ref([]);
const warehouseOptions = ref(undefined);
const orderList = ref([]);
const tooltipAuditContent = ref({})
const PositionOptions = ref([])
const salesList = ref([]);
const salesOrderSelection = ref();
const total = ref(0);


const  selectedOrder = ref([]);
// const orderPlanProductsList = ref([]);
const tempProduct = ref({})
const productBatchNumbers = ref([])
const data = reactive({
  form: ref( {

    outStockType: "销售出库",
    outStockCode:null,
    outStockName:null,
    unit: {
      unitId:('')
    },
    warehouse: {
      warehouseId:('')
    },
    warehouseName: ref(''),
    orderPlanProductsList: ref([   //订单多个商品列表
      {
        outStockProduct: ref({       //商品出库条
          batchPositionList: ref([{  //商品同一库位不同批次列表
            batchPosition: ref({
              productCode: ref(''),
              warehouseId: ref(''),
              positionId: ref('')
            })  //商品不同批次
          }])
        })
      }
    ])
  }),
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    outStockCode: null,
    outStockName: null,
    outStockType: "采购出库",
    warehouseId: null,
    warehousePath: null,
    unitName: ref(''),
    auditId: null,
    status: null,
  },
  querySalesParams: {
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
const { queryParams, form,querySalesParams, rules } = toRefs(data);


const validateMaxNumber = (rule, value, callback) => {
  const currentBatchNumber = scope.row.currentBatchNumber;
  if (value > currentBatchNumber) {
    callback(new Error('出库数量不能大于当前批次数量'));
  } else {
    callback();
  }
};
const displayTitleText = computed(() => {
  if (outStockId.value == null) {
    return '新增销售出库单';
  } else {
    return '修改销售出库单';
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
  warehouseTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};
/** 查询生产管理列表 */
function getSalesOrderList() {
  loading.value = true;
  querySalesParams.value.auditId="1"
  querySalesParams.value.orderProgress="1"

  listSales(querySalesParams.value).then(response => {
    salesList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
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
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    const _row = spanArr.value[rowIndex];
    const _col = _row > 0 ? 1 : 0;
    // console.log(`rowspan:${_row} colspan:${_col}`);
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

function returnOutStock(){
  router.push("/produce/plan");
}
//提交出库单到后端
function subMitOutStockList(){
  // form.value orderPlanProductsList
  form.value.salesOrderSelection = salesOrderSelection.value;
  // form.value.orderPlanProductsList = orderPlanProductsList.value

  console.log(form.value)
  if (form.value.outStockId == null) {
      OutStockList(form.value).then(response => {
        proxy.$modal.msgSuccess("新增成功");
       });

  }else {
    updateOutStock(form.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
     })
  }
  router.push("/outAddManage/outStock");
}
/** 搜索按钮操作 */
function handleQuery() {
  querySalesParams.value.pageNum = 1;
  getSalesOrderList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

 /** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  openAddOrderStock.value = true;

  const _outStockId = row.outStockId || ids.value
  getOutStock(_outStockId).then(response => {
    form.value = response.data;
    title.value = "修改出库表";
  });
}
//选择采购订单带入出库单
function selectedOrderList(){
  openSelectOrder.value = false;
}

function handleSelectOrder(){
  openSelectOrder.value = true;
  getSalesOrderList()
}
/** 查询采购订单列表 */

//current批次库存
const getCurrentStockQuantity = (row) => {
  productBatchNumbers.value= row.batchList ? row.batchList : []
  const batchInfo = productBatchNumbers.value.find(item => item.batchCode === row.batchCode);
  return batchInfo ? extractStockQuantity(batchInfo.batchName) : '0';
};

const extractStockQuantity = (batchName) => {
  const stockMatch = batchName.match(/\(库存:(\d+)\)/);
  return stockMatch ? stockMatch[1] : '0';
}
function MaxNumber(row){
  row.outNumber = row.currentBatchNumber;
}

//判断批次是否已选
function BatchCanbeSelected(row){

  let count = 0
  let currentName = row.selectValue[1]+row.batchCode
  // row.currentBatchNumber = extractStockQuantity(row.batchCode)

    row.currentBatchNumber= getCurrentStockQuantity(row)
   form.value.orderPlanProductsList.outStockProduct.batchPositionList.forEach(item=>{

    let nowName = item.selectValue[1]+item.batchCode
    if(currentName === nowName){
      count ++;
          if(count > 1){
            proxy.$modal.msgWarning("重复选择，请选择其他批次！");
            item.batchCode = ''
          }
    }
  })

}
//点击选择批次库位
function SelectOutStockPosition(row){
  //给商品列赋值
  openSelectOutStockPosition.value = true;


  form.value.orderPlanProductsList.outStockProduct = row
  // console.log(row)
  if(row.planId == null){
    tempProduct.value = row
    tempProduct.value.availableNumber = row.availableNumber
  }else{
    tempProduct.value.availableNumber = row.availableNumber
  }
  selectPosition()

  form.value.orderPlanProductsList.outStockProduct.batchPositionList = [{
    productCode : tempProduct.value.productCode,
    productName : tempProduct.value.productName
  }]
}

// 采购订单多选框选中数据（单选）
function handleOrderSelectionChange(data) {

  // alert("sw")
    salesOrderSelection.value = Array.from(data);

    console.log(salesOrderSelection.value)

  if(salesOrderSelection.value.length > 1){
    return "只能选择一条订单出库"
  }
  // orderIds.value = salesOrderSelection.value.map(item => item.planId);

  multiple.value = !salesOrderSelection.value.length;

  // console.log("选中销售订单")
   salesOrderSelection.value.forEach(item=>{
      getSales(item.salesOrderId).then(response =>{

       form.value.warehouse = response.data.warehouse;
       form.value.warehouseId = response.data.warehouseId;
       form.value.unitId = response.data.unitId
       form.value.orderPlanProductsList = response.data.saleProductsList;
       console.log(form.value.orderPlanProductsList )
     })
   });
}

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
        return `${selectedLabels.join('-')}（${item.outNumber}）个`;
      }

      return `N/A（${item.outNumber}）个`; // 如果选择值不符合预期的格式，返回默认值
    });

    return formattedList.join('<br>');
  }

  return '选择出库：位置-批次';
}
/** 根据商品和库位   获得商品批次数量list */
function getProductBatchNumbers(productCode,stockPositionId){
  const data={}
  data.productCode = productCode;
  data.stockPositionId = stockPositionId;

  let tempList = []
  productBatchNumbers.value = []
  getProductBatchNumberList(data).then(response=>{
    tempList = response.data;
    for(let i=0;i<tempList.length;i++){
      const stockMatch = tempList[i].batchName.match(/\(库存:(\d+)\)/);
      if(stockMatch[1]>0){
        productBatchNumbers.value.push(tempList[i]);
      }
    }
  })
}

const handlePositionChange = (row) => {
  // 在PositionOptions中找到所选位置
   // 根据ID在PositionOptions中找到位置的方法
  let selectValue = row.selectValue
  let wid=selectValue[0];
  PositionOptions.value.forEach(row1=>{
    if(row1.id == wid){

      const children = ref([])
      children.value = row1.children
      children.value.forEach(item=>{
        if(item.id == selectValue[1]){
          row.batchList = []
          for(let i=0;i<item.batchList.length;i++){
            if(item.batchList[i].batchNums>0){
              row.batchList.push(item.batchList[i])
            }
          }
         }
      })
    }
  })
  // 更新行的batchList属性
 };
//计算当前已选数量和判断是否超过
const currentInputNum = () => {
  let currentCount = 0;
  form.value.orderPlanProductsList.outStockProduct.batchPositionList.forEach((row) => {
    // 使用parseInt确保row.outNumber是数字类型
    currentCount += parseInt(row.outNumber, 10) || 0;
  });
  return currentCount;
};
//获得仓库的库位数据
function selectPosition(){
  const data = {}
  data.warehouseId = form.value.warehouseId;
  data.productCode = tempProduct.value.productCode;
  getWarehousePosition(data).then(response => {
    PositionOptions.value = response.data;
  });
}
function removeProductBatchRow(row) {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    const index = form.value.orderPlanProductsList.outStockProduct.batchPositionList.findIndex(item => item === row);
    if (index !== -1) {
      form.value.orderPlanProductsList.outStockProduct.batchPositionList.splice(index, 1);
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
  getOrderAuditRecord(row.outStockId).then(response=>{
    tooltipAuditContent.value= response.data

    tooltipAuditContent.value = '审核人: '+tooltipAuditContent.value.userName +
        '  审核时间:'+ tooltipAuditContent.value.createTime +
        '  备注:'+tooltipAuditContent.value.auditRemark;
  })
};
// 当需要添加新行时触发的函数或事件处理程序
function addProductBatchRow() {

  // 创建一个空对象或空数据结构
  const batchPosition = {
    selectValue: [], // 复制第一行的仓库信息
    warehouseId: '',
    positionId: '',
    positionName: '',
    warehouseName: '',
  };

  // 将新的空对象添加到数组中
  form.value.orderPlanProductsList.outStockProduct.batchPositionList.push(batchPosition);
}


function getReturnBatchPosition(){

  // 更新所有行的入库位置信息
  form.value.orderPlanProductsList.outStockProduct.batchPositionList.forEach(row => {
    // row.selectValue = selectValue; // 将入库位置设置为选择的值
    row.warehouseId = row.selectValue[0];
    row.positionId = row.selectValue[1];

    const foundWarehouse =  PositionOptions.value.find(option => option.id === row.warehouseId);
    // console.log(foundWarehouse)
     row.warehouseName = foundWarehouse.label
    const foundPosition = foundWarehouse.children.find(child => child.id === row.positionId);
    // console.log(foundPosition)
     row.positionName = foundPosition.label.replace(/\(库存: \d+\)/, '');

    // console.log("仓库库位："+row.warehouseName+"-"+row.positionName)
  });


  openSelectOutStockPosition.value=false;
}



// 接收参数
const outStockId = ref(route.query.outStockId);
function addOrUpdate(){
  if(outStockId.value == null){
    alert("新增")
  }else{
    alert("修改xiaos")
    getOutStock(outStockId.value).then(response => {
      form.value = response.data;
      salesOrderSelection.value = form.value.salesOrderSelection;
      // form.value.orderPlanProductsList = form.value.orderPlanProductsList;
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