/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */
(() => {
  return {
    data(){
      return {
        new_name: this.source.data.name,
        new_ext: '',
        new_path: this.source.data.dir === "" ? "./" :
         (this.source.isMVC && this.source.data.tab.length ? this.source.data.tab+'/'+this.source.data.dir : this.source.data.dir),
        //pathTree: false
      }
    },
    methods: {
      onSuccess(){
        //const tab = this.closest("bbn-container");
        if ( this.new_path === './' ){
          appui.ide.getRef('filesList').reload();
        }
        else{
          if ( this.source.parent ){
            this.source.parent.reload();
          }
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
        this.closest("bbn-container").getRef('popup').open({
          width: 300,
          height: 400,
          title: bbn._('Path'),
          component: 'appui-ide-popup-path',
          source: $.extend(this.$data, {
            operation: 'copy',
            isComponent: this.source.isComponent,
            isMvc: this.source.isMVC,
            rep: this.source.repository,
            data: this.source.data
          })
        });
      }/*,
      setRoot(){
        this.newPath = './';
      },
      */
    },
    computed: {
      isFile(){
        return !this.source.data.folder && !this.source.isComponent
      },
      extensions(){
        let res = [];
        if ( !this.isMVC ){
          $.each(this.source.repositories[this.source.currentRep].extensions, (i, v) => {
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
          path: this.source.data.dir,
          repository: this.source.repositories[this.source.currentRep],
          name: this.source.data.name,
          ext: this.source.data.ext,
          is_mvc: this.source.isMVC,
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
      bbn.fn.log("mouted copy", this);
    }
  }
})();
