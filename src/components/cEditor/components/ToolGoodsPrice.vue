<template>
  <div
    class="toolbar-item goods-price"
    @click="handleClick"
  >
    商品价格
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'GoodsPrice',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'goodsPrice',
        innerHTML: '[商品价格]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
