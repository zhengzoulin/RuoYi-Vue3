<template>
  <div class="app-container home">

    <el-row :gutter="13">
      <el-col :span="16">
        <el-card class="card-item">

          <div class="body">
            <div class="headTitle" style="margin-bottom: 20px">系统模块</div>
            <div class="panel-body scrollbar-hover">
              <el-row class="row row-admin">
                <div class="flow-item flow-item-0"><div title="系统管理">系统管理</div></div>
                <div class="flow-item flow-item-1"><div title="部门管理">部门管理</div></div>
                <div class="flow-item flow-item-2"><div title="员工管理">员工管理</div></div>
                <div class="flow-item flow-item-3"><div title="权限维护">权限维护</div></div>
                <div class="flow-item flow-item-4"><div title="岗位管理">岗位管理</div></div>
              </el-row>
              <el-row class="row row-product">
                <div class="flow-item flow-item-0"><div title="采购管理">采购管理</div></div>
                <div class="flow-item flow-item-1"><div title="新增采购">新增采购</div></div>
                <div class="flow-item flow-item-2"><div title="新增需求">新增需求</div></div>
                <div class="flow-item flow-item-3"><div title="发布采购">发布采购</div></div>
                <div class="flow-item flow-item-4"><div title="采购审核">采购审核</div></div>
              </el-row>
              <el-row class="row row-project">
                <div class="flow-item flow-item-0"><div title="生产管理">生产管理</div></div>
                <div class="flow-item flow-item-1"><div title="BOM表管理">BOM表管理</div></div>
                <div class="flow-item flow-item-2"><div title="BOM表维护">BOM表维护</div></div>
                <div class="flow-item flow-item-3"><div title="生产计划">生产计划</div></div>
                <div class="flow-item flow-item-4"><div title="生产监督">生产监督</div></div>
              </el-row>
              <el-row class="row row-dev">
                <div class="flow-item flow-item-0"><div title="仓库管理">仓库管理</div></div>
                <div class="flow-item flow-item-1"><div title="仓库设置">仓库设置</div></div>
                <div class="flow-item flow-item-2"><div title="库位管理">库位管理</div></div>
                <div class="flow-item flow-item-3"><div title="批次管理">批次管理</div></div>
                <div class="flow-item flow-item-4"><div title="库存管理">库存管理</div></div>

              </el-row>
              <el-row class="row row-tester">
                <div class="flow-item flow-item-0"><div title="出入库">出入库</div></div>
                <div class="flow-item flow-item-1"><div title="采购入库">采购入库</div></div>
                <div class="flow-item flow-item-2"><div title="生产计划入库">生产计划入库</div></div>
                <div class="flow-item flow-item-3"><div title="生产领料出库">生产领料出库</div></div>
