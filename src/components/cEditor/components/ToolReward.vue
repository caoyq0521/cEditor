<template>
  <div class="reward">
    <el-popover
      placement="top"
      :trigger="trigger">
      <div slot="reference" class="toolbar-item">奖品</div>
      <div class="reward-level">
        <div
          class="f-csp reward-level-item"
          v-for="item in list"
          :key="item.id"
          @click="handleRewardLevelClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </el-popover>
    <!-- 插入奖品显示文案 -->
    <tm-dialog
      :title="insertRewardTitle"
      v-model="showInsertReward"
      width="600px"
      @closed="handleDialogClosed"
      @ok="handleInsertReward"
    >
      <div class="insert-content">
        <div class="insert-item">
          <tm-title class="title-area" title="显示文案" title-size="16" />
          <el-input
            v-model.trim="rewardText"
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
const REWARD_FIELD = 'reward';
const list = [
  {
    id: 'one',
    name: '插入一级任务奖品',
    level: 1
  },
  {
    id: 'two',
    name: '插入二级任务奖品',
    level: 2
  },
  {
    id: 'three',
    name: '插入三级任务奖品',
    level: 3
  }
]
export default {
  name: 'Reward',
  props: {
    type: {
      type: String,
      default: ''
    },
    target: {
      type: Element,
      default: () => ({})
    },
    trigger: {
      type: String
    },
    maxLevel: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      showInsertReward: false,
      isEditor: false,
      insertRewardTitle: '',
      rewardText: '点击查看奖品'
    }
  },
  computed: {
    list () {
      return list.slice(0, this.maxLevel)
    }
  },
  watch: {
    type: {
      deep: true,
      handler (newValue) {
        if (newValue === REWARD_FIELD) {
          this.isEditor = true;
          const { rewardDialogTitle, rewardText } = this.target.dataset;
          this.insertRewardTitle = rewardDialogTitle;
          this.rewardText = rewardText;
          this.showInsertReward = true;
        }
      },
      immediate: true
    }
  },
  methods: {
    handleRewardLevelClick (item) {
      this.insertRewardTitle = item.name;
      this.rewardLevel = item.level;
      this.showInsertReward = true;
    },
    handleInsertReward () {
      if (!this.rewardText) {
        this.$message('请输入显示文案', 'warning');
        return;
      }
      if (this.isEditor) {
        this.target.innerHTML = `[${this.rewardText}]`;
        this.target.dataset.rewardDialogTitle = this.insertRewardTitle;
        this.target.dataset.rewardText = this.rewardText;
        /**
         * 触发编辑事件
         * target 当前element 信息
         * type: 当前组件类型
         */
        this.$emit('edit', this.target, REWARD_FIELD);
      } else {
        const contentElement = createElement({
          innerHTML: `[${this.rewardText}]`,
          type: REWARD_FIELD,
          dataset: {
            [`${REWARD_FIELD}-dialog-title`]: this.insertRewardTitle,
            [`${REWARD_FIELD}-text`]: this.rewardText,
            [`${REWARD_FIELD}-level`]: this.rewardLevel
          }
        })
        this.$emit('insert', contentElement);
      }
      this.showInsertReward = false;
    },
    handleDialogClosed () {
      this.rewardText = '点击查看奖品';
      this.isEditor = false;
      this.$emit('update:type', '');
    }
  }
}
</script>

<style lang="less" scoped>
.reward-level {
  padding: 10px 0;
  text-align: center;
  .reward-level-item {
    line-height: 1.5;
  }
  .reward-level-item:not(:last-child){
    margin-bottom: 10px;
  }
}
</style>
