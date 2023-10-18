<template>
  <div id="app">
    <c-editor ref="cEditor"/>
    <!-- <tm-button
      type="primary"
      @click="getData"
    >
      获取 数据
    </tm-button> -->
  </div>
</template>

<script>
import CEditor from './components/cEditor';
export default {
  name: 'App',
  components: {
    CEditor
  },
  methods: {
    getData() {
      console.log(this.$refs.cEditor.getHtml());
    }
  },
}
</script>

<style lang="less">

#app {
  width: 900px;
  margin: 100px auto;
}
</style>
