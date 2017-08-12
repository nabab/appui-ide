/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */
Vue.component('appui-ide-mvc', {
  template: '#bbn-tpl-component-appui-ide-mvc',
  props: ['source'],
  beforeMount(){
    bbn.vue.setComponentRule(this.source.root + 'components/', 'appui');
    bbn.vue.addComponent('ide/code');
    bbn.vue.unsetComponentRule();
  },
  data(){
    const vm = this,
          ide = bbn.vue.closest(bbn.vue.closest(vm, '.bbn-tabnav'), '.bbn-tab').getComponent().$data;
    let path = vm.source.url.substr(vm.source.repository.length).replace('/_end_', '').split('/'),
        filename = path.pop();
    return $.extend({}, vm.source, {
      repositories: ide.repositories,
      font: ide.font,
      font_size: ide.font_size,
      theme: ide.theme,
      root: ide.root,
      path: path.join('/'),
      filename: filename
    });
  },
  computed: {
    sctrl(){
      const vm = this;
      if ( vm.path.length ){
        return vm.path.split('/');
      }
      return [];
    }
  },
  mounted(){
    const vm = this;
    vm.$nextTick(() => {
      $(vm.$el).bbn('analyzeContent', true);
    });
  }
});