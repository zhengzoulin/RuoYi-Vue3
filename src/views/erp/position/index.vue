<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="切换仓库" prop="warehouseId">
        <el-tree-select
            v-model="queryParams.warehouseId"
            :data="warehouseOptions"
            :props="{ value: 'id', label: 'label', children: 'children' }"
            value-key="id"
            placeholder="请选择仓库"
            check-strictly
        />
      </el-form-item>
      <el-form-item label="所属货架" prop="storageRackCode">
        <el-input
            v-model="queryParams.storageRackCode"
            placeholder="请输入所属货架"
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
            v-hasPermi="['erp:position:add']"
        >新增库位</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['erp:position:edit']"
        >修改库位</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['erp:position:remove']"
        >删除库位</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['erp:position:export']"
        >导出库位</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleImport"
            v-hasPermi="['erp:position:importExcel']"
        >导入库位</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
<!--    当前展示的为【默认父仓 - 成品仓】的库位数据-->
    <el-row >
      <el-col :span="8">当前展示的为: [  <span class="current-house">{{currentHouse.warehousePath}}</span>  ] 的库位数据</el-col>

    </el-row>

    <el-table v-loading="loading" :data="positionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="库位名称" align="center" prop="stockPositionName" />
      <el-table-column label="所属货架" align="center" prop="storageRackCode" />
      <el-table-column label="存在商品数" align="center" prop="" />

      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <el-tag :type="scope.row.status == '0' ?'success':'warning'"> {{ formatStatus(scope.row.status) }} </el-tag>
        </template>
      </el-table-column>      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:position:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:position:remove']">删除</el-button>
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

    <!-- 添加或修改库位管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="positionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="库位名称" prop="stockPositionName">
          <el-input v-model="form.stockPositionName" placeholder="请输入库位名称" />
        </el-form-item>
        <el-form-item label="选择子仓库" prop="warehouseId">
          <el-tree-select
              v-model="form.warehouseId"
              :data="warehouseOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="isd"
              placeholder="请选择仓库"
              check-strictly
          />
        </el-form-item>
        <el-form-item label="所属货架" prop="storageRackCode">
          <el-input v-model="form.storageRackCode" placeholder="请输入所属货架" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-switch @change="handleSwitchChange"
                   style="display: block"
                   v-model="form.status"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   active-value="0"
                   inactive-value="1"
                   active-text="启用"
                   inactive-text="停用">
        </el-switch>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 库位导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Position">
import { listPosition, getPosition, delPosition, addPosition, updatePosition } from "@/api/erp/position";
import {getWarehouse, warehouseTreeSelect} from "../../../api/erp/position";
import {getCurrentInstance, ref,reactive} from "vue";
import {getToken} from "../../../utils/auth";

const { proxy } = getCurrentInstance();

const positionList = ref([]);
const warehouseOptions = ref(undefined);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const currentHouse = ref({
  warehousePath:""
});
/*** 库位导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的库位数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/erp/position/importData"
});


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    stockPositionName: "",
    warehouseId: null,
    storageRackCode: null,
    stockStatus: null,
  },
  rules: {
    stockPositionCode: [
      { required: true, message: "库位编号不能为空", trigger: "blur" }
    ],
    stockPositionName: [
      { required: true, message: "库位名称不能为空", trigger: "blur" }
    ],
    warehouseId: [
      { required: true, message: "所属仓库id不能为空", trigger: "blur" }
    ],
    storageRackCode: [
      { required: true, message: "所属货架不能为空", trigger: "blur" }
    ],
    stockStatus: [
      { required: true, message: "库位状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询库位管理列表 */
function getList() {
  loading.value = true;
  listPosition(queryParams.value).then(response => {
    positionList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 查询仓库下拉树结构 */
function getWarehouseTree() {
  warehouseTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    stockPositionId: null,
    stockPositionCode: null,
    stockPositionName: null,
    storageRackCode: null,
    stockStatus: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("positionRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
  getCurrentHouse();

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

/** 修改仓库状态 */
function handleSwitchChange(value){
  console.log(value);
  form.status = !form.status;

}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.stockPositionId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  form.value.warehouseId = queryParams.value.warehouseId;
  open.value = true;
  title.value = "添加库位管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _stockPositionId = row.stockPositionId || ids.value
  getPosition(_stockPositionId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改库位管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["positionRef"].validate(valid => {
    if (valid) {
      if (form.value.stockPositionId != null) {
        updatePosition(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPosition(form.value).then(response => {
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
  const _stockPositionIds = row.stockPositionId || ids.value;
  proxy.$modal.confirm('是否确认删除库位管理编号为"' + _stockPositionIds + '"的数据项？').then(function() {
    return delPosition(_stockPositionIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/position/export', {
    ...queryParams.value
  }, `position_${new Date().getTime()}.xlsx`)
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "库位导入";
  upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
  const warehouseId = queryParams.value.warehouseId


  proxy.download("erp/position/importTemplate?warehouseId="+warehouseId, {
  }, `position_template_${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};


/** 获取当前仓库*/
function getCurrentHouse(){
  // alert(warehouseOptions.value);
  const _warehouseId = queryParams.value.warehouseId
  getWarehouse(_warehouseId).then(response => {
    currentHouse.value.warehousePath = response.data.warehousePath;
  });
}


queryParams.value.warehouseId=101

getList();
getWarehouseTree();
getCurrentHouse();
</script>

<style scoped>
.current-house {
  color: #FEC171;
  margin: auto;
}

</style>
