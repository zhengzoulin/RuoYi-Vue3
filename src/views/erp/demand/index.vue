<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="需求编号" prop="demandCode">
        <el-input
          v-model="queryParams.demandCode"
          placeholder="请输入需求编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品id" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入商品id"
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
      <el-form-item label="采购需求数量" prop="demandNumber">
        <el-input
          v-model="queryParams.demandNumber"
          placeholder="请输入采购需求数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="需求来源" prop="demandSource">
        <el-input
          v-model="queryParams.demandSource"
          placeholder="请输入需求来源"
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
          v-hasPermi="['erp:demand:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:demand:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['erp:demand:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['erp:demand:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="demandList" @selection-change="handleSelectionChange"
              >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="需求编号" align="center" prop="demandCode" />
      <el-table-column label="商品" align="center">
        <template #default="scope">
          <span style="display: block;">商品:{{ scope.row.product.productName }}</span>
          <span style="display: block;">封装规格:{{ scope.row.product.encapStandard }}</span>
          <span style="display: block;">厂家型号:{{ scope.row.product.productModel }}</span>

          <span style="display: block;">最小包装数量:{{ scope.row.product.minpacketNumber }}</span>
        </template>
      </el-table-column>


      <el-table-column label="目标仓库" align="center" prop="warehouse.warehousePath" />
      <el-table-column label="采购需求数量" align="center" prop="demandNumber" />
      <el-table-column label="需求来源" align="center" prop="demandSource" />
      <el-table-column label="需求状态" align="center" prop="demandStatus" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:demand:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:demand:remove']">删除</el-button>
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

    <!-- 添加或修改采购需求对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="demandRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="需求编号" prop="demandCode">
          <el-input v-model="form.demandCode" placeholder="请输入需求编号" />
        </el-form-item>
        <el-form-item label="商品id" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入商品id" />
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入所属仓库" />
        </el-form-item>
        <el-form-item label="采购需求数量" prop="demandNumber">
          <el-input v-model="form.demandNumber" placeholder="请输入采购需求数量" />
        </el-form-item>
        <el-form-item label="需求来源" prop="demandSource">
          <el-input v-model="form.demandSource" placeholder="请输入需求来源" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
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



    <!--    商品选择框-->
    <el-dialog :title="title" v-model="openProduct" width="950px"  append-to-body>

<!--      //第一步:定义出4个步骤-->
      <el-steps :active="active" finish-status="success">
        <el-step title="第一步" />
        <el-step title="第二步" />
        <el-step title="第三步" />
      </el-steps>

<!--      //第二步:定义form表单-->
      <el-form
          ref="demandRef"
          :model="demandForm"
          :rules="rules"
          label-position="left"
          label-width="80px"
          style="width: 850px;
          margin-left: 30px">

<!--        //第三步:定义4个盒子对象active => 1 到 4-->
        <div v-show="active === 1">
<!--         商品选择组件-->

          <ProductTable  :productList="productList"
                         @queryProduct="childProductQuery"
                         @getSelectProduct="getChildProductList"
                         @getProductDetail="getChildProductDetail"
          >

          </ProductTable>
        </div>
        <div v-show="active === 2">
          <el-form-item label="选择目标仓库" prop="warehouseId">
            <el-tree-select
                v-model="demandForm.warehouseId"
                :data="warehouseOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                placeholder="请选择仓库"
                check-strictly
            />
          </el-form-item>
        </div>
        <div v-show="active === 3">
          <el-table v-loading="loading" :data="demandForm.demandProductsList" :rules="demandRules"   @cell-click="tabClick">
<!--            <el-table-column type="selection" width="55" align="center" />-->

            <el-table-column label="商品编号" align="center" prop="productCode" />
            <el-table-column label="商品名称" align="center" prop="productName" />
            <el-table-column label="商品图片" prop="productImage" align="center" >
              <template  #default="scope" width="90">
                <ImagePreview style="width:60px;height:60px;" :src="scope.row.productImage" />
              </template>
            </el-table-column>
            <el-table-column label="厂家型号" align="center" prop="productModel" />
            <el-table-column label="封装规格" align="center" prop="encapStandard" />

            <el-table-column label="需求数量" prop="demandNumber">
              <template #default="scope">
            <span>
              <el-input v-model="scope.row.demandNumber" type="number" maxlength="26" placeholder="请输入需求" size="mini"  />
            </span>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark">
              <template #default="scope">
            <span>
              <el-input v-model="scope.row.remark" type="text" maxlength="50" placeholder="备注" size="mini"  />
            </span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button link type="primary" icon="list" @click="handleDetail(scope.row)" v-hasPermi="['erp:product:edit']">详细</el-button>
                <el-button link type="danger" icon="delete" @click="removeRow(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
<!--        <button @click="handleClearSelection">清除选中记录</button>-->

