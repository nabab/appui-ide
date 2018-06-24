// Javascript Document


Vue.component('appui-ide-popup-new', {
  template: '#bbn-tpl-component-appui-ide-popup-new',
  props: ['source'],
  data(){
    let rep = this.source.repositories[this.source.currentRep],
      isMVC = (rep !== undefined ) && (rep.tabs !== undefined) && (rep.alias_code !== "component"),
      defaultTab = '',
      defaultExt = '';
    if ( rep.tabs ){
      $.each(rep.tabs, (k, a) => {
        if ( a.default ){
          defaultTab = k;
          if ( this.source.isFile ){
            defaultExt = a.extensions[0].ext;
          }
        }
      });
    }
    return {
      isMVC: isMVC,
      isComponent: (rep !== undefined ) && (rep.tabs !== undefined) && (rep.alias_code === "component"),
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
          this.data.name + '/_end_' + ( this.data.extension ? '/' +  this.rep.tabs[this.data.tab]['url'] : '')
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
        this.source.parent.reload();
      }
    },
    failureActive(){
      appui.error(bbn._("Error!"));
    },
    selectDir(){
      bbn.vue.closest(this, ".bbns-tab").$refs.popup[0].open({
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
          this.data.extension = this.rep.tabs[this.data.tab].extensions[0].ext;
          return this.rep.tabs[this.data.tab].extensions
        }
		    else{
          this.numExt = 0;
          this.numExt = this.rep.extensions.length;
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
    defaultText(){
      if ( this.availableExtensions ){
       for ( let i  in  this.availableExtensions ){
         if ( this.availableExtensions[i].ext === this.data.extension ){
           return this.availableExtensions[i].default;
         }
       };
      }
      return false
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
        let arr= [];
        for ( let obj of this.availableExtensions ){
          arr.push( {text: obj.ext, value: obj.ext} );
        }
        return arr;
      }
      return [];
    }
  }
});
