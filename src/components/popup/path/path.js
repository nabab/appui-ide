/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/08/2017
 * Time: 11:53
 */

(() => {
  return {
    data(){
      return {
        root: appui.ide.root
      }
    },
    computed: {
      treeInitialData(){
        return {
          repository: appui.ide.currentRep,
          repository_cfg: this.source.rep,
          is_mvc: this.isMVC,
          is_component: this.source.isComponent,
          onlydirs: true,
          all_content: true,
          tab: this.source.tab || false,
          path: this.source.data.path,
          type: this.source.type || false
        };
      },
      isMVC(){
        // return ((appui.ide.repositories[appui.ide.currentRep] !== undefined) && (appui.ide.repositories[appui.ide.currentRep].tabs !== undefined)) && (this.source.isMVC === true);
        return (appui.ide.repositories[appui.ide.currentRep] !== undefined) &&  (this.source.rep.tabs !== undefined) && (this.source.isMVC === true);
      },
    },
    methods: {
      treeMapper(a){
        if ( a.folder ){
          $.extend(a, {
            repository: appui.ide.currentRep,
            repository_cfg: this.source.rep,
            onlydirs: true,
            tab: this.source.tab || false,
            is_mvc: this.isMVC,
            is_component: this.source.isComponent,
          });
        }
        return a;
      },
      treeNodeActivate(d){
        const popup = bbn.vue.closest(this, "bbn-popup");
        let path_destination = d.data.path.endsWith('/') ? d.data.path : d.data.path + '/';
        if ( ((this.source.rep.alias_code === "bbn-project") && (d.type === 'components')) || this.source.isComponent === true ){
          if ( d.data.is_vue === true ){
            if (  path_destination.indexOf(d.data.name + '/' + d.data.name + '/') > -1 ){
              path_destination = path_destination.replace( d.data.name + '/' + d.data.name, d.data.name + '/');
            }
          }
        }
        //check path
        path_destination = path_destination.replace( '//',  '/');

        switch ( this.source.operation ){
          case 'copy':{
            this.source.new_path = path_destination;
            //  this.source.pathTree = d.parent;
          }
            break;
          case 'create':{
            this.source.data.path = path_destination;
          }
            break;
        }

        //this.source.path =  d.data.path.endsWith('/') ?  d.data.path :  d.data.path + '/';
        popup.close();
      },
    },

  }
})();

/*return {
  repository: appui.ide.currentRep,
  repository_cfg: appui.ide.repositories[appui.ide.currentRep],
  is_mvc: this.isMVC,
  isComponent: this.source.isComponent,
  content_component: this.source.isComponent,
  types_repositoy: this.source.rep.types !== undefined,
  content_mvc: this.isMVC,
  onlydirs: true,
  tab: this.source.tab || false,
};*/
