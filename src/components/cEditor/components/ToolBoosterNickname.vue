<template>
  <div
    class="toolbar-item booster-nickname"
    @click="handleClick"
  >
    助力好友昵称
  </div>
</template>

<script>
import { createElement } from './util';
export default {
  name: 'BoosterNickname',
  methods: {
    handleClick () {
      const contentElement = createElement({
        type: 'boosterNickname',
        innerHTML: '[助力好友昵称]'
      }, false)
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
