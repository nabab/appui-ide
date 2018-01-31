/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */

Vue.component('appui-ide-popup-search', {
  template: '#bbn-tpl-component-appui-ide-popup-search',
  props: ['source'],
  data(){
    return {
      search: "",
      matchCaseSearch: false
    }
  },
  methods: {
    close(){
      var popup = bbn.vue.closest(this, "bbn-popup");
      popup.close();
    },
    searchInFolder(){
      if( this.search.length > 0 ){
        this.$nextTick(()=>{
          bbn.fn.link(this.source.url+'/search/'+ this.source.repository +'_end_/'+ this.typeSearch +'/'+ 'folder' + '/'+ this.source.path +'/'+  this.search, true);
        });
        this.close();
      }
    }
  },
  computed: {
    typeSearch(){
      if( this.matchCaseSearch ){
        return bbn._('sensitive');
      }
      else{
        return bbn._('insensitive');
      }
    },
  }
});
