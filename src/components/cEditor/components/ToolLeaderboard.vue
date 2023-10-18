<template>
  <div class="leaderboard">
    <div
      class="toolbar-item"
      @click="handleClick"
    >
      助力排行/领奖
    </div>
    <!-- 插入排行榜显示文案 -->
    <tm-dialog
      title="插入排行榜"
      v-model="showInsertLeaderboard"
      width="600px"
      @closed="handleDialogClosed"
      @ok="handleInsertLeaderboard"
    >
      <div class="insert-content">
        <div class="insert-item">
          <tm-title class="title-area" title="显示文案" title-size="16" />
          <el-input
            v-model.trim="leaderboardText"
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
const LEADERBOARD_FIELD = 'leaderboard'
export default {
  name: 'Leaderboard',
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
      showInsertLeaderboard: false,
      leaderboardText: '戳此查看好友助力详情及排行榜'
    }
  },
  watch: {
    type: {
      deep: true,
      handler (newValue) {
        if (newValue === LEADERBOARD_FIELD) {
          this.isEditor = true;
          const { leaderboardText } = this.target.dataset;
          this.leaderboardText = leaderboardText;
          this.showInsertLeaderboard = true;
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClick () {
      this.showInsertLeaderboard = true;
    },
    handleInsertLeaderboard () {
      if (!this.leaderboardText) {
        this.$message('请输入显示文案', 'warning');
        return;
      }
      if (this.isEditor) {
        this.target.innerHTML = `[${this.leaderboardText}]`;
        this.target.dataset.leaderboardText = this.leaderboardText;
        /**
         * 触发编辑事件
         * target 当前element 信息
         * type: 当前组件类型
         */
        this.$emit('edit', this.target, LEADERBOARD_FIELD);
      } else {
        const contentElement = createElement({
          innerHTML: `[${this.leaderboardText}]`,
          type: LEADERBOARD_FIELD,
          dataset: {
            [`${LEADERBOARD_FIELD}-text`]: this.leaderboardText
          }
        })
        this.$emit('insert', contentElement);
      }
      this.showInsertLeaderboard = false;
    },
    handleDialogClosed () {
      this.leaderboardText = '戳此查看好友助力详情及排行榜';
      this.isEditor = false;
      this.$emit('update:type', '');
    }
  }
}
</script>

<style lang="less" scoped>
</style>
