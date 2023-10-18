<template>
  <div
    class="toolbar-item salesNickName"
    @click="handleClick"
  >
    用户昵称
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'SalesNickName',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'salesNickName',
        innerHTML: '[用户昵称]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
