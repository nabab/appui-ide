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
    const ide = bbn.vue.closest(bbn.vue.closest(this, '.bbn-tabnav'), '.bbn-tab').getComponent().$data;
    let path = this.source.url.substr(this.source.repository.length).replace('/_end_', '').split('/'),
        filename = path.pop();
    return $.extend(this.source, {
      repositories: ide.repositories,
      font: ide.font,
      font_size: ide.font_size,
      theme: ide.theme,
      root: ide.root,
      path: path.join('/'),
      filename: filename,
    });
  },
  mounted(){
    this.$nextTick(() => {
      $(this.$el).bbn('analyzeContent', true);
    });
  }
});