<template>



  <div>
    <el-dialog
        v-model="props.openAddBatch"
        title="新增批次"
        width="30%"
        align-center
    >

      <el-form
          :model="form"
          ref="form"
          label-width="120px"
          :rules="rules"
      >
        <!-- 批次号生成方式 -->
        <el-form-item label="批次号生成方式" prop="generateType">
          <el-radio-group v-model="inputType">
            <el-radio label="1">系统自动生成</el-radio>
            <el-radio label="2">手动输入生产</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 批次号 -->
        <el-form-item label="批次号" v-show="inputType === '1'">
          <el-input v-model="form.batchCode" placeholder="系统自动生成" class="readonly-tree-select" />
        </el-form-item>

        <!-- 批次有效日期 -->
        <el-form-item label="批次有效日期" v-show="inputType === '1'">
          <el-date-picker v-model="form.validDate" type="date" />
        </el-form-item>

        <!-- 批次名称 -->
        <el-form-item label="批次名称" v-show="inputType === '1'">
          <el-input v-model="form.batchName" maxlength="30" placeholder="请输入批次名称" />
        </el-form-item>

        <el-form-item label="批次号" v-show="inputType === '2'">
          <el-input v-model="form.batchCode" placeholder="请输入批次号 2" />
        </el-form-item>

        <!-- 批次有效日期 -->
        <el-form-item label="批次有效日期" v-show="inputType === '2'">
          <el-date-picker v-model="form.validDate" type="date">

          </el-date-picker>
        </el-form-item>

        <!-- 批次名称 -->
        <el-form-item label="批次名称" v-show="inputType === '2'">
          <el-input v-model="form.batchName" maxlength="30" placeholder="请输入批次名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="handleCloseDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script setup>
// 接收父组件传递过来的值
import {defineEmits, defineProps} from "vue";
import {addBatch} from "../../../api/erp/batch";



const inputType = ref('1')



const data = reactive({
  form: ref({
    batchCode: ref(''),
    validDate: ref(''),
    batchName: ref(''),
  }),
  rules: {

    batchCode: [{ required: true, message: '请输入批次号', trigger: 'blur' }]
  }
});

const {form, rules } = toRefs(data);

function handleCloseDialog(){

}
// function handleSubmit(){
//   console.log(form.value)
//   addBatch(form.value).then(response =>{
//     proxy.$modal.msgSuccess("新增成功");
//   })
// }

const props = defineProps({
  openAddBatch:{
    type:Boolean,
    default:false
  }
})


// 接收父组件传递过来的方法--------------------------------------------------------------------------
const emit = defineEmits(['submitAddBatch'])


function handleSubmit(){
   //调用父组件传递过来的方法，传入参数修改父组件的值
  emit('submitAddBatch',form.value)
}

</script>

<style scoped>
/* 给蒙版添加样式 */
.readonly-tree-select::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(176,196,222, 0.2); /* 淡灰色 */
}
</style>