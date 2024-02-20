<template>
  <div class="app-container" v-loading="loading" >
    <el-row class="header">
      <router-link to="/outAddManage/outStock">
        <el-button type="primary"     icon="Back"
                   plain style=" color: #fff;background-color: #909399;
                              border-color: #909399; font-size: 12px">
          <span>返回</span>
        </el-button>

      </router-link>
      <div >
        <span style="color: #1c84c6;font-size: 24px">出库单详情</span>
      </div>
      <div>
        <el-button type="warning" plain @click="handleUpdate" :disabled="updateShow">修改</el-button>
        <el-button type="primary" plain @click="pdfFunc" :loading="loading">导出pdf</el-button>

      </div>
    </el-row>

    <span > 出库单基本信息
        <el-button link type="primary" icon="list" @click="orderDetailFormShow = !orderDetailFormShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>
    <div class="section-content" v-show="orderDetailFormShow">
      <!-- Form items for basic info -->
      <el-descriptions border="true" column="3" size="large" class="my-descriptions" v-show="orderDetailFormShow">
        <el-descriptions-item label="出库单号"  label-align="center">
          {{form.outStockCode }}
        </el-descriptions-item>

        <el-descriptions-item label="单据名称"  label-align="center">
          {{form.outStockName }}
          <el-button link type="primary"  icon="Edit"  @click=" " class="followButton"></el-button>
        </el-descriptions-item>

        <el-descriptions-item label="出库类型"  label-align="center">
          {{form.outStockType}}
        </el-descriptions-item>


        <el-descriptions-item label="发货方"  label-align="center">
          {{form.unit.unitName}}
        </el-descriptions-item>
        <el-descriptions-item label="退货仓库"  label-align="center">
          {{form.warehouse.warehousePath}}
        </el-descriptions-item>

        <el-descriptions-item label="出库日期" prop="outStockTime"  label-align="center">
          {{form.outStockTime}}
        </el-descriptions-item>

        <el-descriptions-item label="订单备注"  label-align="center">
          {{form.remark}}
        </el-descriptions-item>
      </el-descriptions>

    </div>


    <div style="margin-top: 10px "> <span >采购退货退货订单信息 </span>

    </div>

    <el-table 
              :data="returnOrderSelection"
              height="150px"
              style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
    >

      <el-table-column label="#" type="index" width="55" align="center" />

      <el-table-column label="采购退货订单编号" align="center" prop="purchaseOrderReturnId">
        <template #default="scope">
          <!-- 使用 <a> 标签来包装数据，并添加样式 -->
          <a
              href="#"
              style="color: rgba(40,177,232,0.83); text-decoration: underline;"
              @click="handleOrderDetailClick(scope.row)"
          >
            {{ scope.row.purchaseOrderReturnCode }}
          </a>
        </template>
      </el-table-column>

      <el-table-column label="单据名称" align="center" prop="purchaseOrderReturnName"/>
      <el-table-column label="采购单号" align="center" prop="purchaseOrderCode"  />

      <el-table-column label="创建日期" prop="createTime" align="center"/>
      <el-table-column label="交货日期" prop="purchaseOrderReturnTime" align="center"/>
      <el-table-column label="退货订单备注" prop="remark"  align="center"/>

    </el-table>

    <div style="margin-top: 10px "> <span >出库商品明细 </span>

    </div>
    <!--      待出库商品明细表格-->
    <el-table
              :data="form.orderPlanProductsList"
               height="300"
              style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
    >

      <el-table-column type="index" width="55" align="center" label="#" />
      <el-table-column label="编号" align="center" prop="productCode" width="90px"/>

      <el-table-column label="商品信息" align="center" width="120px">
        <template #default="scope">
          <span style="display: block;"> {{ scope.row.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
          <span style="display: block;">最小包装数量:{{ scope.row.minpacketNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货数量" prop="returnNumber" align="center" class="select-container" width="220px"/>

      <el-table-column label="在库数量" prop="balanceNumber" align="center" class="select-container" width="220px"/>


      <el-table-column label="出库数量"  prop="outStockNumber" align="center" width="190px" />

      <el-table-column label="出库位置相关信息" align="center" >
        <template #default="scope">
          <a
              href="#"
              class="custom-link-style"
               v-html="String.raw`${formatBatchPosition(scope.row)}`"
          ></a>
        </template>
      </el-table-column>

    </el-table>



    <div id="pdfDom" v-show="loading">

      <el-row style="justify-content: center;margin: 15px;font-size: 28px">   <span >{{form.warehouse.warehousePath}}-{{form.outStockType}}单-{{form.outStockTime}}</span></el-row>

      <div class="description-container">
        <el-row style="justify-content: center;margin: 10px">   <span > 出库单基本信息</span></el-row>

        <el-descriptions border="true" column="3" size="large" class="my-descriptions" >
          <el-descriptions-item label="出库单号"  label-align="center">
            {{form.outStockCode }}
          </el-descriptions-item>

          <el-descriptions-item label="单据名称"  label-align="center">
            {{form.outStockName }}
          </el-descriptions-item>

          <el-descriptions-item label="出库类型"  label-align="center">
            {{form.outStockType}}
          </el-descriptions-item>


          <el-descriptions-item label="发货方"  label-align="center">
            {{form.unit.unitName}}
          </el-descriptions-item>
          <el-descriptions-item label="退货仓库"  label-align="center">
            {{form.warehouse.warehousePath}}
          </el-descriptions-item>

          <el-descriptions-item label="出库日期" prop="outStockTime"  label-align="center">
            {{form.outStockTime}}
          </el-descriptions-item>

          <el-descriptions-item label="订单备注"  label-align="center">
            {{form.remark}}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="table-container">
        <el-row style="justify-content: center;margin-top: 10px">   <span > 采购退货订单信息</span></el-row>

        <el-table
            :data="returnOrderSelection"
         >

          <el-table-column label="#" type="index" width="55" align="center" />

          <el-table-column label="采购退货订单编号" align="center" prop="purchaseOrderReturnId">
            <template #default="scope">
              <!-- 使用 <a> 标签来包装数据，并添加样式 -->
              <a
                  href="#"
                  style="color: rgba(40,177,232,0.83); text-decoration: underline;"
                  @click="handleOrderDetailClick(scope.row)"
              >
                {{ scope.row.purchaseOrderReturnCode }}
              </a>
            </template>
          </el-table-column>

          <el-table-column label="单据名称" align="center" prop="purchaseOrderReturnName"/>
          <el-table-column label="采购单号" align="center" prop="purchaseOrderCode"  />

          <el-table-column label="创建日期" prop="createTime" align="center"/>
          <el-table-column label="交货日期" prop="purchaseOrderReturnTime" align="center"/>
          <el-table-column label="退货订单备注" prop="remark"  align="center"/>

        </el-table>      </div>

      <div class="table-container">
        <el-row style="justify-content: center;margin-top: 10px">   <span > 出库商品明细</span></el-row>


        <!--      待出库商品明细表格-->
        <el-table
            :data="form.orderPlanProductsList"
        >

          <el-table-column type="index" width="55" align="center" label="#" />
          <el-table-column label="编号" align="center" prop="productCode" width="90px"/>

          <el-table-column label="商品信息" align="center" width="120px">
            <template #default="scope">
              <span style="display: block;"> {{ scope.row.productName }}</span>
              <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
              <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
              <span style="display: block;">最小包装数量:{{ scope.row.minpacketNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退货数量" prop="returnNumber" align="center" class="select-container" width="220px"/>

          <el-table-column label="在库数量" prop="balanceNumber" align="center" class="select-container" width="220px"/>


          <el-table-column label="出库数量"  prop="outStockNumber" align="center" width="190px" />

          <el-table-column label="出库位置相关信息" align="center" >
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

    </div>


  </div>
</template>

<script setup>


import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
 import htmlToPdf from "../../../../../../utils/htmlToPdf";
import {getOutStock} from "../../../../../../api/erp/outStock"; // 导入htmlToPdf.js


const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const orderDetailFormShow = ref(true)
const updateShow = ref(true)
const loading = ref(false)
const returnOrderSelection = ref();


const pdfFunc = () => {

  loading.value = true;
  // 调用htmlToPdf工具函数
  setTimeout(() => {
    let fileName = form.value.warehouse.warehousePath+'-'+form.value.outStockType+'单-'+form.value.outStockTime
    htmlToPdf.getPdf(fileName);  }, 100);
  // 定时器模拟按钮loading动画的时间
  setTimeout(() => {
    proxy.$modal.msgSuccess("导出成功");
    loading.value = false;


  }, 1000);

}

const data = reactive({
  form: {
    outStockType: "采购退货出库",
    unit: {
      unitId:('')
    },
    warehouse: {
      warehouseId:('')
    },
    warehouseName: ref(''),
    orderProductsList: ref([   //订单多个商品列表
      {
        outStockProduct: ref({       //商品出库条
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
    outStockCode: null,
    outStockName: null,
    outStockType: "采购退货出库",
    warehouseId: null,
    warehousePath: null,
    unitName: ref(''),
    auditId: null,
    status: null,
  },
  rules: {

    outStockName: [
      { required: true, message: "单据名称不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);


/** 修改按钮操作 */
function handleUpdate() {

  const outStockId = form.value.outStockId
  const outStockType = form.value.outStockType

  if(outStockType === "采购退货出库"){
    router.push({
      path:'/outAddManage/outStock/purchaseAddStock',
      query:{outStockId : outStockId}
    });
  }else if(outStockType === "二恶"){
    router.push({
      path:'/outAddManage/outStock/producePlanAddStock',
      query:{outStockId : outStockId}
    });
  } else{
    router.push({
      path:'/outAddManage/outStock/producePlanAddStock',
      query:{outStockId : outStockId}
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

  return '选择出库：位置-批次';
}

const displayTitleText = computed(() => {
  if (outStockId.value == null) {
    return '新增采购退货出库';
  } else {
    return '修改采购退货出库单';
  }
});

// 接收参数
const outStockId = ref(route.query.outStockId);
function addOrUpdate(){
  if(outStockId.value == null){
    alert("新增")
  }else{
    alert("修改xiaos")
    getOutStock(outStockId.value).then(response => {
      form.value = response.data;
      returnOrderSelection.value = form.value.returnOrderSelection;
      console.log(form.value)
      // form.value.orderPlanProductsList = form.value.orderPlanProductsList;
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
  font-size: 10px; /* 出库详细设置合适的字体大小 */
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


.description-container {
  /* 描述框的样式 */
  border: 1px solid #ddd;
  border-color: #ddd; /* 设置边框颜色与描述框默认边框颜色一致 */
}

.table-container {
  /* 表格的样式 */
  border: 1px solid #ddd;
  border-color: #ddd; /* 设置边框颜色与描述框默认边框颜色一致 */
}

</style>