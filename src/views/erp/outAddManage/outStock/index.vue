<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="出库单号" prop="addStockCode">
        <el-input
          v-model="queryParams.addStockCode"
          placeholder="请输入出库单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单据名称" prop="addStockName">
        <el-input
          v-model="queryParams.addStockName"
          placeholder="请输入单据名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属仓库" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseId"
          placeholder="请输入所属仓库"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库名" prop="warehousePath">
        <el-input
          v-model="queryParams.warehousePath"
          placeholder="请输入仓库名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发货供应商" prop="unitName">
        <el-input
          v-model="queryParams.unitName"
          placeholder="请输入发货供应商"
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

        <el-dropdown class="el-dropdown-order" trigger="click"  >
          <el-button type="primary"   style="width: 80px;">
            新增<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleAdd">新增出库单</el-dropdown-item>
              <el-dropdown-item @click="handleAddOrder">新增销售出库单</el-dropdown-item>
              <el-dropdown-item @click="handlePlanOutOrder">新增生产领料出库单</el-dropdown-item>
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
          v-hasPermi="['erp:addStock:edit']"
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
          v-hasPermi="['erp:addStock:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['erp:addStock:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="addStockList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="出库单号" align="center">
      <template #default="scope">
        <a
            href="#"
            style="color: rgba(40,177,232,0.83); text-decoration: underline;"
            @click="handleAddStockDetailClick(scope.row)"
        >
          {{ scope.row.addStockCode }}
        </a>
      </template>
      </el-table-column>
      <el-table-column label="单据名称" align="center" prop="addStockName" />

      <el-table-column label="出库类型" align="center" prop="addStockType" />
      <el-table-column label="所属仓库" align="center" prop="warehouse.warehousePath" />
      <el-table-column label="出库日期" align="center" prop="addStockTime" />
      <el-table-column label="发货方" align="center" prop="unit.unitName" />
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
                    @mouseover="showAuditTooltip(scope.row)"> {{ addStockAuditStatus(scope.row.auditId) }} </el-tag>
          </el-tooltip>

        </template>
      </el-table-column>

      <el-table-column label="创建日期" align="center" prop="createTime" />
      <el-table-column label="订单备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button  :disabled="single" link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:addStock:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:addStock:remove']">删除</el-button>
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

    <!-- 添加或修改出库表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="addStockRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="出库单号" prop="addStockCode">
          <el-input v-model="form.addStockCode" placeholder="请输入出库单号" />
        </el-form-item>
        <el-form-item label="单据名称" prop="addStockName">
          <el-input v-model="form.addStockName" placeholder="请输入单据名称" />
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入所属仓库" />
        </el-form-item>
        <el-form-item label="出库类型" prop="addStockType">
          <el-input v-model="form.addStockType" placeholder="请输入所属仓库" />
        </el-form-item>
        <el-form-item label="发货供应商" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入发货供应商" />
        </el-form-item>
        <el-form-item label="订单备注" prop="remark">
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

    <!-- （最主要的弹窗）新增（采购订单）出库对话框 -->
    <el-dialog :title="title" v-model="openAddOrderStock"
               append-to-body class="dialog-addOrder" style="position: relative;">
      <el-row>
        <el-col :span="24" style="position: absolute; top: 0; right: 105px; width: auto;">
          <el-button type="primary" plain size="small" icon="primary" @click="subMitAddStockAndAuditPass">保存并审核通过</el-button>
        </el-col>
        <el-col :span="24"    style="position: absolute; top: 0; right: 20px; width: auto;">
          <el-button type="primary" plain size="small" icon="primary" @click="subMitAddStockList">保存</el-button>
        </el-col>
      </el-row>

      <span > 出库单基本信息
        <el-button link type="primary" icon="list" @click="changeOrderShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
      <el-form ref="orderRef" v-show="orderDetailFormShow"  :model="form" :rules="rules" :inline="true" label-width="80px"
               style="border-top: dashed 1.3px rgba(187,199,191,0.35) ;padding: 8px">
        <el-row>
          <el-form-item label="出库单号" prop="addStockCode" class="select-container" >
            <el-input v-model="form.addStockCode" placeholder="保存后自动生成" class="readonly-tree-select" style="width: 180px;"/>
          </el-form-item>
          <el-form-item label="单据名称" prop="addStockName">
            <el-input v-model="form.addStockName" placeholder="请输入单据名称" style="width: 180px;" />
          </el-form-item>
          <el-form-item label="出库类型" prop="addStockType" class="select-container" >
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


          <el-form-item label="出库日期" prop="addStockTime">
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

            <div style="margin-top: 10px "> <span >采购出库商品明细 </span>
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
            <span style="margin-top:50px"> 出库种数：       出库总额：</span>
      <!--      待出库商品明细表格-->
            <el-table v-loading="ProductsListLoading"
                      :data="form.orderProductsList"
                      :rules="rules"
                      height="350"
                      class="productAddDetailTable"
                      style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
                      @cell-click="tabClick">

              <el-table-column type="selection" width="55" align="center" />
              <el-table-column type="index" width="55" align="center" label="序号" />
              <el-table-column label="编号" align="center" prop="product.productCode"/>

              <el-table-column label="商品信息" align="center" prop="product.productName"/>
              <el-table-column label="可出库数量" prop="demandNumber" align="center" >

              </el-table-column>

              <el-table-column label="金额" prop="orderMoney" align="center" class="select-container"/>
              <el-table-column label="成本价" align="center" prop="costPrice" width="80px">
                <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.costPrice"  type="number" maxlength="20" placeholder="请输入"  size="mini"  />
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="备注" prop="remark" align="center"  width="90px"/>

              <el-table-column label="出库数量" prop="demandNumber" align="center"  width="120px">
                <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.demandNumber"  type="number" maxlength="20" placeholder="请输入需求" size="mini"  />
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="出库位置相关信息" align="center" width="240px">
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
    </el-dialog>

    <!--   出库订单详情查看 -->
    <add-stock-detail
        :openAddOrderStockDetail="openAddOrderStockDetail"
        :form="form"

        :selectedOrder="form.selectedOrder"
        :ProductsListLoading="ProductsListLoading"
        :orderProductsList="form.orderProductsList"
        :title="title"
        :orderAuditShow="orderAuditShow"
        :updateOrderShow="updateOrderShow"
    />

