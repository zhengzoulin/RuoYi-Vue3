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

        <el-col :span="24"    style="position: absolute; top: 0; right: 20px; width: auto;">
          <el-button type="primary"    @click="subMitPurchaseOrPlanList">生成生产计划或采购需求</el-button>
        </el-col>
      </div>

    </el-row>
    <el-col :span="24">

      <el-card  v-if="productList">

        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <div class="card-item">
              <label>销售单号: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{ form.salesOrderCode }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-item">
              <label>单据名称: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{ form.salesOrderName  }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-item">
              <label>仓库: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">
                    {{ form.warehousePath }}
                 </span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <p>生产成品商品列表</p>
          <el-table
              :data="productPlanList"
              v-loading="openPlanAdd"
              style="width: 100%"
          >

            <el-table-column type="selection" width="55" align="center" />
             <el-table-column label="商品编号" prop="productCode" align="center" width="120px" />
            <el-table-column label="商品名称" prop="productName" align="center" width="120px">
              <template #default="scope">
                <span style=" font-weight: 700;font-size: 14px">{{ scope.row.productName }}</span>

              </template>
            </el-table-column>

            <el-table-column label="商品信息" align="center" width="160"  >
              <template #default="scope">
                 <span style="display: block;">封装规格: {{ scope.row.encapStandard }}</span>
                <span style="display: block;">厂家型号: {{ scope.row.productModel }}</span>
                <span style="display: block;">包装数量: {{ scope.row.minpacketNumber }}</span>
              </template>
            </el-table-column>
             <el-table-column label="销售数量" prop="saleNumber" align="center"  />

            <el-table-column label="当前可用数量" align="center" prop="availableNumber" />
            <el-table-column label="需生产数量" align="center"   prop="lackNumber">
              <template #default="scope">
                <span style="color: #ed5565">{{scope.row.lackNumber}}</span>
              </template>
            </el-table-column>
             <el-table-column label="BOM编号" align="center"  prop="bomCode">
              <template #default="scope">
                  <span
                      style="color: rgba(40,177,232,0.72); ;  font-size: 12px;font-weight: bold;"
                      @click="handleBomDetailClick(scope.row)"
                  >
                    {{ scope.row.bomCode }}
                  </span>
              </template>
            </el-table-column>


           </el-table>
        </el-row>

        <el-row>
          <p>生成采购需求列表
          </p>

          <el-table
              :data="productPurchaseList"
              v-loading="openPlanAdd"
              style="width: 100%"
          >

            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="商品编号" prop="productCode" align="center" width="120px" />
            <el-table-column label="商品名称" prop="productName" align="center" width="120px">
              <template #default="scope">
                <span style=" font-weight: 700;font-size: 14px">{{ scope.row.productName }}</span>

              </template>
            </el-table-column>

            <el-table-column label="商品信息" align="center" width="160"  >
              <template #default="scope">
                <span style="display: block;">封装规格: {{ scope.row.encapStandard }}</span>
                <span style="display: block;">厂家型号: {{ scope.row.productModel }}</span>
                <span style="display: block;">包装数量: {{ scope.row.minpacketNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="销售数量" prop="saleNumber" align="center"  />

            <el-table-column label="当前可用数量" align="center" prop="availableNumber" />
            <el-table-column label="需采购数量" align="center"   prop="lackNumber">
              <template #default="scope">
                <span style="color: #ed5565">{{scope.row.lackNumber}}</span>
              </template>
            </el-table-column>

           </el-table>
        </el-row>
      </el-card>
    </el-col>







  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {AddStockList, updateAddStock} from "../../../../../../api/erp/addStock";
import {createPurchaseOrPlan, getPurchaseAndPlanBySalesProducts} from "../../../../../../api/erp/sales";

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const loading = ref(true);
const ids = ref([]);

const productPurchaseList = ref([])
//-----
const productPlanList = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    lineCode: null,
    lineName: null,
    warehouseId: null,
    warehouse: null,
    lineStatus: null,
    status: null,
  },
  rules: {
    warehouseId: [
      { required: true, message: "仓库id不能为空", trigger: "blur" }
    ],
    lineStatus: [
      { required: true, message: "生产状态不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

const displayTitleText = computed(() => {
  if (planId.value == null ) {
    return '销售清算';
  } else {
    return '修改生产计划入库单';
  }
});

//提交入库单到后端
function subMitPurchaseOrPlanList(){

  console.log("id是：")

  if (form.value.planId == null) {
    //
    let data={}
    data.productPurchaseList = productPurchaseList.value
    data.productPlanList = productPlanList.value
    data.warehouseId = form.value.warehouseId
    data.salesOrderCode = form.value.salesOrderCode
    console.log(data)
    createPurchaseOrPlan(data).then(response =>{
      proxy.$modal.msgSuccess("生成需求和生产计划成功！");
    })

  }else {


  }
  router.push("/salesManage/sales");
}


// 接收参数
const planId = ref(route.query.planId ? route.query.planId : null );
const productList = ref(route.query.productList ? route.query.productList : null);

console.log("*********接受数据")
console.log(planId.value)
if(productList.value !== null ){
  alert("销售")

  productList.value = JSON.parse(productList.value);
  console.log(productList.value)
  form.value = productList.value
  getPurchaseAndPlanBySalesProducts(productList.value.purchaseProductList).then(response =>{
    productPurchaseList.value = response.data.productPurchaseList;
    productPlanList.value = response.data.productPlanList;

    console.log(productPurchaseList.value)
    console.log(productPlanList.value)
  })
}

</script>



<style  >

.header {
  justify-content: space-between;
  margin-bottom: 10px;
  padding-right: 2%;
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