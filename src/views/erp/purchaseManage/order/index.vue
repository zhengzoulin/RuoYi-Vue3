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
            check-strictly
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['erp:order:add']"
        >新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:order:edit']"
        >修改</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-select v-model="auditValue"  placeholder="审核"  style="width: 80px;"
                   :disabled="auditDisabled"
                   @change="auditOrder">

          <el-option
              v-for="item in AuditOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
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
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['erp:order:export']"
        >导出</el-button>
      </el-col>

      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"  />
      <el-table-column label="订单编号" align="center"  >
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
      <el-table-column label="单据名称" align="center" prop="purchaseOrderName" />
      <el-table-column label="供应商" align="center" prop="unit.unitName" />
      <el-table-column label="所属仓库" align="center" prop="warehouse.warehousePath" />

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
                  @mouseover="showAuditTooltip(scope.row)"> {{ orderAuditStatus(scope.row.auditId) }} </el-tag>
          </el-tooltip>

        </template>
      </el-table-column>
      <el-table-column label="订单交货日期" align="center" prop="purchaseOrderTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.purchaseOrderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购订单总金额" align="center" prop="purchaseAllAmount" />
      <el-table-column align="center" label="付款状态" prop="paymentId">
        <template #default="scope">
          <el-tag :type="{
            '0': 'info',       // 未审核状态
            '1': 'success',    // 审核通过状态
            '2': 'danger'      // 审核未通过状态
          }[scope.row.paymentId]"> {{ orderPayStatus(scope.row.paymentId) }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单进度" align="center" prop="orderProgress" />

      <el-table-column label="订单备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row.purchaseOrderId)" v-hasPermi="['erp:order:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:order:remove']">删除</el-button>
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

    <!-- 添加或修改采购订单对话框 -->
    <el-dialog :title="title" v-model="open"
                append-to-body class="dialog-addOrder">
      <span > 采购订单基本信息
        <el-button link type="primary" icon="list" @click="changeOrderShow()" > {{ orderDetailShow ? '收起' : '详细' }}</el-button>
      </span>
      <el-form ref="orderRef" v-show="orderDetailShow"  :model="form" :rules="rules" :inline="true" label-width="80px"
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
              check-strictly
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
                :rules="rules"
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
            check-strictly
            @change="handleChange"
        />
      </el-form-item>
      <el-button type="primary" @click="nextStep">确 定</el-button>
    </el-dialog>

    <!-- 查看商品详细对话框 -->
    <el-dialog :title="title" v-model="openProductDetail" width="750px"  append-to-body>
      <el-form ref="productRef" :model="productForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品编号" prop="productCode" >
              <el-input v-model="productForm.productCode" placeholder="请输入商品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="选择目录" prop="catalogName">
              <el-tree-select
                  v-model="productForm.catalogId"
                  :data="catalogOptions"
                  :props="{ value: 'id', label: 'label', children: 'children' }"
                  value-key="isd"
                  placeholder="请选择目录分类"
                  check-strictly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="productForm.productName" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品介绍" prop="productIntro">
              <el-input v-model="productForm.productIntro" placeholder="请输入商品介绍" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="厂家型号" prop="productModel">
              <el-input v-model="productForm.productModel" placeholder="请输入厂家型号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品来源" prop="productSource">
              <el-input v-model="productForm.productSource" placeholder="请输入商品来源" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="录入方式" prop="productAddOrigin">
              <el-input v-model="productForm.productAddOrigin" placeholder="请输入商品重量" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品重量" prop="productWeight">
              <el-input v-model="productForm.productWeight" placeholder="请输入商品重量" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="封装规格" prop="encapStandard">
              <el-input v-model="productForm.encapStandard" placeholder="请输入封装规格" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="成本价" prop="costPrice">
              <el-input v-model="productForm.costPrice" placeholder="请输入成本价" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="售价" prop="salePrice">
              <el-input v-model="productForm.salePrice" placeholder="请输入售价" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="包装单位" prop="minpacketUnit">
              <el-input v-model="productForm.minpacketUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="包装数量" prop="minpacketNumber">
              <el-input v-model="productForm.minpacketNumber" placeholder="请输入最小包装数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input v-model="productForm.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="add-label">
            <el-form-item label="商品图片" prop="productImage">
              <image-upload v-model="productForm.productImage"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>



      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="">确 定</el-button>
          <el-button @click="cancelProductDetail">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-model="openAudit"
        :title="AuditTitle"
        width="30%"
        align-center
    >


      <span>审核备注</span>
      <el-input
          v-model="auditAddDTO.auditRemark"
          placeholder="请输入审核备注"
          clearable
          style="height: 100px"
      />
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="openAudit.value = false">取消</el-button>
        <el-button type="primary" @click="submitOrderAudit">
          确认
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Order">
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/erp/order";
import {ref} from "vue";
import {warehouseTreeSelect} from "../../../../api/erp/position";
import {listUnit} from "../../../../api/erp/unit";
import {getProduct, listProduct} from "../../../../api/erp/product";
import {catalogTreeSelect} from "../../../../api/erp/catalog";
import Subassembly from "../../../../components/zerp/table/subassembly";
import ProductTable from "../../../../components/zerp/table/productTable";
import ChildTOParent from "../../../../components/zerp/table/childTOParent";
import OrderDetail from "./orderDetail";
import {addOrderAudit,getOrderAuditRecord} from "../../../../api/erp/order";