<!--    审核弹窗-->
    <AuditDialog
        :auditAddDTO="auditAddDTO"
        :openAudit = "openAudit"
        :AuditTitle="AuditTitle"
        @submitOrderAudit="submitOrderAudit"
    />

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
        <el-form-item label="出库仓库" prop="warehouseName">
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

<!--  选择出库位置批次  //-->
    <el-dialog
        title="选择出库位置" v-model="openSelectAddStockPosition"
        append-to-body class="dialog-selectOrder"
        :style="{ 'max-height': '60vh' }"
    >

      <table :data="form.orderProductsList.addStockProduct.product" class="tab-top-centent" style="border: 1px solid rgb(230, 235, 245);">
        <tr ><td  class="tex">
          <div  class="dis">
          商品编号：
          <div   tabindex="0">{{ form.orderProductsList.addStockProduct.product.productCode}}</div></div></td>
          <td  class="tex">
          <div  class="dis">
          商品名称：
          <div   tabindex="0">{{ form.orderProductsList.addStockProduct.product.productName}}</div></div></td>
          <td  class="tex">
          <div  class="dis">
          厂家型号：
          <div   tabindex="0">{{ form.orderProductsList.addStockProduct.product.productModel }} </div></div></td>
          <td  class="tex">
          <div  class="dis">
          封装规格：
          <div   tabindex="0">{{ form.orderProductsList.addStockProduct.product.encapStandard }}</div></div></td>
          <td  class="tex">
          <div  class="dis">
          封装单位：
          <div  tabindex="0">{{ form.orderProductsList.addStockProduct.product.minpacketUnit}}</div></div></td>
        </tr></table>

      <div  class="el-row" style="margin-top: 15px; margin-bottom: 15px; margin-left: 10px;">
        <span >
         可出库数量：<span  style="color: rgb(82, 153, 252);">{{ form.orderProductsList.addStockProduct.demandNumber }}</span> &nbsp;&nbsp;
        </span>
         已输入出库数量：<span  style="color: rgb(82, 153, 252);">66  </span>
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

          <el-table-column label="出库位置" align="center">
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

          <el-table-column label="出库数量" align="center" >
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
          <button type="button" class="el-button el-button--default el-button--mini">
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

<script setup name="AddStock">
import { listAddStock, getAddStock, delAddStock, addAddStock, updateAddStock,AddStockList } from "@/api/erp/addStock";
import {ref} from "vue";
import {addOrderAudit, getOrder, getOrderAuditRecord, listOrder} from "../../../../api/erp/order";
import {getWarehousePosition, warehouseTreeSelect} from "../../../../api/erp/position";
import {listUnit} from "../../../../api/erp/unit";
import {addAddStockAudit} from "../../../../api/erp/addStock";
import AuditDialog from "../../../../components/zerp/public/auditDialog";
import AddStockDetail from "./addStockDetail/addStockDetail";
import OrderTable from "../../purchaseManage/order/orderTable";
import {useRoute, useRouter} from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const addStockList = ref([]);
const orderList = ref([]);
const tooltipAuditContent = ref({})

const open = ref(false);
const openAddOrderStock = ref(false);
const openAddOrderStockDetail = ref(false);

const openAudit = ref(false);
const openSelectOrder = ref(false);
const openSelectAddStockPosition = ref(false);
const auditAddDTO = ref({})


