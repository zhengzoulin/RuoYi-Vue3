



<template>
  <div>
    <!-- 查看商品详细对话框 -->
    <el-dialog :title="props.title" v-model="props.openProductDetail" width="750px"  append-to-body>
      <el-form ref="productRef" :model="props.productForm"  label-width="80px">
        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品编号" prop="productCode" >
              <el-input v-model="props.productForm.productCode" placeholder="请输入商品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="选择目录" prop="catalogName">
              <el-tree-select
                  v-model="props.productForm.catalogId"
                  :data="props.catalogOptions"
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
              <el-input v-model="props.productForm.productName" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品介绍" prop="productIntro">
              <el-input v-model="props.productForm.productIntro" placeholder="请输入商品介绍" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="厂家型号" prop="productModel">
              <el-input v-model="props.productForm.productModel" placeholder="请输入厂家型号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品来源" prop="productSource">
              <el-input v-model="props.productForm.productSource" placeholder="请输入商品来源" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="录入方式" prop="productAddOrigin">
              <el-input v-model="props.productForm.productAddOrigin" placeholder="请输入商品重量" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="商品重量" prop="productWeight">
              <el-input v-model="props.productForm.productWeight" placeholder="请输入商品重量" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="封装规格" prop="encapStandard">
              <el-input v-model="props.productForm.encapStandard" placeholder="请输入封装规格" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="成本价" prop="costPrice">
              <el-input v-model="props.productForm.costPrice" placeholder="请输入成本价" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="售价" prop="salePrice">
              <el-input v-model="props.productForm.salePrice" placeholder="请输入售价" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" class="add-label">
            <el-form-item label="包装单位" prop="minpacketUnit">
              <el-input v-model="props.productForm.minpacketUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="add-label">
            <el-form-item label="包装数量" prop="minpacketNumber">
              <el-input v-model="props.productForm.minpacketNumber" placeholder="请输入最小包装数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input v-model="props.productForm.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="add-label">
            <el-form-item label="商品图片" prop="productImage">
              <image-upload v-model="props.productForm.productImage"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="">确 定</el-button>
          <el-button @click="cancelProductDetail">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>




<script setup>
// 接收父组件传递过来的值
import {defineEmits, defineProps} from "vue";

const props = defineProps({
  productForm:{
    type:Object,
    default: {}
  },
  openProductDetail:{
    type:Boolean,
    default:false
  },
  title:{
    type:String,
    default:""
  },
  catalogOptions:{
    type:Array,
    default:[]
  }
})

</script>

<style scoped>

</style>