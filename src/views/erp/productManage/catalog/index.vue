<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="父id" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目录名称" prop="catalogName">
        <el-input
          v-model="queryParams.catalogName"
          placeholder="请输入目录名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目录排序" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入目录排序"
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
          v-hasPermi="['erp:catalog:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Sort"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="catalogList"
      row-key="catalogId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="目录名称" align="center" prop="catalogName" />
      <el-table-column label="存在商品数" align="center" prop="" />

      <el-table-column label="目录状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:catalog:edit']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['erp:catalog:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:catalog:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改商品目录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="catalogRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父目录" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="catalogOptions"
            :props="{ value: 'catalogId', label: 'catalogName', children: 'children' }"
            value-key="catalogId"
            placeholder="请选择父目录"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="目录名称" prop="catalogName">
          <el-input v-model="form.catalogName" placeholder="请输入目录名称" />
        </el-form-item>
        <el-form-item label="目录排序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入目录排序" />
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

<script setup name="Catalog">
import { listCatalog, getCatalog, delCatalog, addCatalog, updateCatalog } from "@/api/erp/catalog";

const { proxy } = getCurrentInstance();

const catalogList = ref([]);
const catalogOptions = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const isExpandAll = ref(true);
const refreshTable = ref(true);

const data = reactive({
  form: {},
  queryParams: {
    parentId: null,
    catalogName: null,
    orderNum: null,
    status: null,
  },
  rules: {
    catalogName: [
      { required: true, message: "目录名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商品目录列表 */
function getList() {
  loading.value = true;
  listCatalog(queryParams.value).then(response => {
    catalogList.value = proxy.handleTree(response.data, "catalogId", "parentId");
    loading.value = false;
  });
}

/** 查询商品目录下拉树结构 */
function getTreeselect() {
  listCatalog().then(response => {
    catalogOptions.value = [];
    const data = { catalogId: 0, catalogName: '顶级节点', children: [] };
    data.children = proxy.handleTree(response.data, "catalogId", "parentId");
    catalogOptions.value.push(data);
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
    catalogId: null,
    parentId: null,
    catalogName: null,
    orderNum: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("catalogRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

function formatStatus(status) {
  if (status === '0') {
    return '已启用'
  } else if (status === '1') {
    return '已停用'
  } else {
    return '错误状态'
  }
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  getTreeselect();
  if (row != null && row.catalogId) {
    form.value.parentId = row.catalogId;
  } else {
    form.value.parentId = 0;
  }
  open.value = true;
  title.value = "添加商品目录";
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  await getTreeselect();
  if (row != null) {
    form.value.parentId = row.parentId;
  }
  getCatalog(row.catalogId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改商品目录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["catalogRef"].validate(valid => {
    if (valid) {
      if (form.value.catalogId != null) {
        updateCatalog(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCatalog(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除商品目录编号为"' + row.catalogId + '"的数据项？').then(function() {
    return delCatalog(row.catalogId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
