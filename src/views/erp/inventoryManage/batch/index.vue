<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" class="smaller-form">
      <el-form-item label="批次号" prop="batchCode" class="smaller-form-item">
        <el-input
            v-model="queryParams.batchCode"
            placeholder="请输入批次号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次名称" prop="batchName" class="smaller-form-item">
        <el-input
            v-model="queryParams.batchName"
            placeholder="请输入批次名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次有效期" prop="batchvalidTime" class="smaller-form-item">
        <el-date-picker clearable
                        v-model="queryParams.batchvalidTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择批次有效期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="smaller-form-item">
        <el-button type="primary" icon="Search" @click="handleQuery"    class="smaller-button">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery"   class="smaller-button">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8 smaller-row">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['erp:batch:add']"
            class="smaller-button"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['erp:batch:edit']"
            class="smaller-button"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['erp:batch:remove']"
            class="smaller-button"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['erp:batch:export']"
            class="smaller-button"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="商品信息维度" name="first">
        <el-table v-loading="loading" :data="batchList" @selection-change="handleSelectionChange" class="">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column type="index" width="55" align="center" />

          <el-table-column label="批次号" align="center" prop="batchCode" />
          <el-table-column label="批次名称" align="center" prop="batchName" />

          <el-table-column label="商品名称" align="center" prop="product" />
          <el-table-column label="商品信息" align="center" prop="productName" />

          <el-table-column label="批次有效期" align="center" prop="batchvalidTime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.batchvalidTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="批次商品数量" align="center" prop="batchNumber" />
          <el-table-column label="批次总额" align="center" prop="batchTotal" />


        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="批次信息维度" name="second">
        <el-table v-loading="loading" :data="batchList" @selection-change="handleSelectionChange" class="">

        <el-table-column label="商品编号" align="center" prop="product" />
        <el-table-column label="商品名称" align="center" prop="productName" />
        <el-table-column label="厂家型号" align="center" prop="productName" />
        <el-table-column label="封装规格" align="center" prop="productName" />

        <el-table-column label="无批次商品数量" align="center" prop="batchCode" />
        <el-table-column label="批次商品数量" align="center" prop="batchName" />
        <el-table-column label="批次总额" align="center" prop="batchName" />
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
      </el-tab-pane>

    </el-tabs>
  </div>


</template>

<script setup name="Batch">
import { listBatch, getBatch, delBatch, addBatch, updateBatch } from "@/api/erp/batch";

const { proxy } = getCurrentInstance();

const batchList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
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
import { ref } from 'vue'

const activeName = ref('first')

const handleClick = (tab, event) => {
  console.log(tab, event)
}

/** 查询批次列表 */
function getList() {
  loading.value = true;
  listBatch(queryParams.value).then(response => {
    batchList.value = response.rows;
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
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
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
          getList();
        });
      } else {
        addBatch(form.value).then(response => {
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
  const _batchIds = row.batchId || ids.value;
  proxy.$modal.confirm('是否确认删除批次编号为"' + _batchIds + '"的数据项？').then(function() {
    return delBatch(_batchIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/batch/export', {
    ...queryParams.value
  }, `batch_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}



/* 调整整个行组件的字体大小 */
.smaller-row {
  font-size: 12px;
}

/* 调整按钮内文本的字体大小 */
.smaller-button {
  font-size: 12px;
}



/* 调整整个表单的大小 */
.smaller-form {
  font-size: 10px; /* 调整表单字体大小 */
}

/* 调整表单内元素的大小 */
.smaller-form-item {
  margin-right: 8px; /* 调整表单元素之间的间距 */
  font-size: 8px; /* 调整表单字体大小 */
}
</style>
