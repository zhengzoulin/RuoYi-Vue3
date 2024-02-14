<template>
  <div class="app-container">
    <el-row class="header">
      <router-link to="/outAddManage/addStock">
        <el-button type="primary"     icon="Back"
                   plain style=" color: #fff;background-color: #909399;
                              border-color: #909399; font-size: 12px">
          <span>返回</span>
        </el-button>

      </router-link>
      <div>
        <span style="color: #1c84c6;font-size: 24px">入库单详情</span>
      </div>
      <div>
        <el-button type="warning" plain @click="handleUpdate" :disabled="updateShow">修改</el-button>
        <el-button type="primary" plain >打印</el-button>
      </div>
    </el-row>

    <span > 入库单基本信息
        <el-button link type="primary" icon="list" @click="orderDetailFormShow = !orderDetailFormShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
    <div class="section-content" v-show="orderDetailFormShow">
      <!-- Form items for basic info -->
      <el-descriptions border="true" column="3" size="large" class="my-descriptions" v-show="orderDetailFormShow">
        <el-descriptions-item label="入库单号"  label-align="center">
          {{form.addStockCode }}
        </el-descriptions-item>

        <el-descriptions-item label="单据名称"  label-align="center">
          {{form.addStockName }}
          <el-button link type="primary"  icon="Edit"  @click=" " class="followButton"></el-button>
        </el-descriptions-item>

        <el-descriptions-item label="入库类型"  label-align="center">
          {{form.addStockType}}
        </el-descriptions-item>
<!--        <el-descriptions-item label="发货方"  label-align="center">-->
<!--          {{form.unit.unitName}}-->
<!--        </el-descriptions-item>-->
        <el-descriptions-item label="目标仓库"  label-align="center">
          {{form.warehouse.warehousePath}}
        </el-descriptions-item>

        <el-descriptions-item label="入库日期" prop="addStockTime"  label-align="center">
          {{form.addStockTime}}
        </el-descriptions-item>

        <el-descriptions-item label="订单备注"  label-align="center">
          {{form.remark}}
        </el-descriptions-item>
      </el-descriptions>

    </div>

    <br>
    <div style="margin-top: 10px "> <span >采购订单信息 </span>

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
      <el-table-column label="可入库数量" align="center" prop="produceNumber" width="100px"/>
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
               v-html="String.raw`${formatBatchPosition(scope.row)}`"
          ></a>
        </template>
      </el-table-column>


    </el-table>
    <div style="margin-top: 10px "> <span >入库商品明细 </span>

    </div>


    <br>
    <span style="margin-top:50px"> 剩余物料种数：{{orderPlanProductsList.length}}   </span>
    <!--      待二次入库商品明细表格-->
    <el-table
        :data="orderPlanProductsList"
        height="350"
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
               v-html="String.raw`${formatBatchPosition(scope.row)}`"
          ></a>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script setup>


import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {AddStockList, getAddStock, updateAddStock} from "../../../../../../api/erp/addStock";


const orderDetailFormShow = ref(true)
const updateShow = ref(true)

const orderSelection = ref([])
const orderPlanProductsList = ref([])

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
  rules: {

    addStockName: [
      { required: true, message: "单据名称不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();


/** 修改按钮操作 */
function handleUpdate() {

  const addStockId = form.value.addStockId
  const addStockType = form.value.addStockType

  if(addStockType === "采购入库"){
    router.push({
      path:'/outAddManage/addStock/purchaseAddStock',
      query:{addStockId : addStockId}
    });
  }else if(addStockType === "二恶"){
    router.push({
      path:'/outAddManage/addStock/producePlanAddStock',
      query:{addStockId : addStockId}
    });
  } else{
    router.push({
      path:'/outAddManage/addStock/producePlanAddStock',
      query:{addStockId : addStockId}
    });
  }

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


// 接收参数
const addStockId = ref(route.query.addStockId);
function addOrUpdate(){
  if(addStockId.value == null){
  }else{
    getAddStock(addStockId.value).then(response => {
      form.value = response.data;
      orderSelection.value = form.value.orderSelection;
      orderPlanProductsList.value = form.value.orderPlanProductsList;
      if(form.value.auditId === "0"){
        updateShow.value = false
      }
    });
  }
}


addOrUpdate();
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