import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import tanmaDesign from 'tanma-design';
import 'tanma-design/lib/index.less';
import "@/assets/base.less";

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(tanmaDesign);
new Vue({
  render: h => h(App),
}).$mount('#app')
