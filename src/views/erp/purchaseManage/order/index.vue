<template>
  <div class="app-container">


    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="purchaseOrderCode">
        <el-input
          v-model="queryParams.purchaseOrderCode"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单据名称" prop="purchaseOrderName">
        <el-input
          v-model="queryParams.purchaseOrderName"
          placeholder="请输入单据名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="制单人" prop="user">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入制单人"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="审核状态" prop="auditStatus">
        <el-input
          v-model="queryParams.auditStatus"
          placeholder="审核状态"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单进度" prop="orderProgress">
        <el-input
            v-model="queryParams.orderProgress"
            placeholder="请输入订单进度"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="选择目标仓库" prop="warehouseName">
        <el-tree-select
            v-model="queryParams.warehouseId"
            :data="warehouseOptions"
            :props="{ value: 'id', label: 'label', children: 'children' }"
            value-key="id"
            placeholder="请选择仓库"
            @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="订单交货日期" prop="purchaseOrderTime">
        <el-date-picker clearable
          v-model="queryParams.purchaseOrderTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择订单交货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单支付状态" prop="paymentStatus">
        <el-input
          v-model="queryParams.paymentStatus"
          placeholder="请输入订单支付状态id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="采购订单总金额" prop="purchaseAllAmount">
        <el-input
          v-model="queryParams.purchaseAllAmount"
          placeholder="请输入采购订单总金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['erp:order:add']"
        >新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:order:edit']"
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
            v-hasPermi="['erp:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['erp:order:export']"
        >导出</el-button>

      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <order-table
        :loading="loading"
        :orderList="orderList"
        :single="single"
        :tooltipAuditContent="tooltipAuditContent"
        @handleSelectionChange="handleSelectionChange"
        @handleOrderDetailClick="handleOrderDetailClick"
        @showAuditTooltip="showAuditTooltip"
        @handleUpdate="handleUpdate"
    />


    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改采购订单对话框 -->
    <el-dialog :title="title" v-model="open"
                append-to-body class="dialog-addOrder">
      <span > 采购订单基本信息
        <el-button link type="primary" icon="list" @click="changeOrderShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
      <el-form ref="orderRef" v-show="orderDetailFormShow"  :model="form" :rules="rules" :inline="true" label-width="80px"
               style="border-top: dashed 1.3px rgba(187,199,191,0.35) ;padding: 8px">
      <el-row>
        <el-form-item label="订单编号" prop="purchaseOrderCode" class="select-container" >
          <el-input v-model="form.purchaseOrderCode" placeholder="保存后自动生成" class="readonly-tree-select" style="width: 180px;"/>
        </el-form-item>
        <el-form-item label="下单日期" prop="createTime" class="select-container">
          <el-input v-model="form.createTime" placeholder="" class="readonly-tree-select"  style="width: 180px;"/>
        </el-form-item>

        <el-form-item label="目标仓库" prop="warehouseName" class="select-container">
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
        <el-form-item label="供应商" prop="unitName">
          <el-select v-model="form.unitId"  placeholder="请选择">
            <el-option
                v-for="item in unitOptions"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
                :disabled="item.status == 1"
                style="width: 140px;"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
        <el-row>
          <el-form-item label="交货日期" prop="purchaseOrderTime">
            <el-date-picker clearable
                            v-model="form.purchaseOrderTime"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择订单交货日期"
                            style="width: 180px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="单据名称" prop="purchaseOrderName">
            <el-input v-model="form.purchaseOrderName" placeholder="请输入单据名称" style="width: 180px;" />
          </el-form-item>


          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="text" placeholder="请输入" style="width: 180px;"/>
          </el-form-item>
        </el-row>
      </el-form>

      <span > 采购订单商品信息 </span>

      <el-row :gutter="4" class="mb8" style="border-top: dashed 1.3px rgba(187,199,191,0.35) ; padding: 8px">
        <el-col :span="1.2">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAddProduct"
              v-hasPermi="['erp:order:add']"
          >添加商品</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['erp:order:edit']"
          >导入采购需求</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['erp:order:remove']"
          >导入BOM</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['erp:order:export']"
          >Excel导入</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['erp:order:remove']"
          >删除</el-button>
        </el-col>

        <el-col :span="10">

        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="submitForm"
            style="margin-left: 80%"
            v-hasPermi="['erp:order:add']"
           >添加商品</el-button>
        </el-col>

        <!--        <right-toolbar >dsf</right-toolbar>-->
      </el-row>

      <span style="margin-top:100px"> 采购种数：       采购总额：</span>

      <el-table v-loading="loading"
                :data="form.demandProductsList"
                height="450"
                @cell-click="tabClick">

        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="商品编号" align="center" prop="productCode">
          <template #default="scope">
          <span>
              {{ scope.row.productCode}}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" align="center" prop="productName">
          <template #default="scope">
          <span>
              {{ scope.row.productName}}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" prop="productImage" align="center" >
          <template  #default="scope" width="90">
            <ImagePreview style="width:60px;height:60px;" :src="scope.row.productImage" />
          </template>
        </el-table-column>
        <el-table-column label="需求数量" prop="demandNumber" >
          <template #default="scope">
            <span>
              <el-input v-model="scope.row.demandNumber" @input="calculateorderMoney(scope.row)" type="number" maxlength="26" placeholder="请输入需求" size="mini"  />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="采购价" align="center" prop="costPrice">
          <template #default="scope">
            <span>
              <el-input v-model="scope.row.costPrice" @input="calculateorderMoney(scope.row)" type="number" maxlength="26" placeholder="请输入" size="mini"  />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="orderMoney" class="select-container">
          <template #default="scope">
            <span>
              <span class="readonly-tree-select">{{ scope.row.orderMoney ? scope.row.orderMoney : '0.00' }}</span>
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
    </el-dialog>

    <!-- 采购订单查看明细对话框 -->
    <el-dialog :title="title" v-model="openOrderDetail"  append-to-body class="dialog-OrderDetail">

      <el-row :gutter="10" class="mb8" style="border-top: dashed 1.3px rgba(187,199,191,0.35) ; padding: 8px">
        <el-col :span="1.5">
          <el-button
              type="warning"
              plain
              icon="Edit"
              :disabled="updateOrderShow"
              @click="handleOrderUpdate"
              v-hasPermi="['erp:order:add']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              :disabled="orderAuditShow"
              @click="handleOrderAuditPass"
              v-hasPermi="['erp:order:edit']"
          >审核通过</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="orderAuditShow"
              @click="handleOrderAuditNotPass"
              v-hasPermi="['erp:order:remove']"
          >审核不通过</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              plain
              type="primary"
              icon="Download"
              @click="handleExport"
              v-hasPermi="['erp:order:export']"
          >打印</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['erp:order:remove']"
          >删除</el-button>
        </el-col>

        <el-col :span="13">

          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="submitForm"
              style="float: right;"
              v-hasPermi="['erp:order:add']"
          >添加商品</el-button>
        </el-col>

        <!--        <right-toolbar >dsf</right-toolbar>-->
      </el-row>

      <order-detail    :demandProductsList="form.demandProductsList"
                       :form="form"
                       :productListSize ="productListSize"
                       :warehouseOptions = "warehouseOptions"
                       :unitOptions = "unitOptions"
                       @getProductDetail="getChildProductDetail"
      />
    </el-dialog>

    <!--  商品选择框-->
    <el-dialog :title="title" v-model="openProduct" width="950px"  append-to-body >
      <!-- 查看商品详细对话框 -->
      <el-button style="margin-right: 10px" @click="submitProductList">确 定</el-button>
      <!--      //第二步:定义form表单-->
      <ProductTable  :productList="productList"
                     :productRows="productRows"
                     @queryProduct="childProductQuery"
                     @getSelectProduct="getChildProductList"
                     @getProductDetail="getChildProductDetail"
      >

      </ProductTable>

    </el-dialog>

