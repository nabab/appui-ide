/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */
(() => {
  return {
    data(){
      let path = ""
      if  ( this.source.data.dir === "" ){
        if ( this.source.isProject && this.source.type ){
          path = this.source.type + '/';
        }
        else{
          path =  './';
        }
      }
      else if ( this.source.isMVC && this.source.data.tab.length ){
        path =  this.source.data.tab + '/' + this.source.data.dir;
      }
      else{
        path =  this.source.data.dir;
      }
      return {
        new_name: this.source.data.name,
        new_ext: '',
        //new_path: this.source.data.dir === "" ? "./" :
         //(this.source.isMVC && this.source.data.tab.length ? this.source.data.tab+'/'+this.source.data.dir : this.source.data.dir),
        //new_path: path
        new_path: this.source.data.dir,
        //pathTree: false
      }
    },
    methods: {
      onSuccess(){
        let componentEditor = this.closest('bbn-container').find('appui-ide-editor');
        //const tab = this.closest("bbn-container");
        if ( componentEditor.nodeParent !== false ){
          componentEditor.nodeParent.reload();
          this.$nextTick(()=>{
            componentEditor.$set(componentEditor, 'nodeParent', false);
          });
        }
        else{
          componentEditor.getRef('filesList').reload();
        }
        if ( this.isFile && !this.source.isMVC ){
          appui.success(bbn._("Copy file succesfully!"));
        }
        else{
          appui.success(bbn._("Copy succesfully!"));
        }
        this.$nextTick(() => {
          bbn.vue.closest(this, ".bbn-popup").close();
        });
      },
      failureActive(){
        appui.error(bbn._("Error!"));
        bbn.vue.closest(this, ".bbn-popup").close();
      },
      selectDir(){
        this.getPopup().open({
          width: 300,
          height: 400,
          title: bbn._('Path'),
          component: 'appui-ide-popup-path',
          source: bbn.fn.extend(this.$data, {
            operation: 'copy',
            isComponent: this.source.isComponent,
            isMVC: this.source.isMVC,
            rep: this.source.repository,
            data: {
              path: this.new_path
            },
            type: this.source.data.type
          })
        });
      },
      getRoot(){
        if ( this.source.isProject && this.source.type ){
          this.new_path = this.source.type + '/';
        }
        else{
          this.new_path = './';
        }
      }
    },
    computed: {
      isFile(){
        return !this.source.data.folder && !this.source.isComponent
      },
      extensions(){
        let res = [];
        if ( !this.source.isMVC ){
          bbn.fn.each(this.source.repositories[this.source.currentRep].extensions, (v, i) => {
            res.push({
              text: '.' + v.ext,
              value: v.ext
            });
          });
        }
        return res;
      },
      formData(){
        let obj = {
          is_project: this.source.isProject,
          path: this.source.data.dir,
          repository: this.source.repository,
          name: this.source.data.name,
          ext: this.source.data.ext,
          is_mvc: this.source.isMVC,
          type: this.source.type,
          is_file: this.isFile,
          is_component: this.source.isComponent
        }
        if ( this.source.repository['types'] !== undefined ){
          obj.component_vue =  this.source.component_vue;
          obj.only_component = this.source.only_component;
        }
        return obj;
      }
    },
    mounted(){
      if ( this.isFile ){
        this.new_ext = this.source.data.ext === undefined ? '' : this.source.data.ext;
      }
    }
  }
})();
