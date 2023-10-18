<template>
  <div
    class="toolbar-item sales-friend-name"
    @click="handleClick"
  >
    好友昵称
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'SalesFriendName',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'salesFriendName',
        innerHTML: '[好友昵称]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