const { proxy } = getCurrentInstance();

const orderList = ref([]);
const productList = ref([]);

const open = ref(false);

const openWarehouse = ref(false);
const openProduct = ref(false);
const openProductDetail = ref(false);
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

const orderDetailShow = ref(true);
const productRows = ref([]);
const catalogOptions = ref(undefined);
const productListSize=ref(0);
const auditValue = ref(1)
const auditDisabled = ref(true);
const auditAddDTO = ref({})
const tooltipAuditContent = ref({})

const AuditOptions = ref([
  {
    value: '1',
    label: '审核通过',
  },
  {
    value: '2',
    label: '审核不通过',
  }])
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

const calculateorderMoney = (item) => {
  item.orderMoney = (item.costPrice * item.demandNumber || 0).toFixed(3);
};

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

//将
function submitProductList(){
  // productRows.value = [];
  openProduct.value=false;
  console.log(productRows.value)
  form.value.demandProductsList = productRows.value
}


//确定要移除这一行
const removeRow = (row) => {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    const index = form.value.demandProductsList.findIndex(item => item.productId === row.productId);
    if (index !== -1) {
      form.value.demandProductsList.splice(index, 1);
      alert('成功移除该行');
    } else {
      alert('未找到对应行');
    }
  } else {
    alert('已取消移除');
  }
};

//获取订单生成时间
function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  form.value.createTime = `${year}-${month}-${day}`;
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

/** 查看详细按钮操作 */
function handleDetail(row) {
  getCatalogTree();

  const _productId = row.productId || ids.value
  getProduct(_productId).then(response => {
    productForm.value = response.data;
    openProductDetail.value = true;
    title.value = "商品详情";
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
/** 商品搜索按钮操作 */
function handleProductQuery() {
  queryProductParams.value.pageNum = 1;
  getProductList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {

  ids.value = selection.map(item => item.purchaseOrderId);
  single.value = selection.length != 1;
  auditDisabled.value = selection.length != 1 ;
  multiple.value = !selection.length;
}

/** 新增采购订单按钮操作，第一步选择仓库 */
function handleAdd() {
  reset();
  productRows.value = [];
  getWarehouseTree()
  openWarehouse.value = true;
  title.value = "选择目标仓库";
}
/** 新增采购订单按钮操作，第二步开始选择订单 */
function nextStep() {
  openWarehouse.value = false;
  getCurrentDate();
  getUnitList()
  open.value = true;
  title.value = "新增采购订单";
}


/** 新增选择商品按钮操作 */
function handleAddProduct() {
  getProductList();
  openProduct.value = true;
  title.value = "添加采购需求";
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

// 当表格选择项发生变化时会触发该事件
const handleDemandSelectionChange = (val) => {
  if (val) {
    val.forEach((row) => {
      if (row && !productRows.value.some(item => item.productId === row.productId)) {
        productRows.value.push(row);
      }
    });
  }
}
// 在退出功能触发时调用的方法
const handleLogout = () => {
  // 清除选中记录
  // productRows.value = [];
  // 其他清理操作...
  // 进行退出操作...
}





/** 修改按钮操作 */
function handleUpdate(purchaseOrderId) {
  reset();
  const _purchaseOrderId = purchaseOrderId
  getOrder(_purchaseOrderId).then(response => {
    form.value = response.data;
    form.value.demandProductsList =response.data.productList;

    open.value = true;
    title.value = "修改采购订单";
  });
}

function handleOrderUpdate(){

  handleUpdate(form.value.purchaseOrderId)
}

/** 提交按钮 */
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
  warehouseTreeSelect().then(response => {
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
function orderAuditStatus(auditId) {
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
function auditOrder(){
  auditAddDTO.value.auditType = auditValue.value;
  ids.value.forEach((id) => {
    // 遍历 ids 数组中的每个元素，并赋值给 orderId
    auditAddDTO.value.orderId = id;
  });

  openAudit.value = true;
  alert(auditAddDTO.value.auditType)

  if(auditAddDTO.value.auditType == 1){
    AuditTitle.value = "审核通过"
  }else{
    AuditTitle.value = "审核不通过"

  }
  // addOrderAudit(auditAddDTO.value).then(response => {
  //   proxy.$modal.msgSuccess("审核成功");
  //   getList();
  // })
}

//提交审核
function submitOrderAudit(){

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



  console.log("***************************")

};



//父子件方法********************************************



function childProductQuery(data){
  queryProductParams.value = data
  handleProductQuery();
}

function getChildProductDetail(data){
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
  console.log("////////////////////////////////////////")
  form.value.demandProductsList = data
  console.log(form.value.demandProductsList)

}

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
</style>