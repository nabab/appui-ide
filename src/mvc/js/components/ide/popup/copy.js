/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */
Vue.component('appui-ide-popup-copy', {
  template: '#bbn-tpl-component-appui-ide-popup-copy',
  props: ['source'],
  data(){
    return {
      new_name: this.source.data.name,
      new_ext: '',
      new_path: this.source.data.dir === "" ? "./" : this.source.data.dir
    }
  },
  methods: {
    successActive(){
      //const tab = bbn.vue.closest(this, ".bbn-tab");
      if ( this.isFile && !this.isMvc ){
        appui.success(bbn._("Copy file succesfully!"));
      }
      else{
        appui.success(bbn._("Copy succesfully!"));
      }

      appui.ide.treeReload();
      bbn.vue.closest(this, ".bbn-popup").close();
      //this.source.treeParent.reload();
      /*  $.each(tab.$children, (i, v) => {
       if ( v.$refs.filesList &&
       v.$refs.filesList.widgetName &&
       (v.$refs.filesList.widgetName === 'fancytree')
       ){
       const node = v.$refs.filesList.widget.getNodeByKey(this.fData.key),
       path = this.fData.path.split('/');
       node.data.name = this.newName;
       if ( this.isFile ){
       node.data.ext = this.newExt;
       }
       path.pop();
       path.push(this.newName);
       node.data.path = path.join('/');
       node.setTitle(this.newName);
       node.render(true);

       }*/
      /* v.$refs.filesList.reload();*/
      //bbn.vue.closest(this, ".bbn-tab").$children[0].$refs.filesList.reload();
    },
    failureActive(){
      appui.error(bbn._("Error!"));
      bbn.vue.closest(this, ".bbn-popup").close();
    },

    selectDir(){
      bbn.vue.closest(this, ".bbn-tab").$refs.popup[0].open({
        width: 300,
        height: 400,
        title: bbn._('Path'),
        component: 'appui-ide-popup-path',
        source: $.extend(this.$data, {operation: 'copy'})
      });
    }/*,
    setRoot(){
      this.newPath = './';
    },
    */
  },
  computed: {
    isMVC(){
     return (this.source.repositories[this.source.currentRep] !== undefined ) &&
       (this.source.repositories[this.source.currentRep].tabs !== undefined);
    },
    isFile(){
      return !this.source.data.folder
    },
    extensions(){
      let res = [];
      if ( this.isMVC ){
        $.each(appui.ide.repositories[appui.ide.currentRep].extensions, (i, v) =>{
          res.push({
            text: '.' + v.ext,
            value: v.ext
          });
        });
      }
      return res;
    },
    formData(){
      return{
        path: this.source.data.dir,
        repository: this.source.repositories[this.source.currentRep],
        name: this.source.data.name,
        ext: this.source.data.ext,
        is_mvc: this.isMVC,
        is_file: this.isFile
      }
    }
  },
  mounted(){
    if ( this.isFile ){
      this.new_ext = this.source.data.ext === undefined ? '' : this.source.data.ext;
    }
    bbn.fn.log("mouted copy", this);
  }
});
