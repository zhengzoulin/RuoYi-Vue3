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
      <el-form-item label="需求编号" prop="demandCode"  v-show="!showQuery">
        <el-input
          v-model="queryParams.demandCode"
          placeholder="请输入需求编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

        <el-form-item label="需求来源" prop="demandSource" v-show="!showQuery">
          <el-select
              v-model="queryParams.demandSource"
              placeholder="请选择需求来源"
              clearable
              style="width: 200px"
           >
            <el-option label="手动添加" value="手动"></el-option>
            <el-option label="生产补料" value="生产补料"></el-option>
            <el-option label="销售补料" value="销售补料"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="需求状态" prop="demandStatus"  v-show="!showQuery">
        <el-select
            v-model="queryParams.demandStatus"
            placeholder="请选择需求状态"
            clearable
            style="width: 190px"
        >
          <el-option label="待处理" value="待处理"></el-option>
          <el-option label="已处理" value="已处理"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品编号" prop="productId"  v-show="!showQuery">
        <el-input
            v-model="queryParams.productCode"
            placeholder="请输入商品编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productId"  v-show="!showQuery">
        <el-input
            v-model="queryParams.productName"
            placeholder="请输入商品"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属仓库" prop="warehouseId"  v-show="!showQuery">
           <el-tree-select
              v-model="queryParams.warehouseId"
              :data="warehouseOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="请选择仓库"
              style="width: 170px"
          />
       </el-form-item>
        <el-form-item label="日期" v-if="!showQuery">
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
              style="width: 220px"
          />
        </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button class="el-button--text" @click="changeQuery"><span>切换高级搜素</span></el-button>

      </el-form-item>
    </el-form>
    </el-row>


    <el-row :gutter="10" class="operRow">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          @click="handleAdd"
          v-hasPermi="['erp:demand:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:demand:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['erp:demand:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['erp:demand:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            @click="addPurchaseList"
        >加入采购列表</el-button>
      </el-col>
      <el-col :span="15" style="margin-right: 50px">
        <el-badge :value="purchaseCarLists.length" class="item" style="margin-left: 90%;">
          <el-image @click="clickPurchaseCar" style="width: 70px; height: 60px" :src="carUrl" :fit="fit" />
        </el-badge>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="demandList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="需求编号" align="center" prop="demandCode" />
      <el-table-column label="商品" align="center">
        <template #default="scope">
          <span style="display: block;">商品:{{ scope.row.product.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.product.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.product.productModel }}</span>

          <span style="display: block;">最小包装数量:{{ scope.row.product.minpacketNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标仓库" align="center" prop="warehouse.warehousePath" />
      <el-table-column label="采购需求数量" align="center" prop="demandNumber" />
      <el-table-column label="需求来源" align="center" prop="demandSource" />
      <el-table-column label="需求状态" align="center" prop="demandStatus" >
        <template #default="scope">
          <el-tag :type="{
            '待处理': 'danger',       // 待处理
            '已处理': 'success',    // 已处理
          }[scope.row.demandStatus]"> {{ OrderProgress(scope.row.demandStatus) }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" align="center" prop="createTime" />

      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:demand:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:demand:remove']">删除</el-button>
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





    <!--    商品选择框-->
    <el-dialog :title="title" v-model="openProduct" width="950px"  append-to-body>

<!--      //第一步:定义出4个步骤-->
      <el-steps :active="active" finish-status="success">
        <el-step title="第一步" />
        <el-step title="第二步" />
        <el-step title="第三步" />
      </el-steps>

<!--      //第二步:定义form表单-->
      <el-form
          ref="demandRef"
          :model="demandForm"
          :rules="rules"
          label-position="left"
          label-width="80px"
          style="width: 850px;
          margin-left: 30px">

<!--        //第三步:定义4个盒子对象active => 1 到 4-->
        <div v-show="active === 1">
<!--         商品选择组件-->

          <ProductTable  :productList="productList"
                         :productRows="productRows"
                         @queryProduct="childProductQuery"
                         @getSelectProduct="getChildProductList"
                         @getProductDetail="getChildProductDetail"
          >

          </ProductTable>
        </div>
        <div v-show="active === 2">
          <el-form-item label="选择目标仓库" prop="warehouseId">
            <el-tree-select
                v-model="demandForm.warehouseId"
                :data="warehouseOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                placeholder="请选择仓库"
            />
          </el-form-item>
        </div>
        <div v-show="active === 3">
          <el-table v-loading="loading" :data="demandForm.demandProductsList" :rules="demandRules"   @cell-click="tabClick">
<!--            <el-table-column type="selection" width="55" align="center" />-->

            <el-table-column label="商品编号" align="center" prop="productCode" />
            <el-table-column label="商品名称" align="center" prop="productName" />
            <el-table-column label="商品图片" prop="productImage" align="center" >
              <template  #default="scope" width="90">
                <ImagePreview style="width:60px;height:60px;" :src="scope.row.productImage" />
              </template>
            </el-table-column>
            <el-table-column label="厂家型号" align="center" prop="productModel" />
            <el-table-column label="封装规格" align="center" prop="encapStandard" />

            <el-table-column label="需求数量" prop="demandNumber">
              <template #default="scope">
            <span>
              <el-input v-model="scope.row.demandNumber" type="number" maxlength="26" placeholder="请输入需求" size="mini"  />
            </span>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark">
              <template #default="scope">
            <span>
              <el-input v-model="scope.row.remark" type="text" maxlength="50" placeholder="备注" size="mini"  />
            </span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button link type="primary" icon="list" @click="handleDetail(scope.row)" v-hasPermi="['erp:product:edit']">详细</el-button>
                <el-button link type="danger" icon="delete" @click="removeRow(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-form>

<!--      第五步:设置上一步和下一步的按钮-->
      <el-button v-if="active > 1" style="margin-top: 12px" @click="preStep">上一步</el-button>

      <el-button v-if="active < 3" style="margin-top: 12px" @click="nextStep">下一步</el-button>
      <el-button v-if="active === 3" style="margin-top: 12px" @click="submitDemandForm">确 定</el-button>

    </el-dialog>


    <!-- 查看商品详细对话框 -->
    <ProductDetail
        :title="title"
        :openProductDetail="openProductDetail"
        :productForm = "productForm"
        :catalogOptions="catalogOptions"
    />

    <el-dialog :title="title" v-model="openPurchaseCar" width="950px"  append-to-body>
      <el-row class="mb8">
        <div>
          <span>已选商品数量： {{calculatePurchaseLength()}}</span>
          <span style="margin-left: 20px">采购数量： {{calculatePurchaseQuantity()}}</span>
        </div>
      </el-row>
      <el-table v-loading="loading" :data="purchaseCarLists" @selection-change="handleSelectionCarChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="商品编号" align="center" prop="product.productName" />
        <el-table-column label="商品信息" align="center">
          <template #default="scope">
            <span style="display: block;">商品:{{ scope.row.product.productName }}</span>
            <span style="display: block;">封装规格:{{ scope.row.product.encapStandard }}</span>
            <span style="display: block;">厂家型号:{{ scope.row.product.productModel }}</span>
            <span style="display: block;">最小包装数量:{{ scope.row.product.minpacketNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购需求数量" align="center" prop="demandNumber" />
        <el-table-column label="采购目标仓库" align="center" prop="warehouse.warehousePath" />
        <el-table-column label="需求来源" align="center" prop="demandSource" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Delete" @click="removeRow(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 10px 10px;padding-left: 85%"  >
        <el-button type="danger" plain  @click="GoPurchaseOrder" :disabled="goPurchaseButton">
          采购选择商品
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script setup name="Demand">
import { listDemand, getDemand, delDemand, addDemand, updateDemand } from "@/api/erp/demand";
import { listProduct } from "@/api/erp/product";

import {ref,reactive} from "vue";
import {getProduct} from "../../../api/erp/product";
import {catalogTreeSelect} from "../../../api/erp/catalog";
import {warehouseParentTreeSelect, warehouseTreeSelect} from "../../../api/erp/position";
import ProductTable from "../../../components/zerp/table/productTable";
 import {useRouter} from "vue-router";



const router = useRouter();
const { proxy } = getCurrentInstance();

const carUrl = ref('src/assets/images/cart.7d6f325b.svg')
const demandList = ref([]);
const productList = ref([]);
const catalogOptions = ref(undefined);
const catalogName = ref("");
const warehouseOptions = ref(undefined);

const open = ref(false);
const openProduct = ref(false);
const openProductDetail = ref(false);
const openPurchaseCar = ref((false))

const loading = ref(true);
const showSearch = ref(true);
const showQuery = ref(true);
const goPurchaseButton = ref(true)

const ids = ref([]);
const productIds = ref([]);
const productRows = ref([]);
const purchaseCarLists = ref([]);
const commitCarLists = ref([]);


const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const active =ref(1);
const tabClickIndex = ref();
const tabClickLabel = ref();
const row = ref();


const data = reactive({
  form: {},
  productForm:{},
  demandForm:{
    demandProductsList:ref([]),
    remark:null,
    warehouseId: null,
  },

  queryProductParams: {
    pageNum: 1,
    pageSize: 10,
    brandId: null,
    productId: null,
    catalogId: null,
    productCode: null,
    productName: null,
    productSource: null,
    productAddOrigin: null,
    status: null,
    statusValue: false
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    demandCode: null,
    productId: null,
    warehouseId: null,
    demandNumber: null,
    demandSource: null,
    demandStatus: null,
    status: null,
  },
  demandRules: {
    // 规则定义
    // 需求数量字段必填
    demandNumber: [{ required: true, message: '需求数量不能为空', trigger: 'blur' }]
  },
  rules: {
    demandCode: [
      { required: true, message: "需求编号不能为空", trigger: "blur" }
    ],
    productId: [
      { required: true, message: "商品id不能为空", trigger: "blur" }
    ],
    warehouseId: [
      { required: true, message: "所属仓库不能为空", trigger: "blur" }
    ],
    demandNumber: [
      { required: true, message: "采购需求数量不能为空", trigger: "blur" }
    ],
    demandSource: [
      { required: true, message: "需求来源不能为空", trigger: "blur" }
    ],
    demandStatus: [
      { required: true, message: "需求状态不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams,queryProductParams, form,demandForm,
  productForm,rules ,demandRules} = toRefs(data);



// const multipleTableRef = ref();
const select_order_number = ref(''); // 表格select选中的条数
const select_orderId = ref([]); // 表格select复选框选中的id
const multipleSelection = ref([]);
// 选中的list
const getRowKeys = (row) => {
// 记录每行的key值
return row;
}
// 当表格选择项发生变化时会触发该事件
const handleDemandSelectionChange = (val) => {
if (val) {
val.forEach((row) => {
  if (row && !productIds.value.some(item => item.productId === row.productId)) {
    productIds.value.push(row);
  }
  });
}
  }

const selection = ref();

const removeRow = (row) => {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    alert(row)
    const index = demandForm.value.demandProductsList.findIndex(item => item.productId === row.productId);
    if (index !== -1) {
      demandForm.value.demandProductsList.splice(index, 1);
      alert('成功移除该行');
    } else {
      alert('未找到对应行');
    }
  } else {
    alert('已取消移除');
  }
};

function tableRowClassName ({ row, rowIndex }) {
  // 把每一行的索引放进row
  row.index = rowIndex
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
  console.log('tabClick', this.tabClickIndex, row.demandNumber)
}
// 失去焦点初始化
function inputBlur (row) {
  // console.log('row', row)
  tabClickIndex.value = null
  tabClickLabel.value = ''
}


// 步骤条下一步的方法
function nextStep() {

  demandForm.value.demandProductsList = productRows.value

  active.value += 1;
  if (active > 3){
    active.value = 1
  }
}
// 步骤条上一步的方法
function preStep() {
  active.value--;
  if (active < 2){
    active.value = 1
  }
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

/** 查看详细按钮操作 */
function handleDetail(row) {
  reset();
  getCatalogTree();

  const _productId = row.productId || ids.value
  getProduct(_productId).then(response => {
    productForm.value = response.data;
    openProductDetail.value = true;
    title.value = "商品详情";
  });
}

/** 查询采购需求列表 */
function getList() {
  loading.value = true;
  listDemand(queryParams.value).then(response => {
    demandList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 查询商品列表 */
function getProductList() {
  loading.value = true;
  listProduct(queryProductParams.value).then(response => {
    productList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(catalogName, val => {
  proxy.$refs["catalogTreeRef"].filter(val);
});
/** 查询目录下拉树结构 */
function getCatalogTree() {
  catalogTreeSelect().then(response => {
    catalogOptions.value = response.data;
  });
};
/** 查询仓库下拉树结构 */
function getWarehouseTree() {
  warehouseParentTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    demandId: null,
    demandCode: null,
    productId: null,
    warehouseId: null,
    demandNumber: null,
    demandSource: null,
    demandStatus: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("demandRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 商品搜索按钮操作 */
function handleProductQuery() {
  queryProductParams.value.pageNum = 1;
  getProductList();
}

/** 重置按钮操作 */
function resetQuery() {
  // proxy.resetForm("queryRef");
  queryParams.value = {}

  handleQuery();
}
function changeQuery(){
  showQuery.value = !showQuery.value;
  queryParams.value ={}

}
/** 重置商品按钮操作 */
function resetProductQuery() {
  proxy.resetForm("queryProductRef");
  handleProductQuery();
}


/** 新增按钮操作 */
function handleAdd() {
  reset();
  productRows.value = [];
  resetProductQuery();
  active.value=1
  getProductList();
  openProduct.value = true;
  handleLogout();
  title.value = "添加采购需求";
}

// 在退出功能触发时调用的方法
const handleLogout = () => {
  // 清除选中记录
  multipleSelection.value = []; // 清空选中列表
  select_order_number.value = ''; // 清空选中条数
  select_orderId.value = []; // 清空选中的 ID 数组
  productIds.value = [];
  // 其他清理操作...
  // 进行退出操作...
}


/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _demandId = row.demandId || ids.value
  getDemand(_demandId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改采购需求";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["demandRef"].validate(valid => {
    if (valid) {
      if (form.value.demandId != null) {
        updateDemand(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDemand(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 提交新增需求按钮 */
function submitDemandForm() {

  proxy.$refs["demandRef"].validate(valid => {
    if (valid) {
        addDemand(demandForm.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          openProduct.value = false;
          getList();
        });
      }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _demandIds = row.demandId || ids.value;
  proxy.$modal.confirm('是否确认删除采购需求编号为"' + _demandIds + '"的数据项？').then(function() {
    return delDemand(_demandIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/demand/export', {
    ...queryParams.value
  }, `demand_${new Date().getTime()}.xlsx`)
}
/** 多选框选择条数  */
const tempCarList = ref([])
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.demandId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  tempCarList.value = selection
  console.log(purchaseCarLists.value)
};
/** 多选框选择条数  */
function handleSelectionCarChange(selection) {
  commitCarLists.value = selection
  if(commitCarLists.value.length>0){
    goPurchaseButton.value = false;
  }else{
    goPurchaseButton.value = true;
  }
  console.log(commitCarLists.value)
}
function OrderProgress(status) {
  if (status === '待处理') {
    return '待处理'
  } else if (status === '已处理') {
    return '已处理'
  } else {
    return '已结束'
  }
}
function addPurchaseList(){
  purchaseCarLists.value = tempCarList.value
}
function clickPurchaseCar(){
  title.value = "采购列表"
  openPurchaseCar.value = true
}
function calculatePurchaseQuantity(){
  let priceTotal = 0;
  commitCarLists.value.forEach(row =>{
    priceTotal += row.demandNumber * row.product.costPrice;
  })
  return priceTotal
}
function calculatePurchaseLength(){
  let size = 0;
  commitCarLists.value.forEach(row =>{
    size ++;
  })
  return size;
}

function GoPurchaseOrder(){

  let warehouseId = commitCarLists.value[0].warehouseId;
  let flag = true
  for (const row of commitCarLists.value) {
    console.log(row.warehouseId);
    console.log(warehouseId);

    if (row.warehouseId !== warehouseId) {
      flag = false;
      break;  // 使用 break 来中断整个循环
    }
  }
  if(flag == false){
    proxy.$modal.alertWarning("请选择所属仓库相同的采购需求进行下推!");
    return
  }
  openPurchaseCar.value = false;

  router.push({
    path:'/purchaseManage/order/addOrder',
    query:{rows: JSON.stringify(commitCarLists.value)}
  });
}
//************************************************************
function childProductQuery(data){
  queryProductParams.value = data
  console.log(queryProductParams.value)
  handleProductQuery();
}
function getChildProductDetail(data){
  reset();
  getCatalogTree();

  const _productId = data.productId
  getProduct(_productId).then(response => {
    productForm.value = response.data;
    openProductDetail.value = true;
    title.value = "商品详情";
  });
}
function getChildProductList(data){

  openProduct.value=false;
  form.value.demandProductsList = data
}







getList();
getWarehouseTree();
</script>


<style scoped>

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

.operRow{
  margin-top: 10px;
}
</style>