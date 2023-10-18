<template>
  <div
    class="toolbar-item goods-name"
    @click="handleClick"
  >
    商品名称
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'GoodsName',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'goodsName',
        innerHTML: '[商品名称]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
