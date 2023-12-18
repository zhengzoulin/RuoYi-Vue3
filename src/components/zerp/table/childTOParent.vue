<template>
  <div>
    <!-- 使用父组件传递过来的值 -->
    <h1>xxxxxx{{ props.name }}</h1>
    <button @click="handelClick">子组件按钮</button>
  </div>
</template>
<script setup>
// 从 vue 中引入defineProps, defineEmits
import { defineProps, defineEmits } from 'vue'

// 接收父组件传递过来的值
const props = defineProps(['name'])


// 接收父组件传递过来的方法
const emit = defineEmits(['func'])

const handelClick = function  () {
  //调用父组件传递过来的方法，传入参数修改父组件的值
  emit('func', 'hello world')
}
</script>