<!--        <el-button v-if="active === 3" style="margin-top: 12px" @click="handleClearSelection">清除选中记录</el-button>-->

      </el-form>

<!--      第五步:设置上一步和下一步的按钮-->
      <el-button v-if="active > 1" style="margin-top: 12px" @click="preStep">上一步</el-button>

      <el-button v-if="active < 3" style="margin-top: 12px" @click="nextStep">下一步</el-button>
      <el-button v-if="active === 3" style="margin-top: 12px" @click="submitDemandForm">确 定</el-button>




    </el-dialog>


    <!-- 查看商品详细对话框 -->
    <el-dialog :title="title" v-model="openProductDetail" width="750px"  append-to-body>
      <el-form ref="productRef" :model="productForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品编号" prop="productCode" >
              <el-input v-model="productForm.productCode" placeholder="请输入商品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="选择目录" prop="catalogName">
              <el-tree-select
                  v-model="productForm.catalogId"
                  :data="catalogOptions"
                  :props="{ value: 'id', label: 'label', children: 'children' }"
                  value-key="isd"
                  placeholder="请选择目录分类"
                  check-strictly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="productForm.productName" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品介绍" prop="productIntro">
              <el-input v-model="productForm.productIntro" placeholder="请输入商品介绍" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="厂家型号" prop="productModel">
              <el-input v-model="productForm.productModel" placeholder="请输入厂家型号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品来源" prop="productSource">
              <el-input v-model="productForm.productSource" placeholder="请输入商品来源" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="录入方式" prop="productAddOrigin">
              <el-input v-model="productForm.productAddOrigin" placeholder="请输入商品重量" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品重量" prop="productWeight">
              <el-input v-model="productForm.productWeight" placeholder="请输入商品重量" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="封装规格" prop="encapStandard">
              <el-input v-model="productForm.encapStandard" placeholder="请输入封装规格" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="成本价" prop="costPrice">
              <el-input v-model="productForm.costPrice" placeholder="请输入成本价" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="售价" prop="salePrice">
              <el-input v-model="productForm.salePrice" placeholder="请输入售价" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="包装单位" prop="minpacketUnit">
              <el-input v-model="productForm.minpacketUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="包装数量" prop="minpacketNumber">
              <el-input v-model="productForm.minpacketNumber" placeholder="请输入最小包装数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input v-model="productForm.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="add-label">
            <el-form-item label="商品图片" prop="productImage">
              <image-upload v-model="productForm.productImage"/>
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup name="Demand">
import { listDemand, getDemand, delDemand, addDemand, updateDemand } from "@/api/erp/demand";
import { listProduct } from "@/api/erp/product";

import {ref,reactive} from "vue";
import {getProduct} from "../../../api/erp/product";
import {catalogTreeSelect} from "../../../api/erp/catalog";
import {warehouseTreeSelect} from "../../../api/erp/position";
import ProductTable from "../../../components/zerp/table/productTable";




const { proxy } = getCurrentInstance();

const demandList = ref([]);
const productList = ref([]);
const catalogOptions = ref(undefined);
const catalogName = ref("");
const warehouseOptions = ref(undefined);

const open = ref(false);
const openProduct = ref(false);
const openProductDetail = ref(false);

const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const productIds = ref([]);

const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const active =ref(1);
const tabClickIndex = ref();
const tabClickLabel = ref();
const row = ref();