<!--                <div class="flow-item flow-item-4"><div title="退货出库">退货出库</div></div>-->
                <div class="flow-item flow-item-4"><div title="销售出库">销售出库</div></div>
              </el-row>
              <el-row class="row row-dev">
                <div class="flow-item flow-item-0"><div title="基础管理">基础管理</div></div>
                <div class="flow-item flow-item-1"><div title="往来单位">往来单位</div></div>
                <div class="flow-item flow-item-2"><div title="商品管理">商品管理</div></div>
                <div class="flow-item flow-item-3"><div title="目录管理">目录管理</div></div>
                <div class="flow-item flow-item-4"><div title="品牌管理">品牌管理</div></div>

              </el-row>
            </div>
          </div>
        </el-card>

      </el-col>
      <el-col :span="8">
        <el-card class="card-item">
          <div class="body">
            <div class="headTitle">数据统计</div>
            <el-row style="margin: 20px auto 10px auto;justify-content: space-between;">
              <el-col :span="18">
                <el-radio-group v-model="numberStaticParam.orderType"  >
                  <el-radio-button label="purchase" value="purchase"  @change="queryNumberStatic">采购概述</el-radio-button>
                  <el-radio-button label="sales" value="sales"  @change="queryNumberStatic">销售概述</el-radio-button>
                  <el-radio-button label="produce" value="produce"  @change="queryNumberStatic">生产概述</el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col :span="6">
                <el-tree-select
                    v-model="numberStaticParam.warehouseId"
                    :data="warehouseOptions"
                    :props="{ value: 'id', label: 'label', children: 'children' }"
                    value-key="id"
                    placeholder="所有仓库"
                    @change="queryNumberStatic"
                />
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="12">
                <el-date-picker
                    v-model="numberStaticParam.dateRange"
                    type="daterange"
                    unlink-panels
                    range-separator="To"
                    start-placeholder="Start"
                    end-placeholder="End"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    style="width:250px;height: 25px"
                    @change="queryNumberStatic"
                />
              </el-col>
            </el-row>
            <el-table  :data="numberStaticParam.staticList"
                       height="250"
                       :v-loading="staticTableLoading"
              >
              <el-table-column type="index" label="排序" width="55" align="center" />
              <el-table-column label="商品信息" align="center" prop="produceName" />
              <el-table-column :label= "getNumberStaticLabel(numberStaticParam.orderType)" align="center" prop="sumNumber" />
            </el-table>
          </div>
        </el-card>

      </el-col>
    </el-row>

        <el-row :gutter="13">
          <el-col :span="8">
            <el-card class="card-item-row2">

              <div class="body" style="height: 230px;">
                <div class="headTitle">BOM 概述</div>

                <div class="flex">
                  <div  class="wid50 center">
                    <router-link to="/bom">
                      <div class="red num-box">
                        <span  style="cursor: pointer;">{{summaryData.bomWaitAuditCount}}</span>
                      </div>
                    </router-link>

                    <div class="num-des-box">
                      <span data-v-432a8bfe="" style="cursor: pointer;">待审核</span>
                    </div>
                  </div>
                  <div  class="wid50 center">
                    <router-link to="/bom">
                      <div class="blue num-box">
                        <span  style="cursor: pointer;">{{summaryData.allBomCount}}</span>
                      </div>
                    </router-link>

                    <div  class="num-des-box">
                      <span  style="cursor: pointer;">可用BOM</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="card-item-row2">

              <div class="body" style="height: 230px;">
                <div class="headTitle">生产概述</div>

                <div class="flex">
                  <div  class="wid50 center">
                    <router-link to="/produce/plan">
                      <div class="red num-box">
                        <span  style="cursor: pointer;">{{summaryData.produceWaitAuditCount}}</span>
                      </div>
                    </router-link>

                    <div class="num-des-box">
                      <span data-v-432a8bfe="" style="cursor: pointer;">待审核</span>
                    </div>
                  </div>
                  <div  class="wid50 center">
                    <router-link to="/produce/plan">
                      <div class="black num-box">
                        <span  style="cursor: pointer;">{{summaryData.produceProcessCount}}</span>
                      </div>
                    </router-link>

                    <div class="num-des-box">
                      <span data-v-432a8bfe="" style="cursor: pointer;">进行中</span>
                    </div>
                  </div>
                  <div  class="wid50 center">
                    <router-link to="/produce/plan">
                      <div class="blue num-box">
                        <span  style="cursor: pointer;">{{summaryData.produceWaitAddStockCount}}</span>
                      </div>
                    </router-link>

                    <div  class="num-des-box">
                      <span  style="cursor: pointer;">待入库</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="card-item-row2">

              <div class="body" style="height: 230px;">
                <div class="headTitle">采购概述</div>

                <div class="flex">
                  <div  class="wid50 center">
                    <router-link to="/purchaseManage/order">
                      <div class="red num-box">
                        <span  style="cursor: pointer;">{{summaryData.demandWaitAuditCount}}</span>
                      </div>
                    </router-link>

                    <div class="num-des-box">
                      <span data-v-432a8bfe="" style="cursor: pointer;">待采购需求</span>
                    </div>
                  </div>
                  <div  class="wid50 center">
                    <router-link to="/purchaseManage/order">
                      <div class="red num-box">
                        <span  style="cursor: pointer;">{{summaryData.purchaseWaitAuditCount}}</span>
                      </div>
                    </router-link>

                    <div class="num-des-box">
                      <span data-v-432a8bfe="" style="cursor: pointer;">待审核</span>
                    </div>
                  </div>
                  <div  class="wid50 center">
                    <router-link to="/purchaseManage/order">
                      <div class="blue num-box">
                        <span  style="cursor: pointer;">{{summaryData.purchaseWaitAddStockCount}}</span>
                      </div>
                    </router-link>

                    <div class="num-des-box">
                      <span data-v-432a8bfe="" style="cursor: pointer;">待入库采购订单</span>
                    </div>
                  </div>
