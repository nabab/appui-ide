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
    onSuccess(){
      //const tab = bbn.vue.closest(this, ".bbn-tab");
      if ( this.isFile && !this.isMvc ){
        appui.success(bbn._("Copy file succesfully!"));
      }
      else{
        appui.success(bbn._("Copy succesfully!"));
      }
      this.source.parent.reload();
      this.$nextTick(()=>{
        bbn.vue.closest(this, ".bbn-popup").close();
      });
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
     return this.source.isMVC
    },
    isFile(){
      return !this.source.data.folder
    },
    extensions(){
      let res = [];
      if ( !this.isMVC ){
        $.each(this.source.repositories[this.source.currentRep].extensions, (i, v) =>{
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
