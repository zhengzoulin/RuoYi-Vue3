<!-- 子组件代码 -->
<template>
  <div class="about">
    <h1>{{ props.value }}</h1>
    <button @click="onChildClick">子组件按钮</button>
  </div>
</template>
<script setup>
/**
 * 引入必要的模块
 */
import { defineProps, defineEmits } from 'vue'
/**
 * 定义数据
 */
const props = defineProps({ value: { type: Number } })
const emit = defineEmits(['add'])

/**
 * 定义方法
 */
function onChildClick () {
  emit('add', 2)
}
</script>