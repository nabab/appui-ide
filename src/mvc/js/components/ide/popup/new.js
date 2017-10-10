/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */

Vue.component('appui-ide-popup-new', {
  template: '#bbn-tpl-component-appui-ide-popup-new',
  props: ['source'],
  data(){
    return {
      tab:'',
      name: '',
      extension: '',
      path: this.source && (this.source.path === './')  ? this.source.path : this.source.path + '/',
      is_file: this.source.isFile,
    }
  },
  methods: {
    successActive(){
      if ( this.source.isFile ){
        bbn.fn.link(this.source.root + 'editor/file/' + this.source.currentRep +
          (this.path.startsWith('./') ? this.path.slice(2) : this.path) +
          this.name + '/_end_' + ( this.extension.length ? '/' +  this.extension : '')
        );
        appui.success(bbn._("File created!"));
      }
      else{
        appui.success(bbn._("Directory created!"));
      }
      bbn.vue.closest(this, ".bbn-popup").close();
      const tab = bbn.vue.closest(this, ".bbn-tab");
    },
    failureActive(){
      appui.error(bbn._("Error!"));
    },
    selectDir(){
      bbn.vue.closest(this, ".bbn-tab").$refs.popup[0].open({
        width: 300,
        height: 400,
        title: bbn._('Path'),
        component: 'appui-ide-popup-path',
        source: $.extend(this.$data, {operation: 'create'})
      });
    },

    close(){
      alert("close");
      const popup = bbn.vue.closest(this, ".bbn-popup");
      popup.close();
      //popup.close(popup.num - 1);
    }
  },

  computed: {
    types(){
      let res = [];
      if ( this.isMVC ){
        $.each(this.source.repositories[this.source.currentRep].tabs, (i, v) => {
          if ( !v.fixed ){
            res.push({
              text: v.title,
              value: i
            });
          }
        });
      }
      return res;
    },
    isMVC(){
      return (this.source.repositories[this.source.currentRep] !== undefined ) && (this.source.repositories[this.source.currentRep].tabs !== undefined);
    },
    rep(){
      if ( this.isMVC ){
        return this.source.repositories[this.source.currentRep];
      }
      return false
    },
    ext(){
      if ( this.isMVC ){
        return this.tab.length ? this.source.repositories[this.source.currentRep].tabs[this.tab].extensions : false;
      }
      return false
    },
    formData(){
      return {
        tab_path: this.isMVC && this.rep.tabs[this.tab] ? this.rep.tabs[this.tab].path : '',
        default_text: bbn.fn.get_field(this.ext, 'ext', this.tab, 'default') || '' ,
        repository: this.source.repositories[this.source.currentRep]
      }
    },
    extensions(){
      let res = [],
          ext;
      if ( this.source.isFile ){
        if ( this.isMVC ){
          ext = this.tab.length ? this.source.repositories[this.source.currentRep].tabs[this.tab].extensions : false;
        }
        else {
          ext = this.source.repositories[this.source.currentRep].extensions;
        }
        if ( ext.length ){
          $.each(ext, (i, v) =>{
            res.push({
              text: '.' + v.ext,
              value: v.ext
            });
          });

          setTimeout(() =>{
            this.extension = this.extensions[0].value;
           }, 100);

        }
      }
      return res;
    }
  },

});