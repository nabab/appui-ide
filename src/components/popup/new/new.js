(() => {
  return {
    data(){
      var rep =  this.source.type !== false ? this.source.repositoryProject : this.source.repositories[this.source.currentRep],
          defaultTab = '',
          defaultExt = '';
      if ( rep.tabs ){
        bbn.fn.each(rep.tabs, (a, k) => {
          if ( a.default ){
            defaultTab = k;
            if ( this.source.isFile ){
              defaultExt = a.extensions[0].ext;
            }
          }
        });
      }
      if ( this.source.isFile && rep.extensions ){
        defaultExt = rep.extensions[0].ext;
      }
      return {
        isMVC: ((rep !== undefined) && (rep.tabs !== undefined) && ((rep.alias_code !== "components") && (rep.alias_code !== "bbn-project"))) || ((rep !== undefined) && (this.source.type === "mvc")),
        isComponent: ((rep !== undefined) && (rep.tabs !== undefined) && ((rep.alias_code === "components") && (rep.alias_code !== "bbn-project"))) || (this.source.type === "components"),
        rep: rep,
        type:  this.source.type || false,
        data: {
          tab: defaultTab,
          name: '',
          extension: defaultExt,
          is_file: this.source.isFile,
          type: this.source.type || false,
          path: (this.source.path === './') ? './' : this.source.path + '/'
        }
      }
    },
    methods: {
      onSuccess(){
        if ( this.source.isFile ){
          let link = this.source.root + 'editor/file/' + this.source.currentRep +
            (this.isMVC && this.source.type === 'mvc' ? 'mvc/' : '');
          if ( this.data.path.startsWith('./') ){
            link += this.data.path.slice(2);
          }
          else if ( this.data.path.startsWith('mvc/') ){
            link += this.data.path.slice(4);
          }
          else{
            link += this.data.path;
          }
          link += this.data.name + (this.isComponent === true ? '/'+ this.data.name  : '' ) + '/_end_';
          if ( (this.data.tab > 0) && this.data.extension.length ){
            link += '/' + this.rep.tabs[this.data.tab]['url'];
          }
          else if ( (this.data.tab === 0) && this.data.extension ){
            link += '/code';
          }
          if ( link.indexOf('//') !== -1 ){
            link= link.replace('//', '/');
          }
          bbn.fn.link(link);
          appui.success(this.isComponent === true ? bbn._("Component created!") : bbn._("File created!"));
        }
        else{
          appui.success(bbn._("Directory created!"));
        }
        if ( (this.data.path === './')  || (this.source.parent === false) ){
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
        bbn.vue.closest(this, "bbns-tab").getPopup({
          width: 300,
          height: 400,
          title: bbn._('Path'),
          component: 'appui-ide-popup-path',
          source: $.extend(this.$data, {operation: 'create'})
        });
      },
      getRoot(){
        if ( this.source.isProject ){
          this.data.path = this.source.type + '/';
        }
        else{
          this.data.path = './';
        }
      }
    },
    computed: {
      availableExtensions(){
        if ( this.rep && this.source.isFile ){
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
        if ( this.isMVC || (this.source.isFile && this.isComponent) ){
          $.each(this.rep.tabs, (i, v) => {
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
          }
          ;
        }
        return false
      },
      formData(){
        return {
          tab_path: this.isMVC && this.rep && this.rep.tabs[this.data.tab] ? this.rep.tabs[this.data.tab].path : '',
          default_text: this.defaultText,
          repository: this.rep,
          type: this.source.type
        }
      },
      extensions(){
        if ( this.availableExtensions ){
          let arr = [];
          for ( let obj of this.availableExtensions ){
            arr.push({text: obj.ext, value: obj.ext});
          }
          return arr;
        }
        return [];
      }
    }
  }
})();
