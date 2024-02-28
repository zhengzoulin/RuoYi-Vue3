<template>
  <div class="app-container">
   <el-row>
     <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" class="custom-form">
         <el-form-item   v-show="showQuery">
           <el-input
               v-model="queryParams.keyWord"
               placeholder="请输入关键字"
               clearable
               @keyup.enter="handleQuery"
           />
         </el-form-item>
        <el-form-item label="bom编号" prop="bomCode" v-show="!showQuery">
          <el-input
              v-model="queryParams.bomCode"
              placeholder="请输入bom编号"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="bom单名称" prop="bomName" v-show="!showQuery">
          <el-input
              v-model="queryParams.bomName"
              placeholder="请输入bom单名称"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="成品编号/名称" prop="bomProductJson" v-show="!showQuery">
          <el-input
              v-model="queryParams.bomProductJson"
              placeholder="请输入成品编号或名称"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
       <el-form-item label="材料编号/名称" prop="bomMaterialJson" v-show="!showQuery">
         <el-input
             v-model="queryParams.bomMaterialJson"
             placeholder="请输入原材料编号或名称"
             clearable
             @keyup.enter="handleQuery"
         />
       </el-form-item>
       <el-form-item label="品牌名称" prop="bomProductJson" v-show="!showQuery">
         <el-input
             v-model="queryParams.bomProductBrand"
             placeholder="请输入品牌名称"
             clearable
             @keyup.enter="handleQuery"
         />
       </el-form-item>
       <el-form-item label="审核状态" prop="auditId" v-if="!showQuery">
         <el-select
             v-model="queryParams.auditId"
             placeholder="请选择审核状态"
             clearable
             style="width: 172px"
         >
           <el-option label="未审核" value="0"></el-option>
           <el-option label="审核通过" value="1"></el-option>
           <el-option label="审核未通过" value="2"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="制单人" prop="createBy" v-if="!showQuery">
         <el-select v-model="queryParams.createBy"  placeholder="请选择"  style="width: 170px">
           <el-option
               v-for="item in userOptions"
               :key="item.userId"
               :label="item.userName"
               :value="item.userId"
               :disabled="item.status == 1"

           ></el-option>
         </el-select>
       </el-form-item>


       <el-form-item>
         <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
         <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         <el-button class="el-button--text" @click="changeQuery"><span>切换高级搜素</span></el-button>
       </el-form-item>
     </el-form>
   </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['erp:bom:add']"
        >新增BOM表</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:bom:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown class="el-dropdown-order" trigger="click"  @command="handleAuditCommand">
          <el-button type="primary" :disabled="auditDisabled"  style="width: 90px;">
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
          v-hasPermi="['erp:bom:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['erp:bom:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="bom编号" align="center" width="120" prop="bomCode">
        <template #default="scope">
          <!-- 使用 <a> 标签来包装数据，并添加样式 -->
          <a
              href="#"
              style="color: rgba(40,177,232,0.83); text-decoration: underline; font-size: 12px"
              @click="handleBomDetailClick(scope.row)"
          >
            {{ scope.row.bomCode }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="成品编号" align="center" prop="productForm.productCode" />
      <el-table-column label="成品商品" align="center" prop="productForm.productName" />
      <el-table-column label="厂家型号" align="center" prop="productForm.productModel" />
      <el-table-column label="封装规格" align="center" prop="productForm.encapStandard" />
      <el-table-column label="品牌名称" align="center" prop="productForm.brand.brandName" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="审核状态" align="center" prop="auditId">
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
                    @mouseover="showAuditTooltip(scope.row)"> {{ AuditStatus(scope.row.auditId) }} </el-tag>
          </el-tooltip>

        </template>
      </el-table-column>
      <el-table-column label="bom状态" align="center" prop="status" />
      <el-table-column label="单据名称" align="center" prop="bomName" />
      <el-table-column label="bom总金额" align="center" prop="bomCostPrice" />


    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改bom物料对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bomRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="bom编号" prop="bomCode">
          <el-input v-model="form.bomCode" placeholder="请输入bom编号" />
        </el-form-item>
        <el-form-item label="bom单名称" prop="bomName">
          <el-input v-model="form.bomName" placeholder="请输入bom单名称" />
        </el-form-item>
        <el-form-item label="成品编号" prop="bomProductId">
          <el-input v-model="form.bomProductId" placeholder="请输入成品编号" />
        </el-form-item>
        <el-form-item label="成品json" prop="bomProductJson">
          <el-input v-model="form.bomProductJson" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="bom单成本" prop="bomCostPrice">
          <el-input v-model="form.bomCostPrice" placeholder="请输入bom单成本" />
        </el-form-item>

        <el-form-item label="所属仓库" prop="warehouseIds">
          <el-input v-model="form.warehouseIds" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="库存备注" prop="remark">
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

    <AuditDialog
        :auditAddDTO="auditAddDTO"
        :openAudit = "openAudit"
        :AuditTitle="AuditTitle"
        @submitOrderAudit="submitAudit"
    />
  </div>
</template>

<script setup name="Bom">
import { listBom, getBom, delBom, addBom, updateBom,addAudit } from "@/api/erp/bom";
import {useRouter} from "vue-router";
import AuditDialog from "../../../components/zerp/public/auditDialog";

import {ref} from "vue";
import {getAuditRecord} from "../../../api/erp/bom";
import path from "path";
import {listUser} from "../../../api/system/user";

const { proxy } = getCurrentInstance();
const router = useRouter();

const bomList = ref([]);
const open = ref(false);
const openAudit = ref(false);

const showQuery = ref(true);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const auditDisabled = ref(true);

const total = ref(0);
const title = ref("");
const AuditTitle = ref("");
const tooltipAuditContent = ref({})
const auditAddDTO = ref({})
const userOptions =  ref([])


const data = reactive({
  form: {},
  queryParams: {
    keyWord: null,
    pageNum: 1,
    pageSize: 10,
    bomCode: null,
    bomName: null,
    bomProductId: null,
    bomProductJson: null,
    bomCostPrice: null,
    bomMaterial: null,
    warehouseIds: null,
    status: null,
  },
  rules: {
    bomCode: [
      { required: true, message: "bom编号不能为空", trigger: "blur" }
    ],
    bomProductId: [
      { required: true, message: "成品编号不能为空", trigger: "blur" }
    ],
    bomProductJson: [
      { required: true, message: "成品json不能为空", trigger: "blur" }
    ],
    bomCostPrice: [
      { required: true, message: "bom单成本不能为空", trigger: "blur" }
    ],
    bomMaterial: [
      { required: true, message: "bom用料信息json不能为空", trigger: "blur" }
    ],
    warehouseIds: [
      { required: true, message: "所属仓库不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询bom物料列表 */
function getList() {
  loading.value = true;
  listBom(queryParams.value).then(response => {
    bomList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 查询user列表 */
function getUserList() {
  listUser().then(response => {
    userOptions.value = response.rows;
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
    bomId: null,
    bomCode: null,
    bomName: null,
    bomProductId: null,
    bomProductJson: null,
    bomCostPrice: null,
    bomMaterial: null,
    warehouseIds: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("bomRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
   queryParams.value = {}
  handleQuery();
}
function changeQuery(){
  showQuery.value = !showQuery.value;
  queryParams.value = {}
  proxy.resetForm("queryRef");
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.bomId);
  multiple.value = !selection.length;
  if(selection.length ==  1){
    const auditId = selection.map(item => item.auditId)
    if(auditId == 0){
      auditDisabled.value = false;
      single.value = false;
    }else{
      auditDisabled.value = true;
      single.value = true
    }
  }else{
    auditDisabled.value = true;
    single.value = true
   }
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  // open.value = true;
  title.value = "添加bom物料";

  router.push("/bom/addBom");
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _bomId = row.bomId || ids.value

  router.push({
      path:'/bom/addBom',
      query:{bomId : _bomId}
  });
  console.log("sss"+_bomId)
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["bomRef"].validate(valid => {
    if (valid) {
      if (form.value.bomId != null) {
        updateBom(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBom(form.value).then(response => {
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
  const _bomIds = row.bomId || ids.value;
  proxy.$modal.confirm('是否确认删除bom物料编号为"' + _bomIds + '"的数据项？').then(function() {
    return delBom(_bomIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/bom/export', {
    ...queryParams.value
  }, `bom_${new Date().getTime()}.xlsx`)
}
/** 审核记录 */
const showAuditTooltip = (row) => {
  // 生成tooltip的内容，可以根据rowData的信息来设置tooltip内容
  if(row.auditId == 0){
    return;
  }
  getAuditRecord(row.bomId).then(response=>{
    tooltipAuditContent.value= response.data

    tooltipAuditContent.value = '审核人: '+tooltipAuditContent.value.userName +
        '  审核时间:'+ tooltipAuditContent.value.createTime +
        '  备注:'+tooltipAuditContent.value.auditRemark;

    console.log(tooltipAuditContent.value)
  })
};
//状态显示
function AuditStatus(auditId) {
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

//提交审核
function submitAudit(data){
  auditAddDTO.value = data
  addAudit(auditAddDTO.value).then(response => {
    proxy.$modal.msgSuccess("审核成功");
    getList();
  })
  openAudit.value = false;
  title.value = ""
}

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

 function handleBomDetailClick(row){

   router.push({
     path:'/bom/bomDetail',
     query:{bomId : row.bomId}
   });
 }

getUserList();
getList();
</script>


<style>
.custom-form .el-form-item {
  margin-bottom: 14px; /* 调整表单项之间的间距 */
  padding-right: 8px;
}

.custom-form .el-form-item .el-input {
  font-size: 12px; /* 调整输入框中的字体大小 */
}

.custom-form .el-button {
  font-size: 12px; /* 调整按钮中的字体大小 */
  padding-top: 6px; /* 调整按钮的内边距 */
  padding-bottom: 6px; /* 调整按钮的内边距 */
 }
.custom-form .el-form-item .el-form-item__label {
  max-width: 100px; /* 设置 label 的最大宽度 */
  /*overflow: hidden;*/
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 不换行 */
}
.custom-form .el-button:last-child {
  margin-right: 0; /* 最后一个按钮不需要右边距 */
}
</style>