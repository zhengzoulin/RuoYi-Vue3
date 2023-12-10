<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单位名称" prop="unitName">
        <el-input
          v-model="queryParams.unitName"
          placeholder="请输入单位名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="固定电话" prop="unitPhone">
        <el-input
          v-model="queryParams.unitPhone"
          placeholder="请输入单位固定电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位地址" prop="unitAddress">
        <el-input
          v-model="queryParams.unitAddress"
          placeholder="请输入单位地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位邮箱" prop="unitEmail">
        <el-input
          v-model="queryParams.unitEmail"
          placeholder="请输入单位邮箱"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="unitContacts">
        <el-input
          v-model="queryParams.unitContacts"
          placeholder="请输入单位联系人"
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
          v-hasPermi="['erp:unit:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:unit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['erp:unit:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['erp:unit:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="unitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="单位id" align="center" prop="unitId" />-->

      <el-table-column label="单位名称" align="center" prop="unitName" />
      <el-table-column label="单位类别" align="center" prop="unitType" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <el-tag :type="scope.row.status == '0' ?'success':'warning'"> {{ formatStatus(scope.row.status) }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="单位固定电话" align="center" prop="unitPhone" />
      <el-table-column label="单位地址" align="center" prop="unitAddress" />
      <el-table-column label="单位邮箱" align="center" prop="unitEmail" />
      <el-table-column label="单位联系人" align="center" prop="unitContacts" />
      <el-table-column label="单位联系人电话" align="center" prop="unitContactsPhone" />

      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:unit:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:unit:remove']">删除</el-button>
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

    <!-- 添加或修改往来单位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="unitRef" :model="form" :rules="rules" label-width="80px" >
        <el-form-item label="单位名称" prop="unitName">
            <el-input v-model="form.unitName" placeholder="请输入单位名称"  /><template />
        </el-form-item>
        <el-form-item label="单位类型" prop="unitType">
          <el-input v-model="form.unitType" placeholder="请输入单位类型" />
        </el-form-item>
        <el-form-item label="固定电话" prop="unitPhone">
          <el-input v-model="form.unitPhone" placeholder="请输入单位固定电话" />
        </el-form-item>
        <el-form-item label="单位地址" prop="unitAddress">
          <el-input v-model="form.unitAddress" placeholder="请输入单位地址" />
        </el-form-item>
        <el-form-item label="单位邮箱" prop="unitEmail">
          <el-input v-model="form.unitEmail" placeholder="请输入单位邮箱" />
        </el-form-item>
        <el-form-item label="联系人" prop="unitContacts">
          <el-input v-model="form.unitContacts" placeholder="请输入单位联系人" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="unitContactsPhone">
          <el-input v-model="form.unitContactsPhone" placeholder="请输入单位联系人电话" />
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
  </div>
</template>

<script setup name="Unit">
import { listUnit, getUnit, delUnit, addUnit, updateUnit } from "@/api/erp/unit";
import {getCurrentInstance, ref} from "vue";
import {validUnitName} from "../../../../api/erp/unit";

const { proxy } = getCurrentInstance();

const unitList = ref([]);
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
    unitName: null,
    unitType: null,
    unitPhone: null,
    unitAddress: null,
    unitEmail: null,
    unitContacts: null,
    unitContactsPhone: null,
    status: null,
  },
  rules: {
    unitName: [
      { required: true, message: "单位名称不能为空", trigger: "blur" }
    ],
    unitType: [
      { required: true, message: "单位类别不能为空", trigger: "change" }
    ],
    unitPhone: [
      { required: true, message: "单位固定电话不能为空", trigger: "blur" }
    ],
    unitAddress: [
      { required: true, message: "单位地址不能为空", trigger: "blur" }
    ],
    unitEmail: [
      { required: true, message: "单位邮箱不能为空", trigger: "blur" }
    ],
    unitContacts: [
      { required: true, message: "单位联系人不能为空", trigger: "blur" }
    ],
    unitContactsPhone: [
      { required: true, message: "单位联系人电话不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "单位状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询往来单位列表 */
function getList() {
  loading.value = true;
  listUnit(queryParams.value).then(response => {
    unitList.value = response.rows;
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
    unitName: null,
    unitType: null,
    unitPhone: null,
    unitAddress: null,
    unitEmail: null,
    unitContacts: null,
    unitContactsPhone: null,
    status: null,
    remark: null,
    statusValue: false
  };
  proxy.resetForm("unitRef");
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

function handleSwitchChange(value){
  console.log(value);
  form.status = !form.status;

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
  ids.value = selection.map(item => item.unitId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加往来单位";
}


/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  console.log(row)
  const _unitId = row.unitId || ids.value
  getUnit(_unitId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改往来单位";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["unitRef"].validate(valid => {
    if (valid) {
      if (form.value.unitId != null) {
        updateUnit(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUnit(form.value).then(response => {
          console.log(response)
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
  const _unitIds = row.unitId || ids.value;
  proxy.$modal.confirm('是否确认删除往来单位编号为"' + _unitIds + '"的数据项？').then(function() {
    return delUnit(_unitIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/unit/export', {
    ...queryParams.value
  }, `unit_${new Date().getTime()}.xlsx`)
}

/** 鼠标移出名称框 */
// function mouseLeave(){
//
//
//   validUnitName(form.unitName).then(response => {
//     console.log(response)
//     proxy.$modal.msgSuccess("重复");
//
//   });
// }
const mouseLeave = (value) => {
  console.log("soaidhjdshjkdsklsd")
  console.log(value)
    let res = validUnitName(value);
  alert(res)
}


getList();
</script>
