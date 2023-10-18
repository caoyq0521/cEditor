<template>
  <div
    class="toolbar-item achievement"
    @click="handleClick"
  >
    已完成任务量
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'Achievement',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'achievement',
        innerHTML: '[已完成任务量]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