<!--                  <div  class="wid50 center">-->
<!--                    <div class="blue num-box">-->
<!--                      <span  style="cursor: pointer;">5</span>-->
<!--                    </div>-->
<!--                    <div  class="num-des-box">-->
<!--                      <span  style="cursor: pointer;">可用BOM</span>-->
<!--                    </div>-->
<!--                  </div>-->
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

    <el-row :gutter="13">
      <el-col :span="8">
        <el-card class="card-item-row2">

          <div class="body" style="height: 230px;">
            <div class="headTitle">销售概述</div>

            <div class="flex">
              <div  class="wid50 center">
                <router-link to="/salesManage/sales">
                  <div class="black num-box">
                    <span  style="cursor: pointer;">{{summaryData.salesWaitAuditCount}}</span>
                  </div>
                </router-link>

                <div class="num-des-box">
                  <span data-v-432a8bfe="" style="cursor: pointer;">待审核</span>
                </div>
              </div>
              <div  class="wid50 center">
                <router-link to="/salesManage/sales">
                  <div class="black num-box">
                    <span  style="cursor: pointer;">{{summaryData.salesWaitOutStockCount}}</span>
                  </div>
                </router-link>

                <div class="num-des-box">
                  <span data-v-432a8bfe="" style="cursor: pointer;">待出库</span>
                </div>
              </div>
              <div  class="wid50 center">
                <router-link to="/salesManage/sales">
                  <div class="blue num-box">
                    <span  style="cursor: pointer;">{{summaryData.salesAlreadyOutStockCount}}</span>
                  </div>
                </router-link>

                <div  class="num-des-box">
                  <span  style="cursor: pointer;">已出库</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card-item-row2">

          <div class="body" style="height: 230px;">
            <div class="headTitle">出入库概述</div>

            <div class="flex">
              <div  class="wid50 center">
                <router-link to="/outAddManage/outStock">
                  <div class="red num-box">
                    <span  style="cursor: pointer;">{{summaryData.outStockWaitAuditCount}}</span>
                  </div>
                </router-link>

                <div class="num-des-box">
                  <span data-v-432a8bfe="" style="cursor: pointer;">待处理出库单</span>
                </div>
              </div>
              <div  class="wid50 center">
                <router-link to="/outAddManage/addStock">
                  <div class="red num-box">
                    <span  style="cursor: pointer;">{{summaryData.addStockWaitAuditCount}}</span>
                  </div>
                </router-link>

                <div  class="num-des-box">
                  <span  style="cursor: pointer;">待处理入库单</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card-item-row2">

          <div class="body" style="height: 230px;">
            <div class="headTitle"> 述</div>

            <div class="flex">
              <div  class="wid50 center">
                <div class="black num-box">
                  <span  style="cursor: pointer;">0</span>
                </div>
                <div class="num-des-box">
                  <span data-v-432a8bfe="" style="cursor: pointer;">待审核</span>
                </div>
              </div>
              <div  class="wid50 center">
                <div class="blue num-box">
                  <span  style="cursor: pointer;">5</span>
                </div>
                <div  class="num-des-box">
                  <span  style="cursor: pointer;">可用BOM</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="13">
      <el-col :span="16">
        <el-card class="card-item-row3">

          <div class="body" style="width: 100%;height: 450px">
            <div class="headTitle">近30天交易数据</div>
            <el-row style="margin: 20px auto 10px auto; ">
              <el-col :span="5">
                <el-radio-group v-model="recent30MoneyData.orderType"  >
                  <el-radio-button label="purchase" value="purchase"   @change="showSalesAndPurchase30DayAnalysis">采购订单</el-radio-button>
                  <el-radio-button label="sales" value="sales"  @change="showSalesAndPurchase30DayAnalysis" >销售订单</el-radio-button>
                 </el-radio-group>
              </el-col>
              <el-col :span="4">
                <el-date-picker
                    v-model="recent30MoneyData.dateRange"
                    type="daterange"
                    unlink-panels
                    range-separator="To"
                    start-placeholder="Start"
                    end-placeholder="End"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    style="width:240px;height: 31px"
                    @change="showSalesAndPurchase30DayAnalysis"
                />
                </el-col>
            </el-row>
            <div id="transactionStatistic" style="width: 100%;height: 90%"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card-item-row3">
          <div class="body" style="width: 100%;height: 500px">
            <el-row style="margin-bottom: 5px;justify-content: space-between;">
              <el-col :span="18">
                <el-radio-group v-model="numberChartsData.orderType"  >
                  <el-radio-button label="purchase" value="purchase"  @change="queryNumberChartsStatic">采购分析</el-radio-button>
                  <el-radio-button label="sales" value="sales"  @change="queryNumberChartsStatic">销售分析</el-radio-button>
                  <el-radio-button label="produce" value="produce"  @change="queryNumberChartsStatic">生产分析</el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col :span="6">
                <el-tree-select
                    v-model="numberChartsData.warehouseId"
                    :data="warehouseOptions"
                    :props="{ value: 'id', label: 'label', children: 'children' }"
                    value-key="id"
                    placeholder="所有仓库"
                    @change="queryNumberChartsStatic"
                />
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="10">
                <el-date-picker
                    v-model="numberChartsData.dateRange"
                    type="daterange"
                    unlink-panels
                    range-separator="To"
                    start-placeholder="Start"
                    end-placeholder="End"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    style="width:250px;height: 25px"
                    @change="queryNumberChartsStatic"
                />
              </el-col>
              <el-col :span="12">
                <el-select v-model="selectedChartType" placeholder="切换图表类型" style="width: 125px;margin-left: 67%">
                  <el-option label="柱状图" value="bar" @click="toggleChartType"></el-option>
                  <el-option label="折线图" value="line" @click="toggleChartType"></el-option>
                </el-select>
              </el-col>
            </el-row>

            <div id="numberStatistic" style="width: 105%;height: 98%"></div>
          </div>
        </el-card>
      </el-col>

    </el-row>






  </div>
