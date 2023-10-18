<template>
  <div class="miniprogram">
    <div
      class="toolbar-item"
      @click="handleClick"
    >
      小程序
    </div>
    <!-- 插入小程序信息 -->
    <tm-dialog
      title="插入小程序"
      v-model="showInsertMiniProgram"
      width="600px"
      @closed="handleDialogClosed"
      @ok="handleInsertMiniProgram"
    >
      <div class="insert-content">
        <div class="insert-item">
          <tm-title
            class="title-area"
            title="小程序链接文本"
            title-size="16"
            tips="用户点击该段文本跳转到小程序链接"
            tipsSize="16"
            tipsInBrackets
          />
          <el-input
            v-model.trim="miniProgramlinkText"
            placeholder="请输入链接显示的文字"
            size="normal"
            clearable
            show-word-limit
            maxlength="20"
          ></el-input>
        </div>
        <div class="insert-item">
          <tm-title
            class="title-area"
            title="小程序APPID"
            title-size="16"
          />
          <el-input
            v-model.trim="miniProgramAppid"
            placeholder="请输入小程序APPID"
            size="normal"
            clearable
            show-word-limit
            maxlength="18"
          ></el-input>
        </div>
        <div class="insert-item">
          <tm-title
            class="title-area"
            title="小程序跳转路径"
            title-size="16"
          />
          <el-input
            v-model.trim="miniProgramPath"
            placeholder="请输入跳转的路径"
            size="normal"
            clearable
            show-word-limit
            maxlength="200"
          ></el-input>
        </div>
      </div>
    </tm-dialog>
  </div>
</template>

<script>
import { createElement } from './util';
const MINI_PROGRAM_FIELD = 'miniProgram';
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
      showInsertMiniProgram: false,
      miniProgramlinkText: '',
      miniProgramAppid: '',
      miniProgramPath: ''
    }
  },
  watch: {
    type: {
      deep: true,
      handler (newValue) {
        if (newValue === MINI_PROGRAM_FIELD) {
          this.isEditor = true;
          const { miniprogramAppid, miniprogramPath, miniprogramText } = this.target.dataset;
          this.miniProgramAppid = miniprogramAppid;
          this.miniProgramPath = miniprogramPath;
          this.miniProgramlinkText = miniprogramText;
          this.showInsertMiniProgram = true;
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClick () {
      this.showInsertMiniProgram = true;
    },
    handleInsertMiniProgram () {
      if (!this.miniProgramlinkText) {
        this.$message('请输入链接显示文字', 'warning');
        return;
      }
      if (!this.miniProgramAppid) {
        this.$message('请输入小程序APPID', 'warning');
        return;
      }
      if (!this.$tool.isValidAppId(this.miniProgramAppid)) {
        this.$message("请输入正确的APPID，例：wx550a169ba70fb787", "warning")
        return
      }
      if (!this.miniProgramPath) {
        this.$message('请输入跳转的路径', 'warning');
        return;
      }
      if (this.isEditor) {
        this.target.innerHTML = `[${this.miniProgramlinkText}]`;
        this.target.dataset.miniprogramAppid = this.miniProgramAppid;
        this.target.dataset.miniprogramPath = this.miniProgramPath;
        this.target.dataset.miniprogramText = this.miniProgramlinkText;
        /**
         * 触发编辑事件
         * target 当前element 信息
         * type: 当前组件类型
         */
        this.$emit('edit', this.target, MINI_PROGRAM_FIELD);
      } else {
        const contentElement = createElement({
          type: MINI_PROGRAM_FIELD,
          innerHTML: `[${this.miniProgramlinkText}]`,
          dataset: {
            [`${MINI_PROGRAM_FIELD}-appid`]: this.miniProgramAppid,
            [`${MINI_PROGRAM_FIELD}-path`]: this.miniProgramPath,
            [`${MINI_PROGRAM_FIELD}-text`]: this.miniProgramlinkText
          }
        })
        this.$emit('insert', contentElement);
      }
      this.showInsertMiniProgram = false;
    },
    handleDialogClosed () {
      this.miniProgramlinkText = '';
      this.miniProgramAppid = '';
      this.miniProgramPath = '';
      this.isEditor = false;
      this.$emit('update:type', '');
    }
  }
}
</script>

<style lang="less" scoped>

</style>
