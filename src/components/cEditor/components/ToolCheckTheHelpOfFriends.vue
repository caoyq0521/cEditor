<template>
  <div class="check-the-help-of-friends toolbar-item" @click="handleClick">戳此查看好友助力情况</div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'CheckTheHelpOfFriends',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'checkTheHelpOfFriends',
        innerHTML: '[戳此查看好友助力情况]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>
</style>
