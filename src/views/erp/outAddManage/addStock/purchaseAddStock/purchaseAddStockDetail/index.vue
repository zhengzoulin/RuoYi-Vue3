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


        <el-descriptions-item label="发货方"  label-align="center">
          {{form.unit.unitName}}
        </el-descriptions-item>
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

    <el-table v-loading="ProductsListLoading"
              :data="form.selectedOrder"
              :rules="rules"
              height="150px"
              @cell-click="tabClick"
              style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
    >

      <el-table-column label="#" type="index" width="55" align="center" />

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
      <el-table-column label="交货日期" prop="purchaseOrderTime" align="center" />

      <el-table-column label="供应商" align="center" prop="unit.unitName"/>
      <el-table-column label="备注" prop="remark"/>

    </el-table>

    <div style="margin-top: 10px "> <span >入库商品明细 </span>

    </div>
    <!--      待入库商品明细表格-->
    <el-table v-loading="ProductsListLoading"
              :data="form.orderProductsList"
              :rules="rules"
              height="350"
              class="productAddDetailTable"
              style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
              @cell-click="tabClick">

      <el-table-column type="index" width="55" align="center" label="#" />
      <el-table-column label="商品编号" align="center" prop="productCode"/>

      <el-table-column label="商品信息" align="center" prop="productName"/>
      <el-table-column label="可入库数量" prop="demandNumber" align="center" >

      </el-table-column>

      <el-table-column label="金额" prop="orderMoney" align="center" class="select-container"/>
      <el-table-column label="成本价" align="center" prop="costPrice" width="100px"/>

      <el-table-column label="备注" prop="remark" align="center"  width="90px"/>

      <el-table-column label="入库数量" prop="demandNumber" align="center"  width="120px"/>

      <el-table-column label="入库位置相关信息" align="center" width="240px">
        <template #default="scope">
          <a
              href="#"
              class="custom-link-style"
              v-html="String.raw`${formatBatchPosition(scope.row)}`"
          ></a>
        </template>
      </el-table-column>


    </el-table>


    <el-button size="mini" type="primary" @click="pdfFunc" :loading="loading">
      转成pdf
    </el-button>
    ...
    <div id="pdfDom">
      <!-- 此处是希望转成pdf的部分的内容，用一个大div盒子包起来 -->
    </div>


  </div>
</template>

<script setup>


import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {AddStockList, getAddStock, updateAddStock} from "../../../../../../api/erp/addStock";
import htmlToPdf from 'src/utils/htmlToPdf'; // 导入htmlToPdf.js


const orderDetailFormShow = ref(true)
const updateShow = ref(true)
const { proxy } = getCurrentInstance();


const pdfFunc = () => {
  loading.value = true;
  // 调用htmlToPdf工具函数
  htmlToPdf.getPdf('文档名称');
  // 定时器模拟按钮loading动画的时间
  setTimeout(() => {
    loading.value = false;
    // ElMessage.success('打印成功!');
  }, 1000);
}

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

const displayTitleText = computed(() => {
  if (addStockId.value == null) {
    return '新增采购入库';
  } else {
    return '修改采购入库单';
  }
});

// 接收参数
const addStockId = ref(route.query.addStockId);
function addOrUpdate(){
  if(addStockId.value == null){
  }else{
    getAddStock(addStockId.value).then(response => {
      form.value = response.data;
      if(form.value.auditId === "0"){
        updateShow.value = false
      }
    });
  }
}


addOrUpdate();
</script>



<style>




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
  font-size: 10px; /* 入库详细设置合适的字体大小 */
  /* 其他可能的样式 */
}


.select-container {
  position: relative;
}
.header {
  justify-content: space-between;
  margin-bottom: 10px;
  padding-right: 2%;
}

</style>