const loading = ref(true);
const ProductsListLoading = ref(openSelectOrder);
const showSearch = ref(true);
const orderDetailFormShow = ref(true);
const auditDisabled = ref(true);

const ids = ref([]);
const orderIds = ref([]);
const unitOptions = ref([]);
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
        addStockProduct: ref({       //商品出库条
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
    addStockCode: null,
    addStockName: null,
    addStockType: null,
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
  listAddStock(queryParams.value).then(response => {
    addStockList.value = response.rows;
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
    addStockId: null,
    addStockCode: null,
    addStockName: null,
    addStockType: null,
    warehouseId: null,
    warehousePath: null,
    unitName: null,
    auditId: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    addStockTime:null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("addStockRef");
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
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(data) {

  selection.value = Array.from(data);
  ids.value = selection.value.map(item => item.addStockId);
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
  // form.value.addStockType = "采购出库"
  // openAddOrderStock.value = true;
  // title.value = "采购出库";
  router.push('/outAddManage/outStock/purchaseAddStock');
}
/** 新增生产出库单按钮操作 */
function handlePlanOutOrder() {
  reset();
  // form.value.addStockType = "采购出库"
  // openAddOrderStock.value = true;
  // title.value = "采购出库";
  router.push('/outAddManage/outStock/producePlanAddStock');
}


/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  // openAddOrderStock.value = true;
  const addStockId = row.addStockId || ids.value
  const addStockType = row.addStockType

  if(addStockType == "采购出库"){
    router.push({
      path:'/outAddManage/addStock/purchaseAddStock',
      query:{addStockId : addStockId}
    });
  }else{
    router.push({
      path:'/outAddManage/addStock/producePlanAddStock',
      query:{addStockId : addStockId}
    });
  }

}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["addStockRef"].validate(valid => {
    if (valid) {
      if (form.value.addStockId != null) {
        updateAddStock(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAddStock(form.value).then(response => {
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

/** 删除按钮操作 */
function handleDelete(row) {
  const _addStockIds = row.addStockId || ids.value;
  proxy.$modal.confirm('是否确认删除出库表编号为"' + _addStockIds + '"的数据项？').then(function() {
    return delAddStock(_addStockIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/addStock/export', {
    ...queryParams.value
  }, `addStock_${new Date().getTime()}.xlsx`)
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
function SelectAddStockPosition(row){
  openSelectAddStockPosition.value = true;
  form.value.orderProductsList.addStockProduct = row
  form.value.orderProductsList.addStockProduct.batchPositionList = [{}]

  getSpanArr(form.value.orderProductsList.addStockProduct.batchPositionList);
}



//获得仓库的库位数据
function selectPosition(warehouseId){
  getWarehousePosition(warehouseId).then(response => {
    PositionOptions.value = response.data;
  });

}

// 当需要添加新行时触发的函数或事件处理程序
function addProductBatchRow() {
  const firstRow = form.value.orderProductsList.addStockProduct.batchPositionList[0];

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
  form.value.orderProductsList.addStockProduct.batchPositionList.push(batchPosition);
  getSpanArr(form.value.orderProductsList.addStockProduct.batchPositionList);
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
  openSelectAddStockPosition.value=false;
}

//选择库位节点触发
const handlePositionChange = (selectValue) => {

  // 更新所有行的出库位置信息
  form.value.orderProductsList.addStockProduct.batchPositionList.forEach(row => {
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
function subMitAddStockList(){

  if (form.value.addStockId != null) {
    updateAddStock(form.value).then(response=>{
      proxy.$modal.msgSuccess("修改成功");
      openAddOrderStock.value = false;
      getList();
    })

  }else{
    AddStockList(form.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      openAddOrderStock.value = false;
      getList();
    });
  }

}


function handleAddStockDetailClick(row){

  reset();
  openAddOrderStock.value = true;
  const _addStockId = row.addStockId
  getAddStock(_addStockId).then(response => {
    form.value = response.data;
    form.value.auditId = response.data.auditId
    form.value.selectedOrder = []
    form.value.orderProductsList = [];
    // productListSize.value=Object.keys(response.data.demandProductsList).length
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
//状态显示
function addStockAuditStatus(auditId) {
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
    return;
  }
  getOrderAuditRecord(row.addStockId).then(response=>{
    tooltipAuditContent.value= response.data

    tooltipAuditContent.value = '审核人: '+tooltipAuditContent.value.userName +
        '  审核时间:'+ tooltipAuditContent.value.createTime +
        '  备注:'+tooltipAuditContent.value.auditRemark;
  })
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
  addAddStockAudit(auditAddDTO.value).then(response => {
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
        if (route.name === 'AddStock') {
          // 使用 nextTick 确保在 DOM 更新后执行刷新数据的逻辑
          await nextTick();
          getList();
        }
      }
  );
});

getUnitList();
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

</style>