</template>

 <script   setup name="Index" >
import {ref} from "vue";
import * as echarts from 'echarts';


import {warehouseParentTreeSelect} from "../api/erp/position";
import {
  getAllModulePreview,
  getSalesAndPurchase30DayAnalysis, getSalesAndPurchaseAndProduceAnalysis,
  getSalesAndPurchaseAndProduceStatistics
} from "../api/erp/statistic";
 const warehouseOptions = ref([]);
const staticTableLoading = ref(true)

const data = reactive({
  form: {
    createTime: "",
  },
  numberStaticParam:{
    warehouseId: null,
    orderType: "purchase",
    dateRange:  [],
    staticList:[
      {productName:"电阻1",number:"200"},  {productName:"电阻2",number:"200"},  {productName:"电阻5",number:"200"},
      {productName:"电阻3",number:"200"}, {productName:"电阻4",number:"200"}, {productName:"电阻6",number:"200"}, {productName:"电阻7",number:"200"}
    ]
  },
  numberChartsData:{
    warehouseId: null,
    orderType: "purchase",
    dateRange:  [],
    numberChartsX: ['点1', '击1', '柱2', '子3',  '柱3', '子3' ],
    numberChartsY: [220, 182, 691, 234,100,200],
  },

  summaryData:{
    orderMoneySum: [],
    allTimes : [],
    bomWaitAuditCount: 1,
    allBomCount:5,

    produceWaitAuditCount:2,
    produceProcessCount:3,
    produceWaitAddStockCount:4,

    demandWaitAuditCount:1,
    purchaseWaitAuditCount: 4,
    purchaseWaitAddStockCount: 6,

    salesWaitAuditCount:0,
    salesWaitOutStockCount:3,
    salesAlreadyOutStockCount:4,

    outStockWaitAuditCount:3,
    addStockWaitAuditCount:7
  },
  
  recent30MoneyData:{
    orderType:"purchase",
    dateRange: [],
   }
});
const { form,numberStaticParam,summaryData,numberChartsData,recent30MoneyData} = toRefs(data);


const selectedChartType = ref("")

 const purchaseDataChart = ref(null)
const salesPurchaseDataChart = ref(null)

// 在组件挂载后初始化图表
onMounted(() => {
  recentPurchase()
  queryNumberStatic()
  queryNumberChartsStatic()
  recent30MoneyData.value.dateRange = recentRange();

  showSalesAndPurchase30DayAnalysis()
});

window.addEventListener('resize', function() {
  // purchaseDataChart.value.resize();
  // salesPurchaseDataChart.value.resize();
});


function getNumberStaticLabel(label){
  if(label === "purchase"){
    return "采购数量"
  }else if(label === "sales"){
    return "销售数量"
  }else if(label === "produce"){
    return "生产数量"
  }

}
/** 近30天时间 */
function recentRange() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  const dateRange = [thirtyDaysAgo.toISOString().slice(0, 10),now.toISOString().slice(0, 10)];
  return dateRange;
}

