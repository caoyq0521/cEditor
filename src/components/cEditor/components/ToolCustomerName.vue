<template>
  <div
    class="toolbar-item customerName"
    @click="handleClick"
  >
    客户昵称
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'CustomerName',
  props: {
    insertText: {
      type: Boolean,
      defalut: false
    }
  },
  methods: {
    handleClick () {
      let content = ''
      if (this.insertText) {
        content = "#客户昵称#"
      } else {
        content = createElement({
          type: 'customerName',
          innerHTML: '#客户昵称#'
        }, false)
      }
      this.$emit('insert', content);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
