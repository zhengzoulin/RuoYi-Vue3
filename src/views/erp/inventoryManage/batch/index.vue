<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" class="custom-form">
      <el-form-item   prop="planCode" v-show="showQuery">
        <el-input
            v-model="queryParams.keyWord"
            placeholder="请输入关键字"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode" v-show="!showQuery">
        <el-input
            v-model="queryParams.batchCode"
            placeholder="请输入批次号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次名称" prop="batchName" v-show="!showQuery">
        <el-input
            v-model="queryParams.batchName"
            placeholder="请输入批次名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品编号" prop="productCode" v-show="!showQuery">
        <el-input
            v-model="queryParams.productCode"
            placeholder="请输入商品编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName" v-show="!showQuery">
        <el-input
            v-model="queryParams.productName"
            placeholder="请输入商品编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次有效期"  v-show="!showQuery">
        <el-date-picker
            v-model="queryParams.timeRange"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            ref="queryRef"
            style="width: 220px;"
        />
      </el-form-item>
      <el-form-item  >
        <el-button type="primary" icon="Search" @click="handleQuery"    >搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery"  >重置</el-button>
        <el-button class="el-button--text" @click="changeQuery"><span>切换高级搜素</span></el-button>

      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['erp:batch:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getBatchLevelList"></right-toolbar>
    </el-row>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="商品信息维度" name="first">
        <el-table v-loading="loading" :data="productLevelList" style="max-height: 214px;" @selection-change="handleSelectionChange" >

          <el-table-column label="序号" type="index" width="55" align="center" />

          <el-table-column label="商品编号" align="center" prop="productCode">
            <template  #default="scope" width="100">
              <button  class="positionButton" >
                <span @click="showProductBatchDetail(scope.row.productCode)">{{scope.row.productCode}}</span>
              </button>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center" prop="productName" />
          <el-table-column label="厂家型号" align="center" prop="productModel" />
          <el-table-column label="封装规格" align="center" prop="encapStandard" />
          <el-table-column label="所属仓库" align="center" prop="warehouseCount" >
            <template  #default="scope"  >
              <button  class="positionButton" >
                <span @click="showProductBatchDetail(scope.row.productCode)">{{scope.row.warehouseCount}}</span>
              </button>
            </template>
          </el-table-column>
          <el-table-column label="批次数" align="center" prop="batchCount" >
            <template  #default="scope"  >
              <button  class="positionButton">
                <span @click="showProductBatchDetail(scope.row.productCode)" >{{scope.row.batchCount}}</span>
              </button>
            </template>
          </el-table-column>

           <el-table-column label="批次商品数量" align="center" prop="productBatchNumber" >
            <template  #default="scope"  >
              <button  class="positionButton" >
                <span @click="showProductBatchDetail(scope.row.productCode)" >
                  {{scope.row.productBatchNumber}}
                </span>
              </button>
            </template>
          </el-table-column>
           <el-table-column label="批次总额" align="center" prop="productBatchTotal">
            <template #default="scope">
              {{ scope.row.productBatchTotal.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="productTotal"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getBatchLevelList"
        />
      </el-tab-pane>
      <el-tab-pane label="批次信息维度" name="second" style="overflow: auto">

        <el-table v-loading="loading" :data="batchLevelList" style="max-height: 500px;overflow: auto" @selection-change="handleSelectionChange" class="batchTable">
          <el-table-column label="序号" type="index" width="55" align="center" />

          <el-table-column label="批次号" align="center" prop="batchCode" />
          <el-table-column label="批次名称" align="center" prop="batchName" width="80" >
            <template #default="scope">
              <el-button link type="primary"  @click="editBatchName"  icon="Edit" class="followButton"> </el-button>

            </template>
          </el-table-column>

          <el-table-column label="商品名称" align="center" prop="productName" />
          <el-table-column label="商品信息" align="center">
            <template #default="scope">
              <span style="display: block;">封装规格:{{ scope.row.productVO.encapStandard }}</span>
              <span style="display: block;">厂家型号:{{ scope.row.productVO.productModel }}</span>

              <span style="display: block;">最小包装数量:{{ scope.row.productVO.minpacketNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="批次有效期" align="center" prop="batch.batchvalidTime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.batch.batchvalidTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属仓库数量" align="center" prop="warehouseNumber">
            <template  #default="scope"  >
              <button  class="positionButton"  >
                <span>{{scope.row.warehouseNumber}}</span>
              </button>
            </template>
          </el-table-column>
          <el-table-column label="批次商品数量" align="center" prop="batchNumber">
            <template  #default="scope"  >
              <button @click="showBatchDetail(scope.row)" class="positionButton">
                <span>{{scope.row.batchNumber}}</span>
              </button>
            </template>
          </el-table-column>
          <el-table-column label="批次总额" align="center" prop="batchTotal">
            <template #default="scope">
              {{ scope.row.batchTotal.toFixed(2) }}
            </template>
          </el-table-column>


        </el-table>
        <pagination
            v-show="total>0"
            :total="batchTotal"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getBatchLevelList"
        />
      </el-tab-pane>
    </el-tabs>


    <el-dialog
        title="商品批次明细" v-model="openBatchDetail"
        append-to-body class="dialog-selectOrder"
    >
      <table :data="form.productVO" class="top-title" style="border: 1px solid rgb(230, 235, 245);">
        <tr >
          <td  class="tex" >
            <div  class="dis">
              商品编号：
              <div   tabindex="0" class="tex-color">{{ form.productVO.productCode}}</div>
            </div>
          </td>
          <td  class="tex">
            <div  class="dis">
              商品名称：
              <div   tabindex="0" class="tex-color">{{ form.productVO.productName}}</div>
            </div>
          </td>
          <td  class="tex">
            <div  class="dis">
              厂家型号：
              <div   tabindex="0" class="tex-color">{{ form.productVO.productModel }} </div>
            </div>
          </td>
          <td  class="tex">
            <div  class="dis">
              封装规格：
              <div   tabindex="0" class="tex-color">{{ form.productVO.encapStandard }}</div></div></td>
          <td  class="tex">
            <div  class="dis">
              封装单位：
              <div  tabindex="0" class="tex-color">{{ form.productVO.minpacketUnit}}</div></div></td>
        </tr></table>

        <el-table
            :data="form.batchProductList"
            height="280px"
            style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px;overflow: auto"
            :span-method="objectSpanMethod"
            class="el-table__header"
        >
          <el-table-column label="关联单据" align="center" prop="associatedCode" />
          <el-table-column label="出入库类型" align="center" prop="addOutType" />
          <el-table-column label="所属位置" align="center" prop="warehousePath" />
          <el-table-column label="变更时间" align="center" prop="createTime" />
          <el-table-column label="变更前数量" align="center" prop="beforeChangeNumber" />
          <el-table-column label="变更数量" align="center" prop="changeNumber">
            <template #default="scope">
              <span style="color:red;font-size: 13px"> {{ scope.row.changeNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="变更后数量" align="center" prop="afterChangeNumber" />
        </el-table>
    </el-dialog>
  </div>


</template>

<script setup>
import { listBatch, getBatch, delBatch, addBatch, updateBatch } from "@/api/erp/batch";
import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router"
import {listBatchLevel, listProductBatch, listProductLevel} from "../../../../api/erp/batch";
const { proxy } = getCurrentInstance();

const batchLevelList = ref([]);
const productLevelList = ref([]);

const open = ref(false);
const openBatchDetail = ref(false);
const showQuery = ref(true);

const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
 const batchTotal = ref(0);
const productTotal = ref(0);
const title = ref("");

const data = reactive({
  form: {
    productVO: ref({}),
    batchProductList: ref([])

  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    batchCode: null,
    batchName: null,
    batchvalidTime: null,
    status: null,
  },
  rules: {

  }
});
const { queryParams, form, rules } = toRefs(data);

const router = useRouter();
const activeName = ref('first')

/** 查询批次列表 */
function getBatchLevelList() {
  loading.value = true;
  // 在此处设置一个定时器，让它运行一段时间后停止
  setTimeout(() => {
    listProductBatch(queryParams.value).then(response=>{
      productLevelList.value = response.rows;
      productTotal.value = response.total;
      loading.value = false;
    })
    listBatchLevel(queryParams.value).then(response => {
      batchLevelList.value = response.rows;
      batchTotal.value = response.total;
      loading.value = false;
    });
   }, 1000);
}


//跳转批次明细
function showProductBatchDetail(productCode){

  queryParams.value = {}
  queryParams.value.productCode = productCode
  batchLevelList.value = []
  getBatchLevelList()

  activeName.value = 'second'
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    batchId: null,
    batchCode: null,
    batchName: null,
    batchvalidTime: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("batchRef");
}



/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getBatchLevelList();
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.value = {}
  handleQuery()
}

function changeQuery(){
  showQuery.value = !showQuery.value;
  queryParams.value = {}
  proxy.resetForm("queryRef");
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.batchId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加批次";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _batchId = row.batchId || ids.value
  getBatch(_batchId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改批次";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["batchRef"].validate(valid => {
    if (valid) {
      if (form.value.batchId != null) {
        updateBatch(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getBatchLevelList();
        });
      } else {
        addBatch(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getBatchLevelList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _batchIds = row.batchId || ids.value;
  proxy.$modal.confirm('是否确认删除批次编号为"' + _batchIds + '"的数据项？').then(function() {
    return delBatch(_batchIds);
  }).then(() => {
    getBatchLevelList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/batch/export', {
    ...queryParams.value
  }, `batch_${new Date().getTime()}.xlsx`)
}

function showBatchDetail(row){
  openBatchDetail.value = true;
  form.value.batchProductList = row.batchProductList;
  form.value.productVO = row.productVO

  console.log( form.value.batchProductList)
}





getBatchLevelList();
</script>

<style>
.demo-tabs > .el-tabs__content {
  /*padding: 10px;*/
  color: #6b778c;
  font-size: 32px;
  font-weight: 500;
  background-color: rgb(255,255,255);
}



.batchTable{

  font-size: 12px;


}


.top-title{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  border: 1px solid #ebeef5;
  padding: 4px 4px;
  margin-bottom: 4px;
  background-color: rgba(176,196,222, 0.2); /* 淡灰色 */

}
.dis{
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 6px;
  margin: 0 16px;
}
.tex-color{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 1000;
}
.tex{
  margin: 5px;
}
.el-table__header{
  table-layout: fixed;
  border-collapse: separate;
}
.positionButton{
  background-color: transparent;
  border: none;
  box-shadow: none;
  cursor: pointer;
}
.positionButton span {
  color: #47b2de;
}
.dialog-selectOrder{
  /*width: 85% ;*/
  margin-top: 80px;
  height: 500px;
  width: 60%;
}



/*.custom-form .el-form-item {*/
/*  margin-bottom: 14px; !* 调整表单项之间的间距 *!*/
/*  padding-right: 10px;*/
/*}*/

/*.custom-form .el-form-item .el-input {*/
/*  font-size: 12px; !* 调整输入框中的字体大小 *!*/
/*}*/

/*.custom-form .el-button {*/
/*  font-size: 12px; !* 调整按钮中的字体大小 *!*/
/*  padding-top: 6px; !* 调整按钮的内边距 *!*/
/*  padding-bottom: 6px; !* 调整按钮的内边距 *!*/
/*}*/
.custom-form .el-form-item .el-form-item__label {
  /*max-width: 100px; !* 设置 label 的最大宽度 *!*/
  /*overflow: hidden;*/
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 不换行 */
}
/*.custom-form .el-button:last-child {*/
/*  margin-right: 0; !* 最后一个按钮不需要右边距 *!*/
/*}*/
</style>
