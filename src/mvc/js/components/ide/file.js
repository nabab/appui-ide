/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */
Vue.component('appui-ide-file', {
  template: '#bbn-tpl-component-appui-ide-file',
  props: ['source'],
  data: function(){
    return this.source;
  },
  mounted: function(){
    var vm = this;
    bbn.fn.log('appui-ide-file',vm);
  }
});