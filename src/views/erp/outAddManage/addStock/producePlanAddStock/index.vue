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
    <div style="margin-top: 10px "> <span >生产订单信息 </span>
      <el-button
          type="primary"
          plain
          icon="Plus"
          size="small"
          style="margin-left: 10px;"
          @click="handleSelectOrder"
      >选择生产计划</el-button>
    </div>

    <el-table
        :data="orderSelection"
        height="220px"
        style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
    >

      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="计划单号" align="center" width="120px" >
        <template #default="scope">
          <!-- 使用 <a> 标签来包装数据，并添加样式 -->
          <a
              href="#"
              style="color: rgba(40,177,232,0.83); text-decoration: underline;"
              @click="handleOrderDetailClick(scope.row)"
          >
            {{ scope.row.planCode }}
          </a>
        </template>
      </el-table-column>

      <el-table-column label="单据名称" align="center" prop="planName" width="100px"  />

      <el-table-column label="计划日期" prop="planTime" width="100px" align="center"/>
      <el-table-column label="备注" prop="remark" width="110px" align="center"/>

      <el-table-column label="成品编号" align="center" prop="productForm.productName" width="100px"  />
      <el-table-column label="商品信息" align="center" >
        <template #default="scope">
          <span style="display: block;"> {{ scope.row.productForm.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.productForm.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.productForm.productModel }}</span>
          <span style="display: block;">最小包装数量:{{ scope.row.productForm.minpacketNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划入库数量" align="center" prop="groupNumber" width="100px"/>
      <el-table-column label="可入库数量" align="center" prop="" width="100px"/>
      <el-table-column label="合格数量" align="center">
        <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.okNumber"  type="number" maxlength="20" placeholder="请输入合格数量" size="mini"  />
                  </span>
        </template>
      </el-table-column>
      <el-table-column label="不合格数量" align="center" >
        <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.ngNumber"  type="number" maxlength="20" placeholder="请输入不合格" size="mini"  />
                  </span>
        </template>
      </el-table-column>
      <el-table-column label="损耗数量" align="center" >
        <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.wastageNumber"  type="number" maxlength="20" placeholder="请输入损耗" size="mini"  />
                  </span>
        </template>
      </el-table-column>
      <el-table-column label="成品入库位置相关信息" align="center" width="250px">
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
    <span style="margin-top:50px"> 入库种数：       入库总额：</span>
    <!--      待二次入库商品明细表格-->
    <el-table
        :data="orderPlanProductsList"
        height="350"
        class="productAddDetailTable"
        style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"

    >

      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="编号" align="center" prop="product.productCode" width="90px"/>

      <el-table-column label="商品信息" align="center" width="120px">
        <template #default="scope">
          <span style="display: block;"> {{ scope.row.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
          <span style="display: block;">最小包装数量:{{ scope.row.minpacketNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备损量" prop="estimatedLoss" align="center" class="select-container" width="110px"/>
      <el-table-column label="需求总数" prop="usageAmount" align="center" class="select-container" width="110px"/>
      <el-table-column label="实际领料数" prop="getAmount" align="center" class="select-container" width="110px"/>
      <el-table-column label="可入库数量" prop="canAddStock" align="center" width="110px"/>

      <el-table-column label="入库数量"   align="center"  >
        <template #default="scope">
                  <span>
                    <el-input-number v-model="scope.row.addStockNumber"  type="number" maxlength="20" placeholder="请输入入库量" size="mini"  />
                  </span>
        </template>
      </el-table-column>
      <el-table-column label="损耗数量"   align="center" class="select-container" width="130px">
        <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.damageNumber"  type="number" maxlength="20" placeholder="请输入损耗" size="mini"  />
                  </span>
        </template>
      </el-table-column>


      <el-table-column label="入库位置相关信息" align="center" >
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


    <el-dialog title="选择生产订单" v-model="openSelectOrder"
               append-to-body class="dialog-selectOrder">
      <div style="">
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
        <produceOrderTable
            :planList = "planList"
            :queryParams="queryParams"
            :total="total"
            :single="single"
            :selectPlanOrderShow="selectPlanOrderShow"
            :tooltipAuditContent="tooltipAuditContent"
            @handleUpdate="handleUpdate"
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
         可入库数量：<span  style="color: rgb(82, 153, 252);">{{ tempProduct.groupNumber }}</span> &nbsp;&nbsp;
        </span>
        已输入入库数量：<span  style="color: rgb(82, 153, 252);">计算  </span>
      </div>

      <el-form
          :style="{ 'max-height': '60vh' }"
      >

        <el-table
            :data="form.orderPlanProductsList.addStockProduct.batchPositionList"
            height="250px"
            @cell-click="tabClick"
            style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
            :span-method="objectSpanMethod"
        >
          <el-table-column label="入库位置" align="center">
            <template #default="scope">
              <el-cascader
                  v-model="scope.row.selectValue"
                  :options="PositionOptions"
                  :props="{ value: 'id', label: 'label', children: 'children' }"
                  @change="handlePositionChange(scope.row.selectValue)"
              />
            </template>
          </el-table-column>

          <el-table-column label="批次" align="center">
            <template #default="scope">
            <span>
              <el-input v-model="scope.row.batchCode"  type="text" maxlength="26" placeholder="请输入批次" size="mini"  />
            </span>
            </template>
          </el-table-column>

          <el-table-column label="库存已有数量" align="center" />

          <el-table-column label="入库数量" align="center" >
            <template #default="scope">
            <span>
              <el-input v-model="scope.row.addNumber"  type="number" maxlength="26" placeholder="请输入需求" size="mini"  />
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
          <button type="button" class="el-button el-button--default el-button--mini" @click=" openSelectAddStockPosition=false">
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
import {
  AddStockList,
  getAddStock,
  ProduceAddStockList,
  updateAddStock,
  updateProduceAddStock
} from "../../../../../api/erp/addStock";
import {useRoute, useRouter} from "vue-router";
import {listUnit} from "../../../../../api/erp/customer";
import {getWarehousePosition, warehouseTreeSelect} from "../../../../../api/erp/position";
import {getOrderAuditRecord, listOrder} from "../../../../../api/erp/order";
import {listPlan} from "../../../../../api/erp/plan";
import produceOrderTable from "../../../../../components/zerp/table/produceOrderTable"


const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const  orderDetailFormShow = ref(true)
const openAddOrderStock = ref(false);
const openSelectAddStockPosition = ref(false);
const openSelectOrder = ref(false);
const multiple = ref(true);
const loading = ref(true);
const selectPlanOrderShow = ref(false);



const tabClickIndex = ref();
const tabClickLabel = ref();
const ProductsListLoading = ref(openSelectOrder);
const orderIds = ref([]);
const unitOptions = ref([]);
const warehouseOptions = ref(undefined);
const orderList = ref([]);
const tooltipAuditContent = ref({})
const PositionOptions = ref([])
const planList = ref([]);
const orderSelection = ref();
const total = ref(0);


const  selectedOrder = ref([]);
const orderPlanProductsList = ref([]);
const tempProduct = ref({})
const data = reactive({
  form: {

    addStockType: "生产计划入库",
    addStockCode:null,
    addStockName:null,
    unit: {
      unitId:('')
    },
    warehouse: {
      warehouseId:('')
    },
    warehouseName: ref(''),
    orderPlanProductsList: ref([   //订单多个商品列表
      {
        addStockProduct: ref({       //商品入库条
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



const displayTitleText = computed(() => {
  if (addStockId.value == null) {
    return '新增生产计划入库';
  } else {
    return '修改生产计划入库单';
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
function getPlanOrderList() {
  loading.value = true;
  queryParams.value.auditId="1"
  queryParams.value.planStatus = "2"
  listPlan(queryParams.value).then(response => {
    planList.value = response.rows;
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

function returnAddStock(){
  router.push("/produce/plan");
}
//提交入库单到后端
function subMitAddStockList(){
  // form.value orderPlanProductsList
  form.value.orderSelection = orderSelection.value;
  form.value.orderPlanProductsList = orderPlanProductsList.value
  if (form.value.addStockId == null) {
      AddStockList(form.value).then(response => {
        proxy.$modal.msgSuccess("新增成功");
         getList();
      });

  }else {
    updateAddStock(form.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
       getList();
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
    // form.value.orderPlanProductsList.
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
  getPlanOrderList()
}
/** 查询采购订单列表 */


//点击选择批次库位
function SelectAddStockPosition(row){
  //给商品列赋值
  openSelectAddStockPosition.value = true;
  console.log("row")
  console.log(row)

  alert()

  form.value.orderPlanProductsList.addStockProduct = row
  if(row.planId == null){
    tempProduct.value = row
  }else{
    tempProduct.value = row.productForm
  }

  form.value.orderPlanProductsList.addStockProduct.batchPositionList = [{}]
  getSpanArr(form.value.orderPlanProductsList.addStockProduct.batchPositionList);
}
// 采购订单多选框选中数据
function handleOrderSelectionChange(data) {
   orderSelection.value = Array.from(data);

  if(orderSelection.value.length > 1){
    return "只能选择一条订单入库"
  }
  // orderIds.value = orderSelection.value.map(item => item.planId);

  multiple.value = !orderSelection.value.length;

  console.log(orderSelection.value)
   orderSelection.value.forEach(item=>{
     console.log(item)
     selectedOrder.value = item
     form.value.warehouse = item.warehouse
     form.value.warehouseId = item.warehouseId
     orderPlanProductsList.value = item.productList
   });
  console.log("待入库商品list：："+ form.value.orderPlanProductsList)

   selectPosition(form.value.warehouseId)
}
//获得仓库的库位数据
function selectPosition(warehouseId){
  alert("ss")
  getWarehousePosition(warehouseId).then(response => {
    PositionOptions.value = response.data;
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
        return `${selectedLabels.join('-')}（${item.addNumber}）个`;
      }

      return `N/A（${item.addNumber}）个`; // 如果选择值不符合预期的格式，返回默认值
    });

    return formattedList.join('<br>');
  }

  return '选择入库：位置-批次';
}
//选择库位节点触发
const handlePositionChange = (selectValue) => {

  // 更新所有行的入库位置信息
  form.value.orderPlanProductsList.addStockProduct.batchPositionList.forEach(row => {
    row.selectValue = selectValue; // 将入库位置设置为选择的值
    row.warehouseId = row.selectValue[0];
    row.positionId = row.selectValue[1];
    const foundWarehouse =  PositionOptions.value.find(option => option.id === row.warehouseId);
    row.warehouseName = foundWarehouse.label
    const foundPosition = foundWarehouse.children.find(child => child.id === row.positionId);
    row.positionName = foundPosition.label

    // console.log("仓库库位："+row.warehouseName+"-"+row.positionName)
  });

  // 其他可能的操作或逻辑
};
function removeProductBatchRow(row) {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    const index = form.value.orderPlanProductsList.addStockProduct.batchPositionList.findIndex(item => item === row);
    if (index !== -1) {
      form.value.orderPlanProductsList.addStockProduct.batchPositionList.splice(index, 1);
    } else {
      alert('未找到对应行');
    }
  } else {
    alert('已取消移除');
  }
  getSpanArr(form.value.orderPlanProductsList.addStockProduct.batchPositionList);
}

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
  })
};
// 当需要添加新行时触发的函数或事件处理程序
function addProductBatchRow() {
  console.log("准备新增")
  // console.log(form.value.orderPlanProductsList.addStockProduct.batchPositionList)
  const firstRow = form.value.orderPlanProductsList.addStockProduct.batchPositionList[0];

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
  form.value.orderPlanProductsList.addStockProduct.batchPositionList.push(batchPosition);
  getSpanArr(form.value.orderPlanProductsList.addStockProduct.batchPositionList);
}


function getReturnBatchPosition(){
  openSelectAddStockPosition.value=false;
}



// 接收参数
const addStockId = ref(route.query.addStockId);
function addOrUpdate(){
  if(addStockId.value == null){

  }else{
    getAddStock(addStockId.value).then(response => {
      form.value = response.data;
      orderSelection.value = form.value.orderSelection;
      orderPlanProductsList.value = form.value.orderPlanProductsList;
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
.productAddDetailTable{
  background : #eef1f6;
  color: #606266
  /*:header-cell-style = "{background:'#eef1f6',color:'#606266'}"*/
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