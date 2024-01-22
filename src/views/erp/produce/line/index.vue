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
        />
      </el-form-item>
      <el-form-item label="产线编号" prop="lineCode">
        <el-input
          v-model="queryParams.lineCode"
          placeholder="请输入生产线编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产线名称" prop="lineName">
        <el-input
          v-model="queryParams.lineName"
          placeholder="请输入生产线名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" style="margin-bottom: 20px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['erp:line:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="Edit"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['erp:line:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="Delete"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['erp:line:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['erp:line:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!--    当前展示的为【默认父仓 - 成品仓】的生产线-->
    <el-row style="margin-bottom: 15px">
      <el-col :span="8" style="font-size: 22px">当前展示的为: [  <span class="current-house">{{currentHouse.warehousePath}}</span>  ] 的生产线</el-col>

    </el-row>


    <el-row>
      <el-col :span="24" v-for="(line, index) in lineList" :key="index">
        <el-card>
          <div slot="header" class="clearfix" style="margin-bottom: 7px">
            <span>{{ line.lineCode }}    </span>
            <span style="margin-left: 30px;font-size: 18px !important;">{{ line.lineName }}</span>
          </div>

          <el-row>
            <el-col :span="8">
              <div class="card-item">
                <label>启用状态: </label>
                <el-tag :type="line.status == '0' ? 'success' : 'warning'">{{ formatStatus(line.status) }}</el-tag>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="card-item" >
                <label>产线状态: </label>
                <el-popover
                    ref="popover"
                    placement="right"
                    title="生产产品"
                    :width="400"
                    :hight="800"
                    trigger="hover"
                    content="this is content, this is content, this is content"
                >
                  <template #reference>
                    <el-tag  @mouseout="handleMouseOut"  @mouseover="showLineStatusPop(line.lineId,line.lineStatus)" :type="line.lineStatus == '0' ? 'success' : 'danger'" class="m-2">{{ formatLineStatus(line.lineStatus) }}</el-tag>
                  </template>
                  <el-card style="height: 250px" :data="produceDetail"    @mouseover="popLoading=false">
                    <div v-loading="popLoading">
                      <p>计划编号: {{ produceDetail.planCode }}</p>
                      <p>计划名称: {{ produceDetail.planName }}</p>
                      <p>成品编号: {{ produceDetail.productForm.productCode }}</p>
                      <p>成品名称: {{ produceDetail.productForm.productName }}</p>
                      <p>厂家型号: {{ produceDetail.productForm.encapStandard }}</p>
                      <p>生产数量: {{ produceDetail.groupNumber }}</p>
                      <p>计划日期: {{ produceDetail.planTime }}</p>
                    </div>
                  </el-card>
                </el-popover>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="card-item">
                <label>备注: </label>
                <span>{{ line.remark }}</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="card-item">
                <el-button type="text" v-show="line.lineStatus==1" @click="handleComplete(line) " style="color: red">完成生产</el-button>

                <el-button type="text" @click="handleUpdate(line)" v-hasPermi="['erp:line:edit']">修改</el-button>
                <el-button type="text" @click="handleDelete(line)" v-hasPermi="['erp:line:remove']">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />




    <!-- 添加或修改生产线管理对话框 -->
    <el-dialog :title="title" v-model="open" width="520px" append-to-body>
      <el-form ref="lineRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产线编号" prop="lineCode">
          <el-input v-model="form.lineCode" placeholder="保存后自动生成" clearable class="readonly-tree-select" />
        </el-form-item>
        <el-form-item label="产线名称" prop="lineName">
          <el-input v-model="form.lineName" placeholder="请输入生产线名称" />
        </el-form-item>
        <el-form-item label="产线位置" prop="warehouseId">
          <el-tree-select
              v-model="form.warehouseId"
              :data="warehouseOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="isd"
              placeholder="请选择仓库"
           />
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

<script setup name="Line">
import { listLine, getLine, delLine, addLine, updateLine } from "@/api/erp/line";
import {getWarehouse, warehouseParentTreeSelect, warehouseTreeSelect} from "../../../../api/erp/position";
import {ref} from "vue";
import {getPlan} from "../../../../api/erp/plan";
import {completeProduce, getCurrentPlanByLine} from "../../../../api/erp/line";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();

const { proxy } = getCurrentInstance();
const lineList = ref([]);
const open = ref(false);
const visible = ref(false)
const loading = ref(true);
const popLoading = ref(true);

const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const warehouseOptions = ref(undefined);
const produceDetail = ref({
  productForm: {
    productCode: "",
    productName: "",
    encapStandard: ""
  },
  planCode:null,
  planName:null,
  planTime:null
})
const currentHouse = ref({
  warehousePath:""
});

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

