/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/08/2017
 * Time: 11:53
 */

(() => {
  return {
    props: {
      operation: {
        type: String,
        required: true
      },
      source: {
        type: Object,
        required: true
      }
    },
    data(){
      return {
        root: this.closest('bbn-container').find('appui-ide-editor').root
      }
    },
    computed: {
      path(){
        if ( this.source.data.path === './' ){
          if ( this.source.type !== undefined ){
            if ( this.source.isComponent ){
              return "components/";
            }
            else if ( this.isMVC ){
              return "mvc/";
            }
            else{
              return "lib/";
            }
          }
          return "";
        }
        return this.source.data.path;
      },
      treeInitialData(){
        return {
          repository: this.closest('bbn-container').find('appui-ide-editor').currentRep,
          repository_cfg: this.source.rep,
          is_mvc: this.isMVC,
          is_component: this.source.isComponent,
          onlydirs: true,
          tree_popup: true,
          tab: this.source.tab || false,
          uid: this.path,
          type: this.source.type || false
        };
      },
      isMVC(){
        return this.source.isMvc || this.source.isMVC
      },
    },
    methods: {
      treeMapper(a){
        if ( a.folder ){
          bbn.fn.extend(a, {
            repository: this.closest('bbn-container').find('appui-ide-editor').currentRep,
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
        let popup = this.closest("bbn-popup"),
            path_destination = d.data.uid.endsWith('/') ? d.data.uid : d.data.uid + '/';
        // if the path starts with the backslash it is removed
        if ( path_destination.indexOf('/') === 0 ){
          path_destination = path_destination.substring(1);
        }
        if ( ((this.source.rep.alias_code === "bbn-project") && (d.type === 'components')) || this.source.isComponent === true ){
          if ( d.data.is_vue === true ){
            if (  path_destination.indexOf(d.data.name + '/' + d.data.name + '/') > -1 ){
              path_destination = path_destination.replace( d.data.name + '/' + d.data.name, d.data.name + '/');
            }
          }
        }
        //check path
        path_destination = path_destination.replace( '//',  '/');
        bbn.fn.log("aaa", path_destination, this.operation)
        switch ( this.operation ){
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

        popup.close();
      },
    },

  }
})();
