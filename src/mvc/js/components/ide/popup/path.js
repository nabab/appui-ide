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
  computed:{
    treeInitialData(e){
      return {
        repository: this.currentRep,
        repository_cfg: this.repositories[this.currentRep],
        is_mvc: this.isMVC,
        onlydirs: true,
        tab: this.selectedType || false
      };
    },
    isMVC(){
      return (this.repositories[this.currentRep] !== undefined ) && (this.repositories[this.currentRep].tabs !== undefined);
    },
  },
  methods: {
    treeMapper(a){
      if ( a.folder ){
        $.extend(a, {
          repository: this.currentRep,
          repository_cfg: this.repositories[this.currentRep],
          onlydirs: true,
          tab: this.selectedType || false,
          is_mvc: this.isMVC,
          filter: this.searchFile
        });
      }
      return a;
    },
    treeNodeActivate(d){
      const popup = bbn.vue.closest(this, ".bbn-popup");
      this.source.path = d.data.path;
      popup.close();
    },
  },
  mounted(){
    this.$nextTick(() =>{
      $(this.$el).bbn('analyzeContent', true);
    });
  }
});