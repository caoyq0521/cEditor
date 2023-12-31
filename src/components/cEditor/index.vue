<template>
  <div class="c-editor-container">
    <div class="c-editor">
      <div class="toolbar-area">
        <div class="toolbar-label">插入：</div>
        <div class="toolbar-list">
          <template v-for="(item, index) in toolbars">
            <component
              :is="handleComponentName(item)"
              :key="index"
              :type.sync="type"
              :target="target"
              :trigger="handleComponentTrigger(item)"
              :maxLevel="maxLevel"
              :insertText="insertText"
              @insert="handleComponentInsert"
              @edit="handleComponentEdit"
            ></component>
          </template>
        </div>
      </div>
      <div
        ref="editorArea"
        class="editor-area"
        contenteditable="true"
        :placeholder="placeholder"
        :style="{height: editorHeight, color: color}"
        @click="handleEditorAreaClick"
        @focus.stop="handleSetLastEditRange"
        @blur.stop="handleSetLastEditRange"
        @paste="handlePaste"
        @keypress="handleKeypress"
        @input="handleInput"
        @compositionend="hendleCompositionend"
      ></div>
    </div>
    <div v-if="showWordLimit && maxlength" class="rich-text__count">{{ currentLength }}/{{ maxlength }}</div>
    <!-- 禁用遮罩 -->
    <div v-if="disabled" class="disabled-area"></div>
  </div>
</template>

<script>
/**
 * 工具信息
 * achieveDistance: 未完成任务量
 * achieveRequirement: 达成条件需要人数
 * achievement: 已完成任务量
 * boosterNickname: 助力好友昵称
 * checkTheHelpOfFriends: 戳此查看好友助力情况
 * emoticons: 表情
 * leaderboard: 排行榜
 * link: 链接
 * miniProgram: 小程序
 * nickname: 用户昵称
 * reward: 奖品
 * rewardRemaining: 库存剩余
 * activityName: 活动名称
 * salesNickName: 用户昵称
 * customerName: 客户昵称
 * salesTime: 当前时间
 * salesFriendName: 好友昵称
 * withdraw: 商品佣金
 * goodsName: 商品名称
 * goodsPrice: 商品价格
 * autoReply: 自动回复
 */
