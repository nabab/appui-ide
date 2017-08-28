/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */
Vue.component('appui-ide-history', {
  template: '#bbn-tpl-component-appui-ide-history',
  props: ['source'],
  data(){
    return $.extend({
      selected: '',
      mode: '',
      code: ''
    }, this.source);
  },
  methods: {
    treeLoad(){
      if ( this.repository &&
        this.repositories[this.repository] &&
        this.repositories[this.repository].bbn_path &&
        this.repositories[this.repository].path &&
        (this.path !== undefined) &&
        this.filename
      ){
        const url = this.repositories[this.repository].bbn_path + '/' +
          this.repositories[this.repository].path +
          (this.path ? this.path + '/' : '') +
          this.filename;
        return bbn.fn.post(this.root + 'history/tree', {
          url: url,
          is_mvc: this.isMVC,
          ext: !this.isMVC && this.ext ? this.ext : false
        }).promise().then((pd) => {
          return pd.data;
        });
      }
    },
    treeNodeActivate(id, d, n){
      if ( !n.folder ){
        this.selected = n.key;
        this.code = d.code;
        this.mode = d.mode;
        this.$forceUpdate();
      }
    }
  },
  mounted(){
    this.$nextTick(() => {
      $(this.$el).bbn('analyzeContent', true);
    });
  }
});