<template>
  <div
    class="toolbar-item withdraw"
    @click="handleClick"
  >
    商品佣金
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'Withdraw',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'withdraw',
        innerHTML: '[商品佣金]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