import toolsInfo from './components';
const COMPONENT_PREFIX = 'Tool';
const TRIGGER_METHODS = ['click', 'focus', 'hover', 'manual'];
export default {
  name: 'FissionRichText',
  components: {
    ...toolsInfo.ToolComponents
  },
  props: {
    // 工具栏
    toolbars: {
      type: Array,
      default: () => toolsInfo.allTools,
      validator (value) {
        return value.every(item => toolsInfo.allTools.includes(item));
      }
    },
    // 编辑区域高度
    height: {
      type: [Number, String],
      default: 400
    },
    // 输入文本的颜色
    color: {
      type: String,
      default: '#333333'
    },
    // 初始化内容
    content: {
      type: String,
      default: ''
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 编辑区域占位文本
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    // 最大输入长度
    maxlength: {
      type: Number,
      default: Infinity,
      validator (value) {
        return value > 0;
      }
    },
    // 是否显示输入字数统计
    showWordLimit: {
      type: Boolean,
      default: false
    },
    // 带弹出框工具的触发方式
    trigger: {
      type: String,
      default: 'hover',
      validator (value) {
        return TRIGGER_METHODS.includes(value);
      }
    },
    /* 工具 具体trigger 会覆盖 trigger参数的值 */
    // 表情工具 弹出框触发方式
    emoticonsTrigger: {
      type: String,
      default: 'click',
      validator (value) {
        return TRIGGER_METHODS.includes(value);
      }
    },
    // 库存剩余工具 弹出框触发方式
    rewardRemainingTrigger: {
      type: String,
      validator (value) {
        return TRIGGER_METHODS.includes(value);
      }
    },
    // 奖品工具 弹出框触发方式
    rewardTrigger: {
      type: String,
      validator (value) {
        return TRIGGER_METHODS.includes(value);
      }
    },
    // 达成条件需要人数工具 弹出框触发方式
    achieveRequirementTrigger: {
      type: String,
      validator (value) {
        return TRIGGER_METHODS.includes(value);
      }
    },
    // 未完成任务量工具 弹出框触发方式
    achieveDistanceTrigger: {
      type: String,
      validator (value) {
        return TRIGGER_METHODS.includes(value);
      }
    },
    // 当前最大层级
    maxLevel: {
      type: Number,
      default: 3
    },
    // 插入的是文本 #这种格式#
    insertText: {
      type: Boolean,
      defalut: false
    }
  },
  data () {
    return {
      CONTENT: '',
      type: '',
      target: null,
      currentLength: 0 // 输入内容字数
    }
  },
  computed: {
    editorHeight () {
      const height = parseInt(this.height);
      return `${height}px`;
    },
    handleComponentTrigger () {
      return (tool) => {
        let trigger;
        switch (tool) {
          case 'achieveDistance':
            trigger = this.achieveDistanceTrigger;
            break;
          case 'achieveRequirement':
            trigger = this.achieveRequirementTrigger;
            break;
          case 'emoticons':
            trigger = this.emoticonsTrigger;
            break;
          case 'reward':
            trigger = this.rewardTrigger;
            break;
          case 'rewardRemaining':
            trigger = this.rewardRemainingTrigger;
            break;
          default:
            break;
        }
        return trigger || this.trigger;
      }
    }
  },
  watch: {
    content: {
      handler (newValue) {
        this.$nextTick(() => {
          if (newValue && this.CONTENT !== newValue) {
            newValue = newValue.replace(/<br \/>|<br>|<\/br>/gm, '\n');
            this.CONTENT = newValue;
            this.$refs.editorArea.innerHTML = newValue;
          } else if (!newValue) {
            this.$refs.editorArea.innerHTML = '';
          }
          this.currentLength = this.getText().length;
        });
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 读取 html
     */
    getHtml () {
      let { innerHTML } = this.$refs.editorArea;
      innerHTML = innerHTML.replace(/\n/gm, '<br />');
      this.CONTENT = innerHTML;
      return innerHTML;
    },
    /**
     * 读取 text
     */
    getText () {
      const { innerText } = this.$refs.editorArea;
      return innerText;
    },
    /**
     * 处理组件插入事件
     * @param {Element} html 插入的节点信息
     */
    handleComponentInsert (html) {
      // 插入之后的文本长度
      const htmlLength = this.insertText ? html.length : html?.innerText?.length
      const insertAfterLength = this.currentLength + htmlLength;
      if (insertAfterLength > this.maxlength) {
        this.$message('文本内容超出限制', 'warning');
        return;
      }
      const selection = getSelection();
      if (this.insertText) {
        const { editorArea } = this.$refs;
        editorArea.innerHTML = editorArea.innerHTML += html
        this.handleChange();
        return
      } else {
        const { editorArea } = this.$refs;
        if (!this.lastEditRange) {
          editorArea.appendChild(html);
          this.handleChange();
          return;
        }
      }
      selection.removeAllRanges();
      selection.addRange(this.lastEditRange);
      const range = selection.getRangeAt(0);
      range.insertNode(html);
      // 把光标移动插入元素之后
      if (html) {
        range.setStartAfter(html);
      }
      // 光标开始和光标结束重叠
      range.collapse(true);
      // 清除选定对象的所有光标对象
      selection.removeAllRanges();
      // 插入新的光标对象
      selection.addRange(range);

      this.handleChange();
    },
    handleComponentEdit (target, type) {
      this.handleChange();
      this.$emit('edit', target, type);
    },
    /**
     * 可编辑区域点击事件
     * @param {Object} e
     */
    handleEditorAreaClick (e) {
      const { target } = e;
      const { type } = target.dataset;
      // 如果 type 存在，则说明是修改，去触发相应组件的编辑
      if (type) {
        this.type = type;
        this.target = target;
      } else {
        // 如果没有 type 则说明是光标聚焦
        this.handleSetLastEditRange();
      }
    },
    /**
     * 获取光标位置
     */
    handleSetLastEditRange () {
      const selection = window.getSelection();
      if (!selection.focusNode) return;
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      const { nextSibling, parentNode } = preSelectionRange.startContainer;
      /**
       * 如果没有相邻右节点并且父节点的标签名为 SPAN
       * 则说明当前编辑区域内容为空 or 最后的内容是不可编辑节点
       * 这时需要把光标放在最后
       */
      if (!nextSibling && parentNode.nodeName === 'SPAN') {
        range.selectNodeContents(this.$refs.editorArea);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      this.lastEditRange = preSelectionRange;
    },
    handleKeypress (event) {
      if (this.maxlength && (event.target.innerText.length >= this.maxlength)) {
        event.preventDefault();
      }
    },
    hendleCompositionend  (event) {
      if (!this.maxlength) { return }
      const diff = event.target.innerText.length - this.maxlength;
      if (diff > 0) {
        const range = document.createRange();
        const sel = window.getSelection();
        const offset = sel.anchorOffset;
        const node = sel.anchorNode;
        const text = node.textContent;
        range.selectNodeContents(node);
        sel.removeAllRanges();
        setTimeout(() => {
          sel.addRange(range);
          sel.extend(node, offset);
          document.execCommand('delete', false);
          document.execCommand(
            'insertText',
            false,
            text.substring(0, offset - diff)
          );
        }, 0);
      }
    },
    handlePaste (event) {
      if (!this.maxlength) return
      const clipboardData = event.clipboardData || window.clipboardData
      const pastedText = clipboardData.getData('text/plain')
      const content = event.target.innerText
      const contentLength = content.length
      const selectedText = this.getSelectedTextByElement(this.$refs.editorArea)
      const allowedPasteLength = this.maxlength - contentLength + selectedText.length
      const slicedPasteText = pastedText.substring(0, allowedPasteLength)

      event.preventDefault()
      document.execCommand('insertHTML', false, slicedPasteText)
    },
    getSelectedTextByElement (element) {
      let selectedText = ''

      if (document.activeElement === element) {
        selectedText = window.getSelection().toString()
      }

      return selectedText
    },
    handleInput (e) {
      /**
       * 处理内容有换行且全部删除后 innerHTML 中有一个 <br> 标签
       * 导致内容看起来为空而实际不为空的情况
       */
      const { innerHTML } = e.target;
      if (innerHTML.length === 4 && innerHTML === '<br>') {
        // 清空内容
        this.$refs.editorArea.innerHTML = '';
      }
      this.handleChange();
    },
    handleKeydown (e) {
      const { code, target } = e;
      if (code !== 'Backspace' && target.innerText.length >= this.maxlength) {
        e.preventDefault();
      }
    },
    handleChange () {
      const text = this.getText();
      this.currentLength = text.length;
      this.$emit('change', this.getHtml(), text);
    },
    /**
     * 处理组件名
     * @param {String} item 对外组件名
     * @returns {String} 拼接上 前缀的组件名
     */
    handleComponentName (item) {
      item = item.replace(/^([a-z])/, a => {
        return a.toUpperCase();
      });
      return `${COMPONENT_PREFIX}${item}`;
    }
  }
}
</script>

<style lang="less" scoped>
.c-editor-container {
  position: relative;
  .disabled-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    cursor: not-allowed;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.c-editor {
  border: 1px solid #d8d8d8;
  border-radius: 5px;
  background-color: #ffffff;
  overflow: hidden;
  .toolbar-area {
    display: flex;
    min-height: 40px;
    padding: 0 15px;
    border-bottom: 1px solid #d8d8d8;
    user-select: none;
    position: relative;

    .toolbar-label {
      position: relative;
      top: 12px;
      flex-shrink: 0;
      font-weight: 500;
    }

    .toolbar-list {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      padding: 4px 0;
      /deep/.toolbar-item {
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        margin: 4px;
        color: #3470ff;
        font-size: 12px;
        cursor: pointer;
        border-radius: 4px;
        background-color: rgba(52, 112, 255, 0.1);
      }
    }
  }
}
.editor-area {
  width: 100%;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  padding: 15px;
  line-height: 20px;
  cursor: text;
  word-break: break-all;
  white-space: pre-wrap;
  -webkit-user-modify: read-write-plaintext-only;
  user-modify: read-write-plaintext-only;
  -webkit-user-select: auto;
  outline: none;
  overflow-y: auto;
  &:empty::before{
    content: attr(placeholder);
    font-size: 14px;
    color: #CCC;
    line-height: 21px;
    padding-top: 10px;
  }
}
/deep/.editor-insert-item {
  line-height: 20px;
  color: #3470ff;
  font-size: 14px;
  font-weight: 500;
  border-radius: 5px;
  pointer-events: none;
}
/deep/.editor-insert-item-link {
  text-decoration: underline;
  pointer-events: auto;
}
/deep/.insert-content {
  padding: 0 22px;

  .insert-item:not(:last-child) {
    margin-bottom: 20px;
  }
  .title-area {
    margin-bottom: 10px;
  }
}

.rich-text__count {
  position: absolute;
  bottom: 5px;
  right: 10px;
  color: #909399;
  font-size: 12px;
  background: #fff;
}
</style>
