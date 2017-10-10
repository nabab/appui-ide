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
    return {
      root: appui.ide.root
    }
  },
  computed:{
    treeInitialData(e){
      return {
        repository: appui.ide.currentRep,
        repository_cfg: appui.ide.repositories[appui.ide.currentRep],
        is_mvc: this.isMVC,
        onlydirs: true,
        tab: this.source.tab || false,
      };
    },
    isMVC(){
      return (appui.ide.repositories[appui.ide.currentRep] !== undefined ) && (appui.ide.repositories[appui.ide.currentRep].tabs !== undefined);
    },
  },
  methods: {
    treeMapper(a){
      if ( a.folder ){
        $.extend(a, {
          repository: appui.ide.currentRep,
          repository_cfg: appui.ide.repositories[appui.ide.currentRep],
          onlydirs: true,
          tab: this.source.tab || false,
          is_mvc: this.isMVC
        });
      }
      return a;
    },
    treeNodeActivate(d){
      const popup = bbn.vue.closest(this, ".bbn-popup");
      let path_destination = d.data.path.endsWith('/') ?  d.data.path :  d.data.path + '/';

      switch ( this.source.operation ){
        case 'copy':{
          this.source.new_path = path_destination;
        }
        break;
        case 'create':{
          this.source.path =  path_destination;
        }
          break;
      }

      //this.source.path =  d.data.path.endsWith('/') ?  d.data.path :  d.data.path + '/';
      popup.close();
    },
  },

});