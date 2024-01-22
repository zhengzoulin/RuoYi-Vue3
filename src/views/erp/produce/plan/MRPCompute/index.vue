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
          <el-button type="primary" plain icon="primary" @click="subMitAddStockAndAuditPass">开始生产</el-button>
          <el-button type="warning" plain icon="primary" @click="submitPurchaseList">生成采购需求</el-button>
      </div>


    </el-row>


    <el-col :span="24">
      <el-card v-if="plan && plan.warehouse && plan.productForm">

        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <div class="card-item">
              <label>计划编号: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{ plan.planCode }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-item">
              <label>单据名称: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{ plan.planName  }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-item">
              <label>仓库: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{ plan.warehouse.warehousePath }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-item">
              <label>生产线: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{plan.line.lineName}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="card-item">
              <label>成品编号: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{ plan.productForm.productCode }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-item">
              <label>成品名称: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{ plan.productForm.productName  }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-item" >
              <label>成品型号: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{ plan.productForm.productModel }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-item" >
              <label>封装规格: </label>
              <span style="margin-left: 30px; font-size: 18px !important;">{{ plan.productForm.encapStandard }}</span>
            </div>
          </el-col>
        </el-row>


      </el-card>
    </el-col>

    <el-form>
      <el-table
          :data="form.productList"
          v-loading="openPlanAdd"
          style="width: 100%"
      >

        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" width="90" prop="productCode" />
        <el-table-column label="商品信息" align="center" width="120"  >
          <template #default="scope">
            <span style="display: block;font-family: '微软雅黑'">商品:{{ scope.row.productName }}</span>
            <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
            <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
            <span style="display: block;">包装数量:{{ scope.row.minpacketNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单套用量" prop="singleGroupNumber" align="center" width="120px" />
        <el-table-column label="预损耗量" prop="estimatedLoss" align="center" width="120px"/>
        <el-table-column label="用量总数(目标)" align="center" prop="usageAmount" >
          <template #default="scope">
                      <span style="color: rgba(40,177,232,0.83); ">
                        {{scope.row.usageAmount}}
                      </span>
          </template>
        </el-table-column>
        <el-table-column label="库存数量(查询)" align="center" prop="balanceNumber" />
        <el-table-column label="其他单据占用数量(生产计划正在生产的部分)" align="center">
          <template #default="scope">
            <a  style="color: rgba(40,177,232,0.83); text-decoration: underline;">{{scope.row.occupiedNumber}}</a>
          </template>
        </el-table-column>
        <el-table-column label="当前可用数量" align="center" prop="availableNumber" />
        <el-table-column label="缺料数量(计算得出)" align="center"  >
          <template #default="scope">
                      <span style="color: red; ">
                        {{calculateShortage(scope.row) }}
                      </span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

<!--生产补货订单弹窗-->
    <el-dialog :title="title" v-model="openPurchase" width="950px"  append-to-body>
      <el-table
          :data="purchaseProductList"
          v-loading="openPlanAdd"
          style="width: 100%"
      >

        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" width="90" prop="productCode" />
        <el-table-column label="商品信息" align="center" width="120"  >
          <template #default="scope">
            <span style="display: block;font-family: '微软雅黑'">商品:{{ scope.row.productName }}</span>
            <span style="display: block;">封装规格:{{ scope.row.encapStandard }}</span>
            <span style="display: block;">厂家型号:{{ scope.row.productModel }}</span>
            <span style="display: block;">包装数量:{{ scope.row.minpacketNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单套用量" prop="singleGroupNumber" align="center" width="120px" />
        <el-table-column label="预损耗量" prop="estimatedLoss" align="center" width="120px"/>
        <el-table-column label="用量总数(目标)" align="center" prop="usageAmount" >
          <template #default="scope">
                      <span style="color: rgba(40,177,232,0.83); ">
                        {{scope.row.usageAmount}}
                      </span>
          </template>
        </el-table-column>
        <el-table-column label="库存数量(查询)" align="center" prop="balanceNumber" />
        <el-table-column label="当前可用数量" align="center" prop="availableNumber" />
        <el-table-column label="需采购数量" align="center"  >
          <template #default="scope">
                      <span style="color: red; ">
                        {{calculateShortage(scope.row) }}
                      </span>
          </template>
        </el-table-column>
      </el-table>

      <el-row style="margin-top: 20px">
        <el-button style="margin-left: 85%" @click="goPurchase" type="primary" plain >
          生产缺料采购单
        </el-button>
      </el-row>

    </el-dialog>

  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {AddStockList, updateAddStock} from "../../../../../api/erp/addStock";
import {getPlan} from "../../../../../api/erp/plan";

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const openPurchase = ref(false)
const loading = ref(true);
const ids = ref([]);
const plan = ref({});
const title = ref('')

const purchaseProductList = ref([])

const data = reactive({
  form: {
    productList:ref([{
      ProductUse:ref({
        usageAmount: 0

      })
    }])
  },
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
  if (planId.value == null) {
    return 'MRP计算';
  } else {
    return 'MRP计算';
  }
});


function calculateShortage(row) {
  // 计算缺料数量
  let shortage = row.usageAmount - row.availableNumber + row.estimatedLoss;
  row.demandNumber = shortage
  // 如果缺料数量小于等于0，则显示0，否则显示缺料数量
  shortage = shortage <= 0 ? 0 : shortage;
  return shortage;
}

//提交入库单到后端
function subMitAddStockList(){
  console.log("id是：")

  if (form.value.addStockId == null) {

  }else {

  }
  router.push("/produce/plan");
}



//生成采购订单
function submitPurchaseList(){

  purchaseProductList.value = []
  form.value.productList.forEach(row =>{
    if(row.demandNumber > 0){
      row.warehouseId = form.value.warehouseId

      purchaseProductList.value.push(row);
    }
  })
  openPurchase.value = true;
  title.value = "缺料采购"


}
//跳转采购
function goPurchase(){
  const data = {};
  data.remark = "缺料补货"
  data.planId = form.value.planId
  data.planCode = form.value.planCode
  data.purchaseProductList = purchaseProductList.value
  data.warehouseId = form.value.warehouseId

  console.log(data)

  router.push({
    path:'/purchaseManage/order/addOrder',
    query:{produce: JSON.stringify(data)}
  });
}

// 接收参数
const planId = ref(route.query.planId);

if(planId != null){
  getPlan(planId.value).then(response => {
    plan.value = response.data;
    form.value = plan.value;
    form.value.productList = response.data.productList
    console.log(plan.value)
  });
}
</script>

<style scoped>
.header {
  justify-content: space-between;
  margin-bottom: 9px;
  padding-right: 2%;
}
</style>