/** 查询数据分析*/
function queryNumberStatic(){
  // console.log(numberStaticParam.value)
  staticTableLoading.value = true
  // 延迟0.5秒执行
  setTimeout(() => {
    // 在这里写需要延迟执行的代码
   }, 5000);
  getSalesAndPurchaseAndProduceStatistics(numberStaticParam.value).then(response =>{

    numberStaticParam.value.staticList = response.data;
    staticTableLoading.value = false

  })
}
/** 查询图表数据分析*/
function queryNumberChartsStatic(){
   // staticTableLoading.value = true
  // 延迟0.5秒执行
  setTimeout(() => {
    // 在这里写需要延迟执行的代码
  }, 5000);
  getSalesAndPurchaseAndProduceAnalysis(numberChartsData.value).then(response =>{

    numberChartsData.value.numberCharsY = response.data.orderMoneySum
    numberChartsData.value.numberChartsX = response.data.allTime
    recentPurchase()
  })
}
/** 模块预览*/
function showSummaryData(){
  getAllModulePreview().then(response =>{
    summaryData.value = response.data
  })
}
/** 30天金额分析 采购销售*/
function showSalesAndPurchase30DayAnalysis(type){
  // summaryData.value.orderMoneySum = []
  // summaryData.value.allTimes = []
  getSalesAndPurchase30DayAnalysis(recent30MoneyData.value).then(response =>{
    console.log(response.data)
    summaryData.value.orderMoneySum = response.data.orderMoneySum
    summaryData.value.allTimes = response.data.allTime
    salesAndPurchase30Day()
  })

}


/** 查询仓库下拉树结构 */
function getWarehouseTree() {
  warehouseParentTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};
function salesAndPurchase30Day() {
  // 初始化图表
  salesPurchaseDataChart.value = echarts.init(document.getElementById('transactionStatistic'));

  const option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: summaryData.value.allTimes
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 元' // 设置y轴单位为元
      }
    },
        tooltip: {
          axisPointer: {
            type: "cross", // 指示器类型（'line' 直线指示器；'shadow' 阴影指示器；'none' 无指示器；'cross' 十字准星指示器。）
            snap: true, // 坐标轴指示器是否自动吸附到点上。默认自动判断。
          },
          showContent: true, // 是否显示提示框浮层，默认显示
          alwaysShowContent: false, // 是否永远显示提示框内容，默认情况下在移出可触发提示框区域后一定时间后隐藏
          triggerOn: "mousemove", // 提示框触发的条件（'mousemove'，鼠标移动时触发；'click'，鼠标点击时触发；'mousemove|click'，同时鼠标移动和点击时触发；'none'，不在 'mousemove' 或 'click' 时触发）
          confine: true, // 是否将 tooltip 框限制在图表的区域内
          backgroundColor: "rgba(255,255,255)", // 提示框浮层的背景颜色
          padding: 15, // 提示框浮层内边距，单位px
          position: function (pos, params, dom, rect, size) {
            // 将提示框放置在节点的右侧
            return [pos[0] + 10, pos[1] - 10];
          },
          textStyle: {
            color: "#347d3b", // 文字的颜色
            fontSize: 16,
            fontStyle: "normal", // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体）
            fontWeight: "normal", // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
          },
          formatter: function (params) {
            // params.name是x轴的值，params.value是y轴的值
            return '日期: ' + params.name + '<br/>金额: ' + params.value + ' 元';
          },
        },

    series: [
      {
        data: summaryData.value.orderMoneySum,
        type: 'line',
        smooth: true,
        areaStyle: {
          color: '#7cb0e0'
        },
        label: {
          show: function (params) {
            // 只在当前点的y值不为0或者前一个点的y值不为0时显示标签
            const yValue = summaryData.value.orderMoneySum[params.dataIndex];
            return yValue !== 0 && (params.dataIndex === 0 || summaryData.value.orderMoneySum[params.dataIndex - 1] !== 0);
          },
          position: 'top', // 标签位置，可以根据需要调整
          fontSize: 10, // 标签字体大小
          color: '#4d504d', // 标签文字颜色
        },
      }
    ]


  };
  // 使用配置项渲染图表
  salesPurchaseDataChart.value.setOption(option);
}

