<template>
  <div
    class="toolbar-item activityName"
    @click="handleClick"
  >
    活动名称
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'Achievement',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'activityName',
        innerHTML: '[活动名称]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
