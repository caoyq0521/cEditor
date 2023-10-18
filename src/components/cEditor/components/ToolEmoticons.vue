<template>
  <el-popover
    placement="top"
    ref="myPopover"
    :trigger="trigger">
    <div slot="reference" class="toolbar-item emoticons">表情</div>
    <emoji-picker @select="selectEmoji"></emoji-picker>
  </el-popover>
</template>

<script>
import EmojiPicker from '@/components/emojiPicker';
import { createElement } from './util';
export default {
  name: 'Emoticons',
  components: {
    EmojiPicker
  },
  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    insertText: {
      type: Boolean,
      defalut: false
    }
  },
  methods: {
    selectEmoji (emoji) {
      let content = ''
      if (this.insertText) {
        content = emoji.data
      } else {
        content = createElement({
          type: 'emoticons',
          innerHTML: emoji.data
        }, false)
      }

      this.$emit('insert', content);
      this.$refs.myPopover.doToggle()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