/** 查询生产线管理列表 */
function getList() {
  loading.value = true;
  listLine(queryParams.value).then(response => {
    lineList.value = response.rows;
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
    lineId: null,
    lineCode: null,
    lineName: null,
    warehouseId: null,
    warehouse: null,
    lineStatus: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("lineRef");
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
  queryParams.value={}
  queryParams.value.warehouseId = 101
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.lineId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 获取当前仓库路径*/
function getCurrentHouse(){
  const _warehouseId = queryParams.value.warehouseId
  getWarehouse(_warehouseId).then(response => {
    currentHouse.value.warehousePath = response.data.warehousePath;
  });
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加生产线管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _lineId = row.lineId || ids.value
  getLine(_lineId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改生产线管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["lineRef"].validate(valid => {
    if (valid) {
      if (form.value.lineId != null) {
        updateLine(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addLine(form.value).then(response => {
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
  const _lineIds = row.lineId || ids.value;
  proxy.$modal.confirm('是否确认删除生产线管理编号为"' + _lineIds + '"的数据项？').then(function() {
    return delLine(_lineIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/line/export', {
    ...queryParams.value
  }, `line_${new Date().getTime()}.xlsx`)
}
//状态显示
function formatStatus(status) {
  if (status === '0') {
    return '已启用'
  } else if (status === '1') {
    return '已停用'
  } else {
    return '错误状态'
  }
}
function formatLineStatus(status) {
  if (status === '0') {
    return '空闲中'
  } else if (status === '1') {
    return '正在生产'
  } else {
    return '错误状态'
  }
}

/** 查询父级仓库下拉树结构 */
function getWarehouseTree() {
  warehouseParentTreeSelect().then(response => {
    warehouseOptions.value = response.data;
  });
};


let delayTimer;

function showLineStatusPop(lineId,lineStatus) {
  //
  // 清除之前的定时器
  clearTimeout(delayTimer);
  if(lineStatus == 0){
    produceDetail.value = {
      productForm: {
        productCode: "",
        productName: "",
        encapStandard: ""
      },
      planCode:null,
      planName:null,
      planTime:null
    }
    return
  }

  // 设置新的定时器，在1.5秒后执行
  delayTimer = setTimeout(() => {
    popLoading.value = true
    getCurrentPlanByLine(lineId).then(response => {
      produceDetail.value = response.data;
      produceDetail.value.productForm = response.data.productForm
      popLoading.value = false
    });
  }, 1200);

}

// 鼠标移出时清除定时器
function handleMouseOut() {
  clearTimeout(delayTimer);
  popLoading.value = true
}
//完成生产
function handleComplete(line){
  completeProduce(line.lineId).then(response=>{
    proxy.$modal.msgSuccess("操作成功");
    getList();
  })
}


queryParams.value.warehouseId = 101

// 接收参数
const warehouseIdRoute = ref(route.query.warehouseId);
const lineCodeRoute = ref(route.query.lineCode)


function loadLine(){
  if(warehouseIdRoute.value!=null || lineCodeRoute.value !=null){
    queryParams.value.warehouseId = warehouseIdRoute.value;
    queryParams.value.lineCode = lineCodeRoute.value;
    handleQuery()
  }
}


// 在组件挂载前监听路由变化
onBeforeMount(() => {
  watch(
      () => route.fullPath,
      async () => {
        if (route.name === 'Line') {
          // 使用 nextTick 确保在 DOM 更新后执行刷新数据的逻辑
          await nextTick();
          const warehouseIdRoute = ref(route.query.warehouseId);
          const lineCodeRoute = ref(route.query.lineCode)
          if(warehouseIdRoute.value!=null || lineCodeRoute.value !=null){
            queryParams.value.warehouseId = warehouseIdRoute.value;
            queryParams.value.lineCode = lineCodeRoute.value;
            handleQuery()
          }
        }
      }
  );
});


loadLine()
getList();
getWarehouseTree()
getCurrentHouse();

</script>

<style>
.current-house {
  color: #FEC171;
  margin: auto;
}

/* 给蒙版添加样式 */
.readonly-tree-select::after {
  content: '';
  position: absolute;
  top: 1px; /* 调整蒙版顶部偏移 */
  bottom: 1px; /* 调整蒙版底部偏移 */
  left: 1px;
  right: 1px;
  z-index: 1;
  background-color: rgba(204, 219, 238, 0.43); /* 淡灰色 */
  box-sizing: border-box; /* 让蒙版尺寸包括 border 和 padding */
  padding: 1px; /* 调整蒙版内边距，使其与输入框内容更贴近 */
  border-radius: 4px; /* 添加圆角 */
}

.card-item {
  margin-bottom: 10px;
}
.el-card {
  margin-bottom: 10px; /* 调整卡片底部间隔，根据需要调整数值 */
}
</style>
