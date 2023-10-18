<template>
  <div
    class="toolbar-item nickname"
    @click="handleClick"
  >
    用户昵称
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'Nickname',
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
        content = "#用户昵称#"
      } else {
        content = createElement({
          type: 'nickname',
          innerHTML: '[用户昵称]'
        }, false)
      }
      this.$emit('insert', content);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
