<template>
  <div
    class="toolbar-item salesTime"
    @click="handleClick"
  >
    当前时间
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'SalesTime',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'salesTime',
        innerHTML: '[当前时间]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
