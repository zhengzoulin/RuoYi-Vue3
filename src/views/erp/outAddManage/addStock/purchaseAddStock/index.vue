<template>
<div class="app-container">
  <el-row class="header">
    <router-link to="/outAddManage/addStock">
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
        <el-button type="primary" plain  icon="primary" @click="subMitAddStockAndAuditPass">保存并审核通过</el-button>
      </el-col>
      <el-col :span="24"    style="position: absolute; top: 0; right: 20px; width: auto;">
        <el-button type="primary" plain icon="primary" @click="subMitAddStockList">保存</el-button>
      </el-col>
    </div>

  </el-row>

  <span > 入库单基本信息
        <el-button link type="primary" icon="list" @click="orderDetailFormShow = !orderDetailFormShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
  <el-form ref="orderRef" v-show="orderDetailFormShow"  :model="form" :rules="rules" :inline="true" label-width="80px"
           style="border-top: dashed 1.3px rgba(187,199,191,0.35) ;padding: 8px">
    <el-row>
      <el-form-item label="入库单号" prop="addStockCode" class="select-container" >
        <el-input v-model="form.addStockCode" placeholder="保存后自动生成" class="readonly-tree-select" style="width: 180px;"/>
      </el-form-item>
      <el-form-item label="单据名称" prop="addStockName">
        <el-input v-model="form.addStockName" placeholder="请输入单据名称" style="width: 180px;" />
      </el-form-item>
      <el-form-item label="入库类型" prop="addStockType" class="select-container" >
        <el-input v-model="form.addStockType" placeholder="保存后自动生成" class="readonly-tree-select" style="width: 180px;"/>
      </el-form-item>


      <el-form-item label="发货方" prop="unitId">
        <el-select v-model="form.unitId"  placeholder="采购订单获取" class="readonly-tree-select"
        >
          <el-option
              v-for="item in unitOptions"
              :key="item.unitId"
              :label="item.unitName"
              :value="item.unitId"
              style="width: 140px;"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
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


      <el-form-item label="入库日期" prop="addStockTime">
        <el-date-picker clearable
                        v-model="form.addStockTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择订单交货日期"
                        style="width: 180px;">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="订单备注" prop="remark">
        <el-input v-model="form.remark" type="text" placeholder="请输入" style="width: 180px;"/>
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

  <el-table v-loading="ProductsListLoading"
            :data="form.selectedOrder"
            :rules="rules"
            height="150px"
            @cell-click="tabClick"
            style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
  >

    <el-table-column type="selection" width="55" align="center" />

    <el-table-column label="采购订单编号" align="center" prop="purchaseOrderId">
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

    <el-table-column label="单据名称" align="center" prop="purchaseOrderName"/>

    <el-table-column label="下单日期" prop="createTime" align="center" />
    <el-table-column label="交货日期" prop="purchaseOrderTime" />
    <!--          <template #default="scope">-->
    <!--            <span>-->
    <!--              <el-input v-model="scope.row.demandNumber" @input="calculateorderMoney(scope.row)" type="number" maxlength="26" placeholder="请输入需求" size="mini"  />-->
    <!--            </span>-->
    <!--          </template>-->

    <el-table-column label="供应商" align="center" prop="unit.unitName"/>
    <el-table-column label="备注" prop="remark"/>
    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <template #default="scope">
        <el-button link type="danger" icon="delete" @click="removeOrderRow(scope.row)">移除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div style="margin-top: 10px "> <span >采购入库商品明细 </span>
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
  <span style="margin-top:50px"> 入库种数：{{form.orderProductsList.length}}      入库总额：{{}}</span>
  <!--      待入库商品明细表格-->
  <el-table v-loading="ProductsListLoading"
            :data="form.orderProductsList"
            :rules="rules"
            height="350"
            class="productAddDetailTable"
            style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
            @cell-click="tabClick">

    <el-table-column type="selection" width="55" align="center" />
    <el-table-column type="index" width="55" align="center" label="序号" />
    <el-table-column label="编号" align="center" prop="productCode"/>

    <el-table-column label="商品信息" align="center" prop="productName"/>
    <el-table-column label="可入库数量" prop="demandNumber" align="center" >

    </el-table-column>

    <el-table-column label="金额" prop="orderMoney" align="center" class="select-container"/>
    <el-table-column label="成本价" align="center" prop="costPrice" width="100px">
      <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.costPrice"  type="number" maxlength="20" placeholder="请输入"  size="mini"  />
                  </span>
      </template>
    </el-table-column>

    <el-table-column label="备注" prop="remark" align="center"  width="90px"/>

    <el-table-column label="入库数量" prop="demandNumber" align="center"  width="120px">
      <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.demandNumber"  type="number" maxlength="20" placeholder="请输入需求" size="mini"  />
                  </span>
      </template>
    </el-table-column>

    <el-table-column label="入库位置相关信息" align="center" width="240px">
      <template #default="scope">
        <a
            href="#"
            class="custom-link-style"
            @click="SelectAddStockPosition(scope.row)"
            v-html="String.raw`${formatBatchPosition(scope.row)}`"
        ></a>
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
            v-model="queryOrderParams.queryOrderParams"
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
            check-strictly
            @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="订单交货日期" prop="purchaseOrderTime">
        <el-date-picker clearable
                        v-model="queryOrderParams.purchaseOrderTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择订单交货日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleOrderQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <order-table
        :loading="loading"
        :orderList="orderList"
        :tooltipAuditContent="tooltipAuditContent"
        @handleSelectionChange="handleOrderSelectionChange"
        @handleOrderDetailClick="handleOrderDetailClick"
        @showAuditTooltip="showAuditTooltip"
        @handleUpdate="handleUpdate"
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

  <!--  选择入库位置批次  //-->
  <el-dialog
      title="选择入库位置" v-model="openSelectAddStockPosition"
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
         可入库数量：<span  style="color: rgb(82, 153, 252);">{{ tempProduct.demandNumber }}</span> &nbsp;&nbsp;
        </span>
      已输入入库数量：<span  style="color: rgb(82, 153, 252);">{{currentInputNum()}}</span>
    </div>

    <el-form
        :style="{ 'max-height': '60vh' }"
    >

      <el-table
          :data="form.orderProductsList.addStockProduct.batchPositionList"
          height="250px"
          @cell-click="tabClick"
          style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
          :span-method="objectSpanMethod"
      >

        <el-table-column label="入库位置" align="center" width="230">
          <template #default="scope">
            <el-cascader
                v-model="scope.row.selectValue"
                :options="PositionOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                @change="handlePositionChange(scope.row.selectValue)"
            />
          </template>
        </el-table-column>

        <el-table-column label="批次" align="center" width="245">
          <template #default="scope">
            <el-select v-model="scope.row.batchCode" placeholder="采购订单获取" >
              <el-option
                  v-for="item in productBatchNumbers"
                  :key="item.batchCode"
                  :label="item.batchName"
                  :value="item.batchCode"
                  style="width: 250px;"
                  class="custom-option"
                  @click="BatchCanbeSelected(item.batchCode)"
              ></el-option>
              <template #footer>
                <el-button text bg style="width: 250px; height: 40px;" @click="showAddBatch">
                  <span>新增批次</span>
                </el-button>
              </template>
            </el-select>

          </template>
        </el-table-column>

        <el-table-column label="库存已有数量" align="center">
          <template #default="scope">
            <span>
              {{ getCurrentStockQuantity(scope.row.batchCode) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="入库数量" align="center" width="180">
          <template #default="scope">
            <span>
              <el-input
                  v-model="scope.row.addNumber"
                  type="number"
                  maxlength="26"
                  min="0"
                  placeholder="请输入需求"
                  size="mini"
                  :rules="getInputRules()"
              />
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
        <button type="button" class="el-button el-button--default el-button--mini">
          <span>取消</span>
        </button>
        <button type="button" class="el-button el-button--primary el-button--mini" @click="getReturnBatchPosition">
          <span>确定</span>
        </button>
      </div>

    </el-form>



  </el-dialog>


  <add-batch-dialog
      :openAddBatch="openAddBatch"
      @submitAddBatch="submitAddBatch"
  />

</div>
</template>

<script setup>


import {ref} from "vue";
import {AddStockList, getAddStock, updateAddStock} from "../../../../../api/erp/addStock";
import {listUnit} from "../../../../../api/erp/unit";
import {getProductBatchNumberList, getWarehousePosition, warehouseTreeSelect} from "../../../../../api/erp/position";
import {getOrderAuditRecord, listOrder} from "../../../../../api/erp/order";
import OrderTable from "../../../purchaseManage/order/orderTable";
import {useRoute, useRouter} from "vue-router";
import AddBatchDialog from "../../../../../components/zerp/public/addBatchDialog";
import {addBatch} from "../../../../../api/erp/batch";

const orderDetailFormShow = ref(true)
const openAddOrderStock = ref(false);
const openSelectAddStockPosition = ref(false);
const openSelectOrder = ref(false);
const openAddBatch = ref(false);
const multiple = ref(true);
const loading = ref(true);


const tabClickIndex = ref();
const tabClickLabel = ref();
const ProductsListLoading = ref(openSelectOrder);
const orderIds = ref([]);
const unitOptions = ref([]);
const warehouseOptions = ref(undefined);
const orderList = ref([]);
const tempProduct = ref({})

const tooltipAuditContent = ref({})
const PositionOptions = ref([])
const productBatchNumbers = ref([
  {
    batchCode:101,
    batchName:'hhh101'
  },
  {
    batchCode:102,
    batchName:'hhh102'
  }
])
const orderSelection = ref();



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
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    addStockCode: null,
    addStockName: null,
    addStockType: "采购入库",
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

    addStockName: [
      { required: true, message: "单据名称不能为空", trigger: "blur" }
    ],
    addStockType: [
      { required: true, message: "入库类型不能为空", trigger: "change" }
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
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();


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
// tabClick row 当前行 column 当前列
function tabClick (row, column, cell, event) {
  switch (column.label) {
    case '顺序':
      tabClickIndex.value = row.index
      tabClickLabel.value = column.label
      break
    default: return
  }
  // console.log('tabClick', this.tabClickIndex, row.demandNumber)
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


//提交入库单到后端
function subMitAddStockList(){

  // console.log("id是：")
   console.log(form.value)
  if (form.value.addStockId == null) {
      AddStockList(form.value).then(response => {
        proxy.$modal.msgSuccess("新增成功");
      });

  }else {
    updateAddStock(form.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
    })
  }
  router.push("/outAddManage/addStock");
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
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  openAddOrderStock.value = true;

  const _addStockId = row.addStockId || ids.value
  getAddStock(_addStockId).then(response => {
    form.value = response.data;
    // form.value.orderProductsList.
    // selectPosition(form.value.warehouseId)
    title.value = "修改入库表";
  });
}
//选择采购订单带入入库单
function selectedOrderList(){
  openSelectOrder.value = false;
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
    loading.value = false;
  });
}
//入库规则数量判断
const getInputRules = () => {
  return [
    { required: true, message: '请输入需求2', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const inputValue = parseInt(value, 10) || 0;
        if (inputValue + currentInputNum() > form.value.orderProductsList.addStockProduct.demandNumber) {
          callback(new Error('总入库数量不能超过需求数量'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ];
};

//current批次库存
const getCurrentStockQuantity = (batchCode) => {
  const batchInfo = productBatchNumbers.value.find(item => item.batchCode === batchCode);
  return batchInfo ? extractStockQuantity(batchInfo.batchName) : '';
};

const extractStockQuantity = (batchName) => {
  const stockMatch = batchName.match(/\(库存:(\d+)\)/);
  return stockMatch ? stockMatch[1] : '0';
}
//计算当前已选数量和判断是否超过
const currentInputNum = () => {
  let currentCount = 0;
  form.value.orderProductsList.addStockProduct.batchPositionList.forEach((row) => {
    // 使用parseInt确保row.addNumber是数字类型
    currentCount += parseInt(row.addNumber, 10) || 0;
  });
  return currentCount;
};

//判断批次是否已选
function BatchCanbeSelected(batchCode){

  let count = 0
  form.value.orderProductsList.addStockProduct.batchPositionList.forEach(item=>{

    if(item.batchCode == batchCode){
      count ++;
      if(count > 1){
        proxy.$modal.msgWarning("重复选择，请选择其他批次！");
        item.batchCode = ''
      }
    }
  })
}


//新增批次
function showAddBatch(){
  openAddBatch.value = false;
  openAddBatch.value = true;
}
function submitAddBatch(data){
    // console.log(form.value)
  addBatch(form.value).then(response =>{
    openAddBatch.value = false;
    proxy.$modal.msgSuccess("新增成功");
    getProductBatchNumbers(form.value.orderProductsList.addStockProduct.productCode,selectValueTemp.value[1])

  })
}
//获得仓库的库位数据
function selectPosition(){
  const data={}
  data.productCode = tempProduct.value.productCode;
  data.warehouseId = form.value.warehouseId;
  getWarehousePosition(data).then(response => {
    PositionOptions.value = response.data;
  });

 }
//选择批次库位
function SelectAddStockPosition(row){

  openSelectAddStockPosition.value = true;

console.log("批次商品赋值")
  console.log(form.value.orderProductsList)
  form.value.orderProductsList.addStockProduct = row
  console.log(form.value.orderProductsList)

  tempProduct.value = row
  tempProduct.value.demandNumber = row.demandNumber

  selectPosition()
  form.value.orderProductsList.addStockProduct.batchPositionList = [{
      productCode : tempProduct.value.productCode,
      productName : tempProduct.value.productName
  }]
  getSpanArr(form.value.orderProductsList.addStockProduct.batchPositionList);
}
// 采购订单多选框选中数据
function handleOrderSelectionChange(data) {
  orderSelection.value = Array.from(data);
  if(orderSelection.value.length > 1){
    return "只能选择一条订单入库"
  }
  console.log("选中订单")
  console.log(orderSelection.value)
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

  //可能以后需要多选订单，这里遍历list只拿到一个订单包含的商品，放入下面的商品暂存表格
  // form.value.orderProductsList = orderSelection.value.demandProductsList
  form.value.orderProductsLists = orderSelection.value.map(item => item.demandProductsList)
// 遍历 orderProductsLists 数组
  for (const productList of form.value.orderProductsLists) {
    // form.value.orderProductsList.push(productList);
    // 这里可以对每个 productList 进行处理
    form.value.orderProductsList = productList;
    // console.log(productList)
  }

  console.log("多选框入库商品：：" )
  console.log( form.value)
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
        return `${selectedLabels.join('-')}（${item.addNumber}）个`;
      }

      return `N/A（${item.addNumber}）个`; // 如果选择值不符合预期的格式，返回默认值
    });

    return formattedList.join('<br>');
  }

  return '选择入库：位置-批次';
}
//选择库位节点触发
const selectValueTemp = ref([])
const handlePositionChange = (selectValue) => {
  selectValueTemp.value = selectValue
  // console.log("position选择数据：" + selectValue);

  // 其他可能的操作或逻辑
  getProductBatchNumbers(form.value.orderProductsList.addStockProduct.productCode,selectValue[1])
};
/** 根据商品和库位   获得商品批次数量list */
function getProductBatchNumbers(productCode,stockPositionId){
    const data={}
   data.productCode = productCode;
    data.stockPositionId = stockPositionId;

  getProductBatchNumberList(data).then(response=>{
    productBatchNumbers.value = response.data
  })
}
function removeProductBatchRow(row) {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    const index = form.value.orderProductsList.addStockProduct.batchPositionList.findIndex(item => item === row);
    if (index !== -1) {
      form.value.orderProductsList.addStockProduct.batchPositionList.splice(index, 1);
    } else {
      alert('未找到对应行');
    }
  } else {
    alert('已取消移除');
  }
  getSpanArr(form.value.orderProductsList.addStockProduct.batchPositionList);
}
const displayTitleText = computed(() => {
  if (addStockId.value == null) {
    return '新增采购入库';
  } else {
    return '修改采购入库单';
  }
});
const showAuditTooltip = (row) => {
  // 生成tooltip的内容，可以根据rowData的信息来设置tooltip内容
  if(row.auditId == 0){
    return;
  }
  getOrderAuditRecord(row.addStockId).then(response=>{
    tooltipAuditContent.value= response.data

    tooltipAuditContent.value = '审核人: '+tooltipAuditContent.value.userName +
        '  审核时间:'+ tooltipAuditContent.value.createTime +
        '  备注:'+tooltipAuditContent.value.auditRemark;

    // console.log(tooltipAuditContent.value)
  })

};
// 当需要添加新行时触发的函数或事件处理程序
function addProductBatchRow() {
  console.log("准备新增")
  // console.log(form.value.orderProductsList.addStockProduct.batchPositionList)
  const firstRow = form.value.orderProductsList.addStockProduct.batchPositionList[0];

  // 创建一个空对象或空数据结构
  const batchPosition = {
    selectValue: [...firstRow.selectValue], // 复制第一行的仓库信息
    productCode: firstRow.productCode,
    productName: firstRow.productName,
    warehouseId: firstRow.warehouseId,
    positionId: firstRow.positionId,
    positionName: firstRow.positionName,
    warehouseName: firstRow.warehouseName,
    batch: '' // 你可能需要根据需要初始化其他属性
  };

  // 将新的空对象添加到数组中
  form.value.orderProductsList.addStockProduct.batchPositionList.push(batchPosition);
  getSpanArr(form.value.orderProductsList.addStockProduct.batchPositionList);
}
function getReturnBatchPosition(){

  // 更新所有行的入库位置信息
  form.value.orderProductsList.addStockProduct.batchPositionList.forEach(row => {
    row.warehouseId = row.selectValue[0];
    row.positionId = row.selectValue[1];
    const foundWarehouse =  PositionOptions.value.find(option => option.id === row.warehouseId);
    row.warehouseName = foundWarehouse.label
    const foundPosition = foundWarehouse.children.find(child => child.id === row.positionId);
    row.positionName = foundPosition.label.replace(/\(库存: \d+\)/, '');
    console.log("仓库库位："+row.warehouseName+"-"+row.positionName)
  });

  openSelectAddStockPosition.value=false;
}


// 接收参数
const addStockId = ref(route.query.addStockId);
function addOrUpdate(){
  if(addStockId.value == null){

  }else{
    getAddStock(addStockId.value).then(response => {
    form.value = response.data;

   });
  }
}


addOrUpdate();
getUnitList()
getWarehouseTree()
</script>



<style>

.el-table{

}
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
.custom-option {
  display: block; /* 使宽度生效 */
}

.el-select-dropdown {
  margin-top: 0; /* 下拉框默认在下方 */
}
</style>