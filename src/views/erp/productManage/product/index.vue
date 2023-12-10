<template>
  <div class="app-container">
    <el-row :gutter="15">
<!--目录树-->
      <!--部门数据-->
      <el-col :span="3" :xs="24">
        <div class="head-container">
          <el-input
              v-model="catalogName"
              placeholder="请输入目录名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
              :data="catalogOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="catalogTreeRef"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>



<!--      商品列表-->
      <el-col :span="21" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="商品编号" prop="productCode">
            <el-input
                v-model="queryParams.productCode"
                placeholder="请输入商品编号"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品名称" prop="productName">
            <el-input
                v-model="queryParams.productName"
                placeholder="请输入商品名称"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品来源" prop="productSource">
            <el-input
                v-model="queryParams.productSource"
                placeholder="请输入商品来源"
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
                v-hasPermi="['erp:product:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="success"
                plain
                icon="Edit"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['erp:product:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['erp:product:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="warning"
                plain
                icon="Download"
                @click="handleExport"
                v-hasPermi="['erp:product:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="商品编号" align="center" prop="productCode" />
          <el-table-column label="商品名称" align="center" prop="productName" />
          <el-table-column label="商品图片" prop="productImage" align="center" >
            <template  #default="scope" width="100">
              <ImagePreview style="width:70px;height:60px;" :src="scope.row.productImage" />
            </template>
          </el-table-column>
          <el-table-column label="品牌" align="center" prop="brand.brandName" />
          <el-table-column label="描述" align="center" prop="productIntro" />
<!--          <el-table-column label="厂家型号" align="center" prop="productModel" />-->
<!--          <el-table-column label="商品来源" align="center" prop="productSource" />-->
<!--          <el-table-column label="录入方式" align="center" prop="productAddOrigin" />-->
<!--          <el-table-column label="重量" align="center" prop="productWeight" />-->
<!--          <el-table-column label="封装规格" align="center" prop="encapStandard" />-->
<!--          <el-table-column label="成本价" align="center" prop="costPrice" />-->
<!--          <el-table-column label="售价" align="center" prop="salePrice" />-->
          <el-table-column label="包装单位" align="center" prop="minpacketUnit" />
<!--          <el-table-column label="包装数量" align="center" prop="minpacketNumber" />-->
          <el-table-column align="center" label="商品状态" prop="status">
            <template #default="scope">
              <el-tag :type="scope.row.status == '0' ?'success':'warning'"> {{ formatStatus(scope.row.status) }} </el-tag>
            </template>
          </el-table-column>
<!--          <el-table-column label="备注" align="center" prop="remark" />-->
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220px">
            <template #default="scope">
              <el-button link type="primary" icon="list" @click="handleDetail(scope.row)" v-hasPermi="['erp:product:edit']">详细</el-button>
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['erp:product:edit']">修改</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['erp:product:remove']">删除</el-button>
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
      </el-col>
    </el-row>


    <!-- 添加或修改商品列表对话框 -->
    <el-dialog :title="title" v-model="open" width="750px"  append-to-body>
      <el-form ref="productRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品编号" prop="productCode" >
              <el-input v-model="form.productCode" placeholder="请输入商品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="选择目录" prop="catalogName">
              <el-tree-select
                  v-model="form.catalogId"
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
              <el-input v-model="form.productName" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品品牌" prop="brandName">
              <el-select v-model="form.brandName" placeholder="请选择品牌"  @click="getBrandClick" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品介绍" prop="productIntro">
              <el-input v-model="form.productIntro" placeholder="请输入商品介绍" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="厂家型号" prop="productModel">
              <el-input v-model="form.productModel" placeholder="请输入厂家型号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品来源" prop="productSource">
              <el-input v-model="form.productSource" placeholder="请输入商品来源" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="录入方式" prop="productAddOrigin">
              <el-input v-model="form.productAddOrigin" placeholder="请输入商品重量" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品重量" prop="productWeight">
              <el-input v-model="form.productWeight" placeholder="请输入商品重量" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="封装规格" prop="encapStandard">
              <el-input v-model="form.encapStandard" placeholder="请输入封装规格" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="成本价" prop="costPrice">
              <el-input v-model="form.costPrice" placeholder="请输入成本价" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="售价" prop="salePrice">
              <el-input v-model="form.salePrice" placeholder="请输入售价" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="包装单位" prop="minpacketUnit">
              <el-input v-model="form.minpacketUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="包装数量" prop="minpacketNumber">
              <el-input v-model="form.minpacketNumber" placeholder="请输入最小包装数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="add-label">
            <el-form-item label="商品图片" prop="productImage">
              <image-upload v-model="form.productImage"/>
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

<!--    品牌选择框-->
    <el-dialog :title="title" v-model="openBrand" width="650px"  append-to-body>

      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="品牌名称" prop="brandName">
          <el-input
              v-model="queryParams.brandName"
              placeholder="请输入品牌名称"
              clearable
              @keyup.enter="handleBrandQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleBrandQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetBrandQuery">重置</el-button>
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAddBrand"
              v-hasPermi="['erp:brand:add']"
          >新增</el-button>
        </el-form-item>

      </el-form>

      <el-table v-loading="loading" :data="brandList" >
        <el-table-column type="index" width="40" align="center" />
        <el-table-column label="品牌名称" align="center" prop="brandName" />
        <el-table-column label="品牌描述" align="center" prop="brandDesc" />
        <el-table-column align="center" label="品牌状态" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status == '0' ?'success':'warning'"> {{ formatStatus(scope.row.status) }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Select" @click="handleBrand(scope.row)" >选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          small
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />

    </el-dialog>

    <!-- 添加品牌管理对话框 -->
    <el-dialog :title="title" v-model="openAddBrand" width="500px" append-to-body>
      <el-form ref="brandRef" :model="brandForm" :rules="rules" label-width="80px">
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="brandForm.brandName" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="品牌描述" prop="brandDesc">
          <el-input v-model="brandForm.brandDesc" placeholder="请输入品牌描述" />
        </el-form-item>
        <el-form-item label="品牌排序" prop="brandSort">
          <el-input v-model="brandForm.brandSort" placeholder="请输入品牌排序" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="brandForm.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitBrandForm">确 定</el-button>
          <el-button @click="cancelAddBrand">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Product">
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from "@/api/erp/product";
import {ref} from "vue";
import {catalogTreeSelect} from "../../../../api/erp/catalog";
import {addBrand, listBrand} from "../../../../api/erp/brand";

const { proxy } = getCurrentInstance();

const productList = ref([]);
const brandList = ref([]);
const catalogOptions = ref(undefined);
const catalogName = ref("");
const open = ref(false);
const openBrand = ref(false);
const openAddBrand = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  brandForm: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    brandId: null,
    catalogId: null,
    productCode: null,
    productName: null,
    productSource: null,
    productAddOrigin: null,
    status: null,
    statusValue: false
  },
  rules: {
    catalogId: [
      { required: true, message: "目录id不能为空", trigger: "blur" }
    ],
    productCode: [
      { required: true, message: "商品编号不能为空", trigger: "blur" }
    ],
    productName: [
      { required: true, message: "商品名称不能为空", trigger: "blur" }
    ],
    productModel: [
      { required: true, message: "厂家型号不能为空", trigger: "blur" }
    ],
    productAddOrigin: [
      { required: true, message: "录入方式不能为空", trigger: "blur" }
    ],
    encapStandard: [
      { required: true, message: "封装规格不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "商品状态不能为空", trigger: "change" }
    ],
    brandName: [
      { required: true, message: "商品品牌不能为空", trigger: "blur" }
    ],
    brandDesc: [
      { required: true, message: "品牌描述不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form,brandForm, rules } = toRefs(data);

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
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.catalogId = data.id;
  handleQuery();
};

function getBrandClick(){
  title.value = "选择商品品牌"
  openBrand.value=true;
  getBrandList();
}
function handleBrand(row){
  form.value.brandId = row.brandId;
  form.value.brandName = row.brandName;

  openBrand.value=false;
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

/** 查询商品列表列表 */
function getList() {
  loading.value = true;
  listProduct(queryParams.value).then(response => {
    productList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


/** 查询品牌列表列表 */
function getBrandList() {
  loading.value = true;
  listBrand(queryParams.value).then(response => {
    brandList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}



// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 品牌新增取消按钮
function cancelAddBrand() {
  openAddBrand.value = false;
  brandReset();
}

// 表单重置
function reset() {
  form.value = {
    productId: null,
    brandId: null,
    brandName:null,
    catalogId: null,
    productCode: null,
    productName: null,
    productImage: null,
    productIntro: null,
    productModel: null,
    productSource: null,
    productAddOrigin: null,
    productWeight: null,
    encapStandard: null,
    costPrice: null,
    salePrice: null,
    minpacketUnit: null,
    minpacketNumber: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("productRef");
}

// 品牌表单重置
function brandReset() {
  brandForm.value = {
    brandId: null,
    brandName: null,
    brandDesc: null,
    brandSort: null,
    remark: null,
    status: null,
    statusValue: false
  };
  proxy.resetForm("brandRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 搜索按钮操作 */
function handleBrandQuery() {
  queryParams.value.pageNum = 1;
  getBrandList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 品牌重置按钮操作 */
function resetBrandQuery() {
  proxy.resetForm("brandRef");
  handleBrandQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.productId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  brandReset();
  open.value = true;
  title.value = "添加商品列表";
}
/** 新增品牌按钮操作 */
function handleAddBrand() {
  brandReset();
  openAddBrand.value = true;
  title.value = "添加商品列表";
}

/** 查看详细按钮操作 */
function handleDetail(row) {
  reset();
  const _productId = row.productId || ids.value
  getProduct(_productId).then(response => {
    form.value = response.data;
    form.value.brandName = form.value.brand.brandName
    open.value = true;
    title.value = "修改商品列表";
  });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _productId = row.productId || ids.value
  getProduct(_productId).then(response => {
    form.value = response.data;
    form.value.brandName = form.value.brand.brandName
    open.value = true;
    title.value = "修改商品列表";
  });
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["productRef"].validate(valid => {
    if (valid) {
      if (form.value.productId != null) {
        updateProduct(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProduct(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 品牌新增提交按钮 */
function submitBrandForm() {
  proxy.$refs["brandRef"].validate(valid => {
    if (valid) {
        addBrand(brandForm.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          openAddBrand.value = false;
          getBrandList();
        });
      }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const _productIds = row.productId || ids.value;
  proxy.$modal.confirm('是否确认删除商品列表编号为"' + _productIds + '"的数据项？').then(function() {
    return delProduct(_productIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('erp/product/export', {
    ...queryParams.value
  }, `product_${new Date().getTime()}.xlsx`)
}

/** 查询目录树结构*/




getList();
getCatalogTree();
</script>


<style>
.add-label{
  margin-left: 30px;
  margin-right: 20px;
  margin-top: 5px;
}


</style>