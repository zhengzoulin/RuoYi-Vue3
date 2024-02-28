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
        <span style="color: #1c84c6;font-size: 24px">生产领取物料出库单</span>
      </div>
      <div>
        <el-button type="warning" plain @click="handleUpdate" :disabled="updateShow">修改</el-button>
        <el-button type="primary" plain @click="pdfFunc" :loading="loading">导出pdf</el-button>

      </div>
    </el-row>

    <span > 入库单基本信息
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

        <el-descriptions-item label="目标仓库"  label-align="center">
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


    <div style="margin-top: 10px "> <span >生产订单信息 </span>

    </div>

    <el-table v-loading="ProductsListLoading"
              :data="form.orderSelection"
              :rules="rules"
              height="180px"
              style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
    >

      <el-table-column label="#" type="index" width="55" align="center" />

      <el-table-column label="计划单号" align="center" prop="planCode">
        <template #default="scope">
           <a
              href="#"
              style="color: rgba(40,177,232,0.83); text-decoration: underline;"
              @click="handleOrderDetailClick(scope.row)"
          >
            {{ scope.row.planCode }}
          </a>
        </template>
      </el-table-column>

      <el-table-column label="单据名称" align="center" prop="planName"/>

      <el-table-column label="计划日期" prop="planTime" align="center" />
      <el-table-column label="交货日期" prop="planTime" align="center" />
      <el-table-column label="生产备注" prop="remark" width="120px" align="center"/>

      <el-table-column label="成品编号" align="center" prop="productForm.productName" width="100px"  />
      <el-table-column label="商品信息" align="center" width="220px">
        <template #default="scope">
          <span style="display: block;"> {{ scope.row.productForm.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.productForm.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.productForm.productModel }}</span>
          <span style="display: block;">最小包装数量:{{ scope.row.productForm.minpacketNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产数量" align="center" prop="groupNumber" />

    </el-table>

    <div style="margin-top: 10px "> <span >领料出库商品明细 </span>

    </div>
    <!--      待入库商品明细表格-->
    <el-table v-loading="ProductsListLoading"
              :data="form.orderPlanProductsList"
              :rules="rules"
              height="300"
              style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
    >

      <el-table-column type="index" width="55" align="center" label="#" />
      <el-table-column label="商品编号" align="center" prop="productCode" width="90px"/>

      <el-table-column label="商品信息" align="center" width="120px">
        <template #default="scope">
          <span style="display: block;"> {{ scope.row.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
          <span style="display: block;">最小包装数量:{{ scope.row.minpacketNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="需求总数" prop="usageAmount" align="center" class="select-container" width="110px"/>

      <el-table-column label="备损量" prop="estimatedLoss" align="center" class="select-container" width="110px"/>
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
               v-html="String.raw`${formatBatchPosition(scope.row)}`"
          ></a>
        </template>
      </el-table-column>

    </el-table>



    <div id="pdfDom" v-show="loading">
      <div class="description-container">
        <el-row style="justify-content: center;margin: 15px;font-size: 28px">   <span >{{form.warehouse.warehousePath}}-{{form.outStockType}}单-{{form.outStockTime}}</span></el-row>
        <el-descriptions border="true" column="3" size="large" class="my-descriptions" >
          <el-descriptions-item label="出库单号"  label-align="left">
            {{form.outStockCode }}
          </el-descriptions-item>

          <el-descriptions-item label="单据名称"  label-align="left">
            {{form.outStockName }}
           </el-descriptions-item>

          <el-descriptions-item label="出库类型"  label-align="left">
            {{form.outStockType}}
          </el-descriptions-item>

          <el-descriptions-item label="目标仓库"  label-align="left">
            {{form.warehouse.warehousePath}}
          </el-descriptions-item>

          <el-descriptions-item label="出库日期" prop="outStockTime"  label-align="left">
            {{form.outStockTime}}
          </el-descriptions-item>

          <el-descriptions-item label="订单备注"  label-align="left">
            {{form.remark}}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="table-container">
        <el-row style="justify-content: center;margin : 10px">   <span > 入库单基本信息</span></el-row>
        <el-table v-loading="ProductsListLoading"
                  :data="form.orderSelection"
                  :rules="rules"
        >

          <el-table-column label="#" type="index" width="55" align="center" />

          <el-table-column label="计划单号" align="center" prop="planCode">
            <template #default="scope">
              <a
                  href="#"
                  style="color: rgba(40,177,232,0.83); text-decoration: underline;"
                  @click="handleOrderDetailClick(scope.row)"
              >
                {{ scope.row.planCode }}
              </a>
            </template>
          </el-table-column>

          <el-table-column label="单据名称" align="center" prop="planName"/>

          <el-table-column label="计划日期" prop="planTime" align="center" />
          <el-table-column label="交货日期" prop="planTime" align="center" />
          <el-table-column label="生产备注" prop="remark" width="120px" align="center"/>

          <el-table-column label="成品编号" align="center" prop="productForm.productName" width="100px"  />
          <el-table-column label="商品信息" align="center" width="220px">
            <template #default="scope">
              <span style="display: block;"> {{ scope.row.productForm.productName }}</span>
              <span style="display: block;">封装规格:{{ scope.row.productForm.encapStandard }}</span>
              <span style="display: block;">厂家型号:{{ scope.row.productForm.productModel }}</span>
              <span style="display: block;">最小包装数量:{{ scope.row.productForm.minpacketNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生产数量" align="center" prop="groupNumber" />

        </el-table>
      </div>


      <div class="table-container">
        <el-row style="justify-content: center;margin-top: 10px">   <span > 领料出库商品明细</span></el-row>
        <!--      待入库商品明细表格-->
        <el-table v-loading="ProductsListLoading"
                  :data="form.orderPlanProductsList"
                  :rules="rules">

          <el-table-column type="index" width="55" align="center" label="#" />
          <el-table-column label="商品编号" align="center" prop="productCode" width="90px"/>

          <el-table-column label="商品信息" align="center" width="120px">
            <template #default="scope">
              <span style="display: block;"> {{ scope.row.productName }}</span>
              <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
              <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
              <span style="display: block;">最小包装数量:{{ scope.row.minpacketNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="需求总数" prop="usageAmount" align="center" class="select-container" width="110px"/>

          <el-table-column label="备损量" prop="estimatedLoss" align="center" class="select-container" width="110px"/>
          <el-table-column label="可出库数量" prop="availableNumber" align="center" width="110px"/>

          <el-table-column label="出库数量" prop="outStockNumber"   align="center"  />

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
import {AddStockList, getAddStock, updateAddStock} from "../../../../../../api/erp/addStock";
import htmlToPdf from "../../../../../../utils/htmlToPdf";
import {getOutStock} from "../../../../../../api/erp/outStock"; // 导入htmlToPdf.js


const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const orderDetailFormShow = ref(true)
const updateShow = ref(true)
const loading = ref(false)


const pdfFunc = () => {

  loading.value = true;
  // 调用htmlToPdf工具函数
  setTimeout(() => {
    let fileName = form.value.warehouse.warehousePath+'-'+form.value.outStockType+'单-'+form.value.outStockTime
     htmlToPdf.getPdf(fileName);
  }, 100);
  // 定时器模拟按钮loading动画的时间
  setTimeout(() => {
    proxy.$modal.msgSuccess("导出成功");
    loading.value = false;

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
    orderPlanProductsList: ref([   //订单多个商品列表
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


/** 修改按钮操作 */
function handleUpdate() {

  const outStockId = form.value.outStockId
  const addStockType = form.value.addStockType

  if(addStockType === "生产计划出库"){
    router.push({
      path:'/outAddManage/outStock/producePlanOutStock',
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

  return '选择入库：位置-批次';
}

// 接收参数
const outStockId = ref(route.query.outStockId);
function addOrUpdate(){
  if(outStockId.value == null){
    alert("新增")
  }else{
    alert("修改")
    getOutStock(outStockId.value).then(response => {
      form.value = response.data;
      orderSelection.value = form.value.orderSelection;
      orderPlanProductsList.value = form.value.orderPlanProductsList;
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