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
    let rep = this.source.repositories[this.source.currentRep],
        isMVC = (rep !== undefined ) && (rep.tabs !== undefined),
        defaultTab = '',
        defaultExt = '';
    if ( rep.tabs ){
      $.each(rep.tabs, (k, a) => {
        if ( a.default ){
          defaultTab = k;
          if ( this.source.isFile ){
            defaultExt = a.extensions[0].mode;
          }
        }
      })
    }
    return {
      isMVC: isMVC,
      rep: rep,
      is_file: this.source.isFile,
      data: {
        tab: defaultTab,
        name: '',
        extension: defaultExt,
        is_file: this.source.isFile,
        path: this.source && (this.source.path === './')  ? this.source.path : this.source.path + '/'
      }
    }
  },
  methods: {
    onSuccess(){
      if ( this.source.isFile ){
        bbn.fn.link(this.source.root + 'editor/file/' + this.source.currentRep +
          (this.data.path.startsWith('./') ? this.data.path.slice(2) : this.data.path) +
          this.data.name + '/_end_' + ( this.data.extension ? '/' +  this.data.tab : '')
        );
        appui.success(bbn._("File created!"));
      }
      else{
        appui.success(bbn._("Directory created!"));
      }
      if ( this.data.path === './'){
        appui.ide.$refs.filesList.reload();
      }
      else{
        //if( this.source.parent && this.source.isFile ){
          this.source.parent.reload();
        //}
        /*else{
          bbn.fn.log("folder", this, this.source);
          bbn.fn.log("folder", bbn.vue.closest(this, 'bbn-tree'));
          alert();
        }*/
      }
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
    }
  },

  computed: {
    availableExtensions(){
      if ( this.rep && this.is_file ){
        if ( this.rep.tabs ){
          for ( let n in this.rep.tabs ){
            if ( this.rep.tabs[n].default ){
              return this.rep.tabs[n].extensions
            }
          }
				}
        else{
          return this.rep.extensions
        }
      }
      return [];
    },
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
    ext(){
      if ( this.isMVC ){
        return this.data.tab ? this.source.repositories[this.source.currentRep].tabs[this.data.tab].extensions : false;
      }
      else{
        if( this.data.extensions ){
          let res;
          for(let ext of this.source.repositories[this.source.currentRep]['extensions']){
            if ( ext.mode === this.extension){
              res = ext;
            }
          }
          return res;
        }
      }
      return false
    },
    defaultText(){
      if( this.ext ){
        if ( this.isMVC ){
          for ( let i in this.ext ){
            if ( this.data.extension === this.ext[i].mode ){
              return this.ext[i].default;
            }
          }
        }
        else{
          return this.ext.default;
        }
      }
    },
    formData(){
      return {
        tab_path: this.isMVC && this.rep && this.rep.tabs[this.data.tab] ? this.rep.tabs[this.data.tab].path : '',
        default_text: this.defaultText,
        repository: this.source.repositories[this.source.currentRep]
      }
    },

    extensions(){
      if ( this.availableExtensions ){
        return $.map((a) => { return {text: '.' + a.ext, value: a.ext};}, this.availableExtensions);
      }
      return [];
    }
  },

});
