/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/08/2017
 * Time: 11:53
 */
Vue.component('appui-ide-popup-path', {
  template: '#bbn-tpl-component-appui-ide-popup-path',
  props: ['source'],
  data(){
    return this.source;
  },
  methods: {
    isMVC(){
      return (this.repositories[this.currentRep] !== undefined ) && (this.repositories[this.currentRep].tabs !== undefined);
    },
    treeLoad(e, n, tab){
      return bbn.fn.post(this.root + "tree/", {
        repository: this.currentRep,
        repository_cfg: this.repositories[this.currentRep],
        is_mvc: this.isMVC(),
        path: n.node.data.path || '',
        onlydirs: true,
        tab: tab || false
      }).promise().then((pd) => {
        return pd.data;
      });
    },
    treeNodeActivate(id, d){
      const popup = bbn.vue.closest(this, ".bbn-popup");
      this.newPath = d.path;
      popup.close(popup.num - 1);
    },
    treeLazyLoad(e, d){
      d.result = this.treeLoad(e, d);
    },
  },
  mounted(){
    this.$nextTick(() => {
      setTimeout(() => {
        $(this.$el).bbn('analyzeContent', true);
      }, 100);
    });
  }
});