let chartsTitle = ""
let chartsDesc = ""
function getNumberChartsText(){
  if(numberChartsData.value.orderType === "purchase"){
    chartsTitle = "采购分析";
    chartsDesc = "采购商品数据分析"
  }else if(numberChartsData.value.orderType === "sales"){
    chartsTitle = "销售分析";
    chartsDesc = "销售商品数据分析"
  }else if(numberChartsData.value.orderType === "produce"){
    chartsTitle = "生产分析";
    chartsDesc = "生产商品数据分析"
  }
}
//近30天采购商品数量
function recentPurchase(){
  // 初始化图表
  purchaseDataChart.value = echarts.init(document.getElementById('numberStatistic'));
  getNumberChartsText()
  const option = {
    title: {
      text: chartsTitle,
      subtext: chartsDesc
    },

    tooltip: {
      axisPointer: {
        type: selectedChartType.value === 'line' ? 'cross' : 'line', // 根据图表类型动态设置 axisPointer
        snap: true, // 坐标轴指示器是否自动吸附到点上。默认自动判断。
      },
      showContent: true, // 是否显示提示框浮层，默认显示
      alwaysShowContent: false, // 是否永远显示提示框内容，默认情况下在移出可触发提示框区域后一定时间后隐藏
      triggerOn: "mousemove", // 提示框触发的条件（'mousemove'，鼠标移动时触发；'click'，鼠标点击时触发；'mousemove|click'，同时鼠标移动和点击时触发；'none'，不在 'mousemove' 或 'click' 时触发）
      confine: true, // 是否将 tooltip 框限制在图表的区域内
      backgroundColor: "rgba(255,255,255)", // 提示框浮层的背景颜色
      padding: 15, // 提示框浮层内边距，单位px
      position: "left",
      textStyle: {
        color: "#68c1c4", // 文字的颜色
        fontSize: 16,
        fontStyle: "normal", // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体）
        fontWeight: "normal", // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
      },
      formatter: function (params) {
        // params.name是x轴的值，params.value是y轴的值
        return '商品: ' + params.name + '<br/>数量: ' + params.value + ' 个';
      },
    },
    xAxis: {
      data: numberChartsData.value.numberChartsX,
      axisLabel: {
        inside: false, // 设置为 false，使轴标签显示在轴外侧
        color: '#333' // 设置标签文字颜色
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999'
      }
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      {
        type: 'bar', // 将图表类型改为折线图
        label: {
          show: true, // 显示标签
          position: 'top', // 标签位置，可以根据需要调整
          formatter: '{c}', // 标签内容格式，显示 y 值
          fontSize: 10, // 标签字体大小
          color: '#4d504d', // 标签文字颜色
        },
        lineStyle: {
          color: '#83bff6', // 折线颜色
        },
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     { offset: 0, color: '#83bff6' },
        //     { offset: 0.5, color: 'rgba(24,141,240,0.92)' },
        //     { offset: 1, color: '#3a9def' }
        //   ]),
        // },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#67C23A' },
              { offset: 0.7, color: '#67C23A' },
              { offset: 1, color: '#67C23A' }
            ])
          }
        },
        data: numberChartsData.value.numberChartsY,
      }
    ]

  };

  // 使用配置项渲染图表
  purchaseDataChart.value.setOption(option);
}
/** 切换图表类型*/
const toggleChartType = () => {
  // chartType.value = chartType.value === 'bar' ? 'line' : 'bar';
  console.log(selectedChartType.value)

  getNumberChartsText()
  updateEndChart(selectedChartType.value);
};
// 更新图表
const updateEndChart = (type) => {
  purchaseDataChart.value = echarts.init(document.getElementById('numberStatistic'));

  const option = {
    title: {
      text: '采购分析',
      subtext: '近3月采购商品数量统计'
    },
    tooltip: {
      axisPointer: {
        type: selectedChartType.value === 'line' ? 'cross' : 'line', // 根据图表类型动态设置 axisPointer
      },
      showContent: true, // 在坐标轴上也显示 Tooltip 内容
    },
    xAxis: {
      data: numberChartsData.value.numberChartsX,
      axisLabel: {
        inside: false, // 设置为 false，使轴标签显示在轴外侧
        color: '#333' // 设置标签文字颜色
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999'
      }
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      {
        type: type, // 将图表类型改为折线图
        label: {
          show: true, // 显示标签
          position: 'top', // 标签位置，可以根据需要调整
          formatter: '{c}', // 标签内容格式，显示 y 值
          fontSize: 10, // 标签字体大小
          color: '#4d504d', // 标签文字颜色
        },
        lineStyle: {
          color: '#83bff6', // 折线颜色
        },
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     { offset: 0, color: '#83bff6' },
        //     { offset: 0.5, color: '#188df0' },
        //     { offset: 1, color: '#188df0' }
        //   ]),
        // },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#67C23A' },
              { offset: 0.7, color: '#67C23A' },
              { offset: 1, color: '#67C23A' }
            ])
          }
        },
        data: numberChartsData.value.numberChartsY,
      }
    ]
  };

  // 使用配置项渲染图表
  purchaseDataChart.value.setOption(option);
};