<!--选择仓库-->
    <el-dialog :title="title" v-model="openWarehouse" width="500px" append-to-body>
      <el-form-item label="选择目标仓库" prop="warehouseName">
        <el-tree-select
            v-model="form.warehouseId"
            :data="warehouseOptions"
            :props="{ value: 'id', label: 'label', children: 'children' }"
            value-key="id"
            placeholder="请选择仓库"
            @change="handleChange"
        />
      </el-form-item>
      <el-button type="primary" @click="nextStep">确 定</el-button>
    </el-dialog>



    <ProductDetail
        :title="title"
        :openProductDetail="openProductDetail"
        :productForm = "productForm"
        :catalogOptions="catalogOptions"
    />

    <AuditDialog
        :auditAddDTO="auditAddDTO"
        :openAudit = "openAudit"
        :AuditTitle="AuditTitle"
        @submitOrderAudit="submitOrderAudit"
    />

  </div>
</template>

<script setup name="Order">
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/erp/order";
import {ref} from "vue";
import {warehouseParentTreeSelect, warehouseTreeSelect} from "../../../../api/erp/position";
import {listUnit} from "../../../../api/erp/unit";
import {getProduct, listProduct} from "../../../../api/erp/product";
import {catalogTreeSelect} from "../../../../api/erp/catalog";
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import Subassembly from "../../../../components/zerp/table/subassembly";
import ProductTable from "../../../../components/zerp/table/productTable";
import ChildTOParent from "../../../../components/zerp/table/childTOParent";
import OrderDetail from "./orderDetail";
import {addOrderAudit,getOrderAuditRecord} from "../../../../api/erp/order";
import AuditDialog from "../../../../components/zerp/public/auditDialog";
import ProductDetail from "../../productManage/product/productDetail";
import OrderTable from "./orderTable";
import {useRoute, useRouter} from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const orderList = ref([]);
const productList = ref([]);

