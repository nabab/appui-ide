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
      console.log("dsddsrfr", this)
      return {
        repository: this.currentRep,
        repository_cfg: this.repositories[this.currentRep],
        is_mvc: this.isMVC,
        onlydirs: true,
        tab: this.obj.tab || false,
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
      console.log("dsddd",a);
      return a;
    },
    treeNodeActivate(d){
      const popup = bbn.vue.closest(this, ".bbn-popup");
      this.obj.path = d.data.path;
      popup.close();
    },
  },
  mounted(){
    bbn.fn.log("TREEEEE", this)
    this.$nextTick(() =>{
      $(this.$el).bbn('analyzeContent', true);
    });
  }
});