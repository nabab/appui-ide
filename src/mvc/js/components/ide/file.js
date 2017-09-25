/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */
Vue.component('appui-ide-file', {
  template: '#bbn-tpl-component-appui-ide-file',
  props: ['source'],
  beforeMount(){
    bbn.vue.setComponentRule(this.source.root + 'components/', 'appui');
    bbn.vue.addComponent('ide/code');
    bbn.vue.unsetComponentRule();
  },
  data(){
    const ide = bbn.vue.closest(bbn.vue.closest(vm, '.bbn-tabnav'), '.bbn-tab').getComponent().$data;
    let path = this.source.url.substr(this.source.repository.length).replace('/_end_', '').split('/'),
        filename = path.pop();
    return $.extend(this.source, {
      repositories: ide.repositories,
      font: ide.font,
      font_size: ide.font_size,
      theme: ide.theme,
      root: ide.root,
      path: path.join('/'),
      filename: filename
    });
  },
  mounted(){
    const vm = this;
    vm.$nextTick(() => {
      $(vm.$el).bbn('analyzeContent', true);
    });
  },
  computed: {
    /*isChangedCode(){

     //let ctrl = this.originalValue !== this.value;
      return "SASA"
    }*/
  }
});