const open = ref(false);


const openOrderDetail = ref(false);
const openAudit = ref(false);


const warehouseOptions = ref([]);
const unitOptions = ref([]);

const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const orderAuditShow = ref(true);
const updateOrderShow = ref(true);
const total = ref(0);
const title = ref("");
const AuditTitle = ref("");

const orderDetailFormShow = ref(true);
const selection = ref([{}]);

const catalogOptions = ref(undefined);
const productListSize=ref(0);
const auditValue = ref("审核")
const auditDisabled = ref(true);
const auditAddDTO = ref({})
const tooltipAuditContent = ref({})


const data = reactive({
  form: {
    createTime: "",
    demandProductsList: ref([{
      product: ref({
        costPrice: 0,
        demandNumber: 0,
        orderMoney: 0,
        productImage:""
      })
    }
    ]),
  },

  productForm:{},

  queryParams: {
    pageNum: 1,
    pageSize: 10,
    purchaseOrderCode: null,
    purchaseOrderName: null,
    productId: null,
    unitId: null,
    warehouseId: null,
    warehouseName: null,
    warehouse:{
      warehouseName: null,

    },
    userName:null,
    auditStatus:null,
    purchaseOrderTime: null,
    paymentStatus:null,
    auditId: null,
    paymentId: null,
    orderProgress: null,
    purchaseAllAmount: null,
    status: null,
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
  rules: {
    purchaseOrderName: [
      { required: true, message: "单据名称不能为空", trigger: "blur" }
    ],
    productId: [
      { required: true, message: "商品id不能为空", trigger: "blur" }
    ],
    unitId: [
      { required: true, message: "供应商id不能为空", trigger: "blur" }
    ],
    warehouseId: [
      { required: true, message: "所属仓库不能为空", trigger: "blur" }
    ],
    auditId: [
      { required: true, message: "订单审核状态id不能为空", trigger: "blur" }
    ],
    demandNumber: [
      { required: true, message: "需求数量不能为空", trigger: "blur" }
    ],
    paymentId: [
      { required: true, message: "订单支付状态id不能为空", trigger: "blur" }
    ],
    orderProgress: [
      { required: true, message: "订单进度不能为空", trigger: "blur" }
    ],
    purchaseAllAmount: [
      { required: true, message: "采购订单总金额不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules ,productForm,queryProductParams} = toRefs(data);



function handleOrderDetailClick(row){
  reset();
  openOrderDetail.value = true;
  const _purchaseOrderId = row.purchaseOrderId
  getOrder(_purchaseOrderId).then(response => {
    form.value = response.data;
    form.value.auditId = response.data.auditId
    form.value.demandProductsList =form.value.productList;
    productListSize.value=Object.keys(response.data.demandProductsList).length
    title.value = "订单详情";

    if(response.data.auditId != 0){
      orderAuditShow.value = true;
      updateOrderShow.value = true;
    }else{
      orderAuditShow.value = false;
      updateOrderShow.value = false;

    }
  });
}





/** 新增采购订单按钮操作，第一步选择仓库 */
function handleAdd() {
  reset();

  router.push('/purchaseManage/order/addOrder')
}

/** 查询采购订单列表 */
function getList() {
  loading.value = true;
  listOrder(queryParams.value).then(response => {
    orderList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


/** 查询目录下拉树结构 */
function getCatalogTree() {
  catalogTreeSelect().then(response => {
    catalogOptions.value = response.data;
  });
};
/** 查询商品列表 */
function getProductList() {
  loading.value = true;
  listProduct(queryProductParams.value).then(response => {

    productList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function changeOrderShow() {
  orderDetailFormShow.value = !(orderDetailFormShow.value);
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

function cancelProductDetail(){
  openProductDetail.value=false;
}

// 表单重置
function reset() {
  form.value = {
    purchaseOrderId: null,
    purchaseOrderCode: null,
    purchaseOrderName: null,
    orderMoney:null,
    demandNumber:null,
    productId: null,
    unitId: null,
    warehouseId: null,
    purchaseOrderTime: null,
    auditId: null,
    paymentId: null,
    orderProgress: null,
    purchaseAllAmount: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("orderRef");
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
function handleSelectionChange(data) {

  selection.value = Array.from(data);

  ids.value = selection.value.map(item => item.purchaseOrderId);
  single.value = selection.value.length != 1;
  auditDisabled.value = selection.value.length != 1 ;
  if(selection.value.length ==1){
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



/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _purchaseOrderId = row.purchaseOrderId || ids.value[0]

  router.push({
    path:'/purchaseManage/order/addOrder',
    query:{purchaseOrderId : _purchaseOrderId}
  });
}

function handleOrderUpdate(){
  handleUpdate(form.value.purchaseOrderId)
}

/** 采购提交按钮 */
function submitForm() {
  proxy.$refs["orderRef"].validate(valid => {
    if (valid) {
      if (form.value.purchaseOrderId != null) {
        updateOrder(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOrder(form.value).then(response => {
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
  const _purchaseOrderIds = row.purchaseOrderId || ids.value;
  proxy.$modal.confirm('是否确认删除采购订单编号为"' + _purchaseOrderIds + '"的数据项？').then(function() {
    return delOrder(_purchaseOrderIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/order/export', {
    ...queryParams.value
  }, `order_${new Date().getTime()}.xlsx`)
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

//状态显示
function orderPayStatus(paymentId) {
  if (paymentId === '0') {
    return '未付款'
  } else if (paymentId === '1') {
    return '已付款'
  } else if(paymentId === '2'){
    return '部分付款'
  }else {
    return '错误状态'
  }
}

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
  addOrderAudit(auditAddDTO.value).then(response => {
    proxy.$modal.msgSuccess("审核成功");
    getList();
  })
  openAudit.value = false;
  title.value = ""
}

//审核通过（详情页）
function handleOrderAuditPass(){
  AuditTitle.value ="审核通过"
  auditAddDTO.value.auditType = 1;
  auditAddDTO.value.orderId = form.value.purchaseOrderId;
  openAudit.value = true;
}
//审核通过（详情页）
function handleOrderAuditNotPass(){
  AuditTitle.value ="审核不通过"
  auditAddDTO.value.auditType = 2;
  auditAddDTO.value.orderId = form.value.purchaseOrderId;
  openAudit.value = true;
}


const showAuditTooltip = (row) => {
  // 生成tooltip的内容，可以根据rowData的信息来设置tooltip内容
  if(row.auditId == 0){
    return;
  }
  getOrderAuditRecord(row.purchaseOrderId).then(response=>{
    tooltipAuditContent.value= response.data

    tooltipAuditContent.value = '审核人: '+tooltipAuditContent.value.userName +
        '  审核时间:'+ tooltipAuditContent.value.createTime +
        '  备注:'+tooltipAuditContent.value.auditRemark;

    console.log(tooltipAuditContent.value)
  })
};





getList();
getUnitList();
getWarehouseTree();
</script>


<style >
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

.dialog-addOrder{
  width: 85% ;
  /*height: 90%;*/
  margin-left: 200px;
  /*max-width: calc(100% - 300px);*/
}

.dialog-OrderDetail{
  width: 85% ;
  /*height: 90%;*/
  margin-left: 200px;
  /*max-width: calc(100% - 300px);*/
}

.form-with-border{
  border: 1px solid #ccc; /* 添加边线样式 */
  padding: 20px; /* 可选：增加一些内边距 */
}

.box-item{
  height: 100px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}


.el-dropdown-order{
  margin-right: 10px;
  display: flex;
}
</style>