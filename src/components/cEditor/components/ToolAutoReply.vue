<template>
  <div class="autoReply">
    <div
      class="toolbar-item autoReplyName"
      @click="handleClick"
    >
      自动回复
    </div>

    <!-- 自动回复设置 -->
    <tm-dialog
      title="自动回复设置"
      v-model="showDialog"
      width="600px"
      append-to-body
      @closed="handleDialogClosed"
      @ok="handleSaveSetting"
    >
      <div class="insert-content">
        <!-- 功能介绍模块 -->
        <div class="function-tip-block">
          <div class="tip-title">
            功能介绍：用户点击链接文案，自动给公众号发送消息。
          </div>
          <div class="tip-item">
            由于微信限制，用户扫码后，必须回复消息，公众号才能在48小时内自动给客户发送消息（限20条）；
          </div>
          <div class="tip-item">
            通过以下设置，仅需用户点击链接文案，即可实现自动给公众号自动发送消息（激活公众号在48小时内可以给用户自动发送20条消息）
          </div>
        </div>
        <div class="insert-item">
          <tm-title
            class="title-area"
            title="设置链接文案"
            title-size="16"
            tips="需要用户点击的文案展示"
          />
          <el-input
            v-model.trim="linkLabel"
            placeholder=""
            size="normal"
            clearable
            show-word-limit
            maxlength="20"
          ></el-input>
        </div>
        <div class="insert-item">
          <tm-title
            class="title-area"
            title="设置回复内容"
            title-size="16"
            tips="点击后，用户自动给公众号发送的内容"
          />
          <el-input
            v-model.trim="replayContent"
            placeholder=""
            size="normal"
            clearable
            show-word-limit
            maxlength="20"
          ></el-input>
        </div>
      </div>
    </tm-dialog>
  </div>
</template>

<script>
import { createElement } from './util';

const AUTO_REPLY_ID = 'autoReply'

export default {
  name: 'AutoReply',
  props: {
    type: {
      type: String,
      default: ''
    },
    target: {
      type: Element,
      default: () => ({})
    }
  },
  data () {
    return {
      isEditor: false,
      showDialog: false,
      linkLabel: '点击参与活动',
      replayContent: '我要参与活动'
    }
  },
  watch: {
    type: {
      deep: true,
      handler (newValue) {
        if (newValue === AUTO_REPLY_ID) {
          const dataset = this.target.dataset

          this.isEditor = true
          this.linkLabel = dataset.autoreplyLabel
          this.replayContent = dataset.autoreplyContent
          this.showDialog = true
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClick () {
      this.showDialog = true
    },
    handleDialogClosed () {
      this.linkLabel = '点击参与活动'
      this.replayContent = '我要参与活动'
      this.isEditor = false
      this.$emit('update:type', '')
    },
    handleSaveSetting () {
      const { linkLabel, replayContent } = this

      // 校验
      if (!linkLabel) {
        return this.$message('请设置链接文案', 'warning')
      }
      if (!replayContent) {
        return this.$message('请设置回复内容', 'warning')
      }

      // 编辑状态
      if (this.isEditor) {
        const path = `weixin://bizmsgmenu?msgmenucontent=${replayContent}&msgmenuid=0`

        this.target.innerHTML = `[${linkLabel}]`
        this.target.dataset.autoreplyLabel = linkLabel
        this.target.dataset.autoreplyContent = replayContent
        this.target.dataset.autoreplyPath = path
        /**
         * 触发编辑事件
         * target 当前element 信息
         * type: 当前组件类型
         */
        this.$emit('edit', this.target, AUTO_REPLY_ID)
        this.showDialog = false
        return
      }

      const path = `weixin://bizmsgmenu?msgmenucontent=${replayContent}&msgmenuid=0`
      const contentElement = createElement({
        type: AUTO_REPLY_ID,
        innerHTML: `[${linkLabel}]`,
        dataset: {
          [`${AUTO_REPLY_ID}-label`]: linkLabel,
          [`${AUTO_REPLY_ID}-content`]: replayContent,
          [`${AUTO_REPLY_ID}-path`]: path
        }
      })
      this.showDialog = false
      this.$emit('insert', contentElement);
    }
  }
}
</script>

<style lang="less" scoped>
.insert-content {
  .function-tip-block {
    padding: 18px 20px;
    border-radius: 5px;
    background-color: #F5F5FA;

    .tip-title {
      margin-bottom: 16px;
      color: var(--g-normal-font-color);
      font-size: 16px;
      font-weight: bold;
    }

    .tip-item {
      color: #858598;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