getWarehouseTree();
showSummaryData()
  </script>



<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {

  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .card-item {
   margin-bottom: 13px;
    height: 395px;
  }
  .card-item-row2 {
    margin-bottom: 13px;
    height: 280px;
  }
  .card-item-row3 {
    margin-bottom: 13px;
    height: 531px;
  }


}
.headTitle{
  font-weight: 700;
  font-size: 23px;
  margin-bottom: 15px;
}

.flex{
  display: flex;
  height: 85%;
  -webkit-box-align: center;
   align-items: center;
}
.center{
  text-align: center;
}
.wid50{
  width: 50%;
}
.wid25{
  width: 25%;
}
.black{
  color: #000;
}
.red {
  color: red;
}
.blue{
  color: #06c;
}
.num-box{
  font-size: 30px;
  font-weight: 700;
}
.num-des-box{
  font-weight: 700;
  font-size: 15px;
}

.block-flowchart .panel-body {padding: 0 30px 0 20px;}
.flow-item {float: left; width: 19.2%; max-width: 200px; text-align: center; margin-bottom: 9px; padding-right: 10px;}
.flow-item > div {position: relative; padding: 5px 0 8px 6px; line-height: 20px; background: #E8EBEF; white-space:nowrap; overflow: visible; color: #3c4353}
.flow-item > div:before, .flow-item > div:after {content: ' '; display: block; width: 0; height: 0; border-style: solid; border-width: 15px 0 15px 10px; border-color: transparent transparent transparent #E8EBEF; position: absolute; left: 0; top: 0;}
.ie-8 .flow-item > div:before {display: none}
.flow-item > div:before {border-left-color: #fff; z-index: 1}
.flow-item > div:after {left: auto; right: -10px; z-index: 2}
.ie-8 .flow-item > div {margin-right: 15px}
.flow-item-0 > div {color: #838A9D; font-weight: bold; padding-left: 0;}
.flow-item-0 > div:before {display: none}
.flow-item-1 > div {background: #E3F2FD}
.flow-item-1 > div:after {border-left-color: #E3F2FD}
.flow-item-2 > div {background: #E8F5E9}
.flow-item-2 > div:after {border-left-color: #E8F5E9}
.flow-item-3 > div {background: #FFF3E0}
.flow-item-3 > div:after {border-left-color: #FFF3E0}
.flow-item-4 > div {background: #FFEBEE}
.flow-item-4 > div:after {border-left-color: #FFEBEE}
.flow-item-5 > div {background: #F3E5F5}
.flow-item-5 > div:after {border-left-color: #F3E5F5}
.flow-item-1 > div:hover {background: #1565C0; color: #fff;}
.flow-item-1 > div:hover:after {border-left-color: #1565C0}
.flow-item-2 > div:hover {background: #43A047; color: #fff;}
.flow-item-2 > div:hover:after {border-left-color: #43A047}
.flow-item-3 > div:hover {background: #EF6C00; color: #fff;}
.flow-item-3 > div:hover:after {border-left-color: #EF6C00}
.flow-item-4 > div:hover {background: #E53935; color: #fff;}
.flow-item-4 > div:hover:after {border-left-color: #E53935}
.flow-item-5 > div:hover {background: #9C27B0; color: #fff;}
.flow-item-5 > div:hover:after {border-left-color: #9C27B0}

.block-sm .flow-item {padding-right: 8px}
.block-sm .flow-item > div:before, .block-sm .flow-item > div:after {border-width: 20px 0 15px 6px;}
.block-sm .row-3 .flow-item-1, .block-sm .row-3 .flow-item-3 {width: 30%}
.block-sm .flow-item > div:after {right: -6px;}


</style>

