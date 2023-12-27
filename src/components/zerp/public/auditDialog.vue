<template>
<div>
  <el-dialog
      v-model="props.openAudit"
      :title="props.AuditTitle"
      width="30%"
      align-center
  >
    <span>审核备注</span>
    <el-input
        v-model="props.auditAddDTO.auditRemark"
        placeholder="请输入审核备注"
        clearable
        style="height: 100px"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.openAudit.value = false">取消</el-button>
        <el-button type="primary" @click="submitOrderAudit">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</div>
</template>



<script setup>

// 接收父组件传递过来的值
import {defineEmits, defineProps} from "vue";

const props = defineProps({
  auditAddDTO:{
    type:Object,
    default: {}
  },
  openAudit:{
    type:Boolean,
    default:false
  },
  AuditTitle:{
    type:String,
    default:""
  }
})


// 接收父组件传递过来的方法--------------------------------------------------------------------------
const emit = defineEmits(['submitOrderAudit'])


function submitOrderAudit(){
  //调用父组件传递过来的方法，传入参数修改父组件的值
  emit('submitOrderAudit', props.auditAddDTO)
}

</script>

<style scoped>

</style>