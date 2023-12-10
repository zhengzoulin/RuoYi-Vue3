<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="批次编号" prop="batchCode">
        <el-input
            v-model="queryParams.batchCode"
            placeholder="请输入批次编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次名称" prop="batchName">
        <el-input
            v-model="queryParams.batchName"
            placeholder="请输入批次名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属仓库" prop="warehouseId">
        <el-input
            v-model="queryParams.warehouseId"
            placeholder="请输入所属仓库"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次有效期" prop="batchValidTime">
        <el-input
            v-model="queryParams.batchValidTime"
            placeholder="请输入批次有效期"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次数量" prop="batchNumber">
        <el-input
            v-model="queryParams.batchNumber"
            placeholder="请输入批次数量"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次总额" prop="batchTotal">
        <el-input
            v-model="queryParams.batchTotal"
            placeholder="请输入批次总额"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['erp:batch:add']"
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
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['erp:batch:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="batchList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="批次id" align="center" prop="batchId" />
      <el-table-column label="批次编号" align="center" prop="batchCode" />
      <el-table-column label="批次名称" align="center" prop="batchName" />
      <el-table-column label="所属仓库" align="center" prop="warehouseId" />
      <el-table-column label="批次有效期" align="center" prop="batchValidTime" />
      <el-table-column label="批次数量" align="center" prop="batchNumber" />
      <el-table-column label="批次总额" align="center" prop="batchTotal" />
      <el-table-column label="批次状态" align="center" prop="batchStatus" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:batch:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:batch:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改入库批次对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="batchRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="批次编号" prop="batchCode">
          <el-input v-model="form.batchCode" placeholder="请输入批次编号" />
        </el-form-item>
        <el-form-item label="批次名称" prop="batchName">
          <el-input v-model="form.batchName" placeholder="请输入批次名称" />
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入所属仓库" />
        </el-form-item>
        <el-form-item label="批次有效期" prop="batchValidTime">
          <el-input v-model="form.batchValidTime" placeholder="请输入批次有效期" />
        </el-form-item>
        <el-form-item label="批次数量" prop="batchNumber">
          <el-input v-model="form.batchNumber" placeholder="请输入批次数量" />
        </el-form-item>
        <el-form-item label="批次总额" prop="batchTotal">
          <el-input v-model="form.batchTotal" placeholder="请输入批次总额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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
    warehouseId: null,
    batchValidTime: null,
    batchNumber: null,
    batchTotal: null,
    batchStatus: null,
  },
  rules: {
    batchCode: [
      { required: true, message: "批次编号不能为空", trigger: "blur" }
    ],
    batchName: [
      { required: true, message: "批次名称不能为空", trigger: "blur" }
    ],
    warehouseId: [
      { required: true, message: "所属仓库不能为空", trigger: "blur" }
    ],
    batchValidTime: [
      { required: true, message: "批次有效期不能为空", trigger: "blur" }
    ],
    batchNumber: [
      { required: true, message: "批次数量不能为空", trigger: "blur" }
    ],
    batchTotal: [
      { required: true, message: "批次总额不能为空", trigger: "blur" }
    ],
    batchStatus: [
      { required: true, message: "批次状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询入库批次列表 */
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
    warehouseId: null,
    batchValidTime: null,
    batchNumber: null,
    batchTotal: null,
    batchStatus: null,
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
  title.value = "添加入库批次";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _batchId = row.batchId || ids.value
  getBatch(_batchId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改入库批次";
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
  proxy.$modal.confirm('是否确认删除入库批次编号为"' + _batchIds + '"的数据项？').then(function() {
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
