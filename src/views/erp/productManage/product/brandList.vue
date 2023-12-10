<template>
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
</template>

<script>

import {ref} from "vue";

const openBrand = ref(false);


</script>

<style scoped>

</style>