const data = reactive({
  form: {},
  productForm:{},
  demandForm:{
    demandProductsList:ref([]),
    remark:null,
    warehouseId: null,
  },

  queryProductParams: {
    pageNum: 1,
    pageSize: 10,
    brandId: null,
    productId: null,
    catalogId: null,
    productCode: null,
    productName: null,
    productSource: null,
    productAddOrigin: null,
    status: null,
    statusValue: false
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    demandCode: null,
    productId: null,
    warehouseId: null,
    demandNumber: null,
    demandSource: null,
    demandStatus: null,
    status: null,
  },
  demandRules: {
    // 规则定义
    // 需求数量字段必填
    demandNumber: [{ required: true, message: '需求数量不能为空', trigger: 'blur' }]
  },
  rules: {
    demandCode: [
      { required: true, message: "需求编号不能为空", trigger: "blur" }
    ],
    productId: [
      { required: true, message: "商品id不能为空", trigger: "blur" }
    ],
    warehouseId: [
      { required: true, message: "所属仓库不能为空", trigger: "blur" }
    ],
    demandNumber: [
      { required: true, message: "采购需求数量不能为空", trigger: "blur" }
    ],
    demandSource: [
      { required: true, message: "需求来源不能为空", trigger: "blur" }
    ],
    demandStatus: [
      { required: true, message: "需求状态不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams,queryProductParams, form,demandForm,
  productForm,rules ,demandRules} = toRefs(data);



// const multipleTableRef = ref();
const select_order_number = ref(''); // 表格select选中的条数
const select_orderId = ref([]); // 表格select复选框选中的id
const multipleSelection = ref([]);
// 选中的list
const getRowKeys = (row) => {
// 记录每行的key值
return row;
}

// 当表格选择项发生变化时会触发该事件
const handleDemandSelectionChange = (val) => {
if (val) {
val.forEach((row) => {
  if (row && !productIds.value.some(item => item.productId === row.productId)) {
    productIds.value.push(row);
  }
  });
}
  }

const selection = ref();

const removeRow = (row) => {
  const confirmResult = confirm('确定要移除这一行吗？');
  if (confirmResult) {
    alert(row)
    const index = demandForm.value.demandProductsList.findIndex(item => item.productId === row.productId);
    if (index !== -1) {
      demandForm.value.demandProductsList.splice(index, 1);
      alert('成功移除该行');
    } else {
      alert('未找到对应行');
    }
  } else {
    alert('已取消移除');
  }
};

function tableRowClassName ({ row, rowIndex }) {
  // 把每一行的索引放进row
  row.index = rowIndex
}
// tabClick row 当前行 column 当前列
function tabClick (row, column, cell, event) {
  switch (column.label) {
    case '顺序':
      tabClickIndex.value = row.index
      tabClickLabel.value = column.label
      break
    default: return
  }
  console.log('tabClick', this.tabClickIndex, row.demandNumber)
}
// 失去焦点初始化
function inputBlur (row) {
  // console.log('row', row)
  tabClickIndex.value = null
  tabClickLabel.value = ''
}


// 步骤条下一步的方法
function nextStep() {

  demandForm.value.demandProductsList = productIds.value

  active.value += 1;
  if (active > 3){
    active.value = 1
  }
}
// 步骤条上一步的方法
function preStep() {
  active.value--;
  if (active < 2){
    active.value = 1
  }
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

/** 查看详细按钮操作 */
function handleDetail(row) {
  reset();
  getCatalogTree();

  const _productId = row.productId || ids.value
  getProduct(_productId).then(response => {
    productForm.value = response.data;
    openProductDetail.value = true;
    title.value = "商品详情";
  });
}

/** 查询采购需求列表 */
function getList() {
  loading.value = true;
  listDemand(queryParams.value).then(response => {
    demandList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 查询商品列表 */
function getProductList() {
  loading.value = true;
  listProduct(queryProductParams.value).then(response => {
    productList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(catalogName, val => {
  proxy.$refs["catalogTreeRef"].filter(val);
});
/** 查询目录下拉树结构 */
function getCatalogTree() {
  catalogTreeSelect().then(response => {
    catalogOptions.value = response.data;
  });
};
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
    demandId: null,
    demandCode: null,
    productId: null,
    warehouseId: null,
    demandNumber: null,
    demandSource: null,
    demandStatus: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("demandRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 商品搜索按钮操作 */
function handleProductQuery() {
  queryProductParams.value.pageNum = 1;
  getProductList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 重置商品按钮操作 */
function resetProductQuery() {
  proxy.resetForm("queryProductRef");
  handleProductQuery();
}


/** 新增按钮操作 */
function handleAdd() {
  reset();
  resetProductQuery();
  active.value=1
  getProductList();
  openProduct.value = true;
  handleLogout();
  title.value = "添加采购需求";
}

// 在退出功能触发时调用的方法
const handleLogout = () => {
  // 清除选中记录
  multipleSelection.value = []; // 清空选中列表
  select_order_number.value = ''; // 清空选中条数
  select_orderId.value = []; // 清空选中的 ID 数组
  productIds.value = [];
  // 其他清理操作...
  // 进行退出操作...
}


/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _demandId = row.demandId || ids.value
  getDemand(_demandId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改采购需求";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["demandRef"].validate(valid => {
    if (valid) {
      if (form.value.demandId != null) {
        updateDemand(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDemand(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 提交新增需求按钮 */
function submitDemandForm() {

  proxy.$refs["demandRef"].validate(valid => {
    if (valid) {
        addDemand(demandForm.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          openProduct.value = false;
          getList();
        });
      }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _demandIds = row.demandId || ids.value;
  proxy.$modal.confirm('是否确认删除采购需求编号为"' + _demandIds + '"的数据项？').then(function() {
    return delDemand(_demandIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/demand/export', {
    ...queryParams.value
  }, `demand_${new Date().getTime()}.xlsx`)
}

//************************************************************
function childProductQuery(data){
  queryProductParams.value = data
  console.log(queryProductParams.value)
  handleProductQuery();
}
function getChildProductDetail(data){
  reset();
  getCatalogTree();

  const _productId = data.productId
  getProduct(_productId).then(response => {
    productForm.value = response.data;
    openProductDetail.value = true;
    title.value = "商品详情";
  });
}
function getChildProductList(data){

  openProduct.value=false;
  form.value.demandProductsList = data

}







getList();
getWarehouseTree();
</script>
