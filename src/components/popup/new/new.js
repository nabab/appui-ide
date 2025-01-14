(() => {
  return {
    mixins: [bbn.cp.mixins.basic, bbn.cp.mixins.localStorage],
    props: {
      storage: {
        default: true
      },
      storageFullName: {
        default: 'appui-ide-popup-new'
      }
    },
    data() {
      let rep =  this.source.type !== false ? this.source.repositoryProject : this.source.repositories[this.source.currentRep];
      let defaultTab = 0;
      let defaultExt = '';
      let storage = this.getStorage();
      let template = storage.template || 'file';
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
        bbn.fn.log("EXTENSIONS", rep.extensions)
        defaultExt = rep.extensions[0].ext;
      }
      return {
        isMVC: ((rep !== undefined) && (rep.tabs !== undefined) && ((rep.alias_code !== "components") && (rep.alias_code !== "bbn-project"))) || ((rep !== undefined) && (this.source.type === "mvc")),
        isComponent: ((rep !== undefined) && (rep.tabs !== undefined) && ((rep.alias_code === "components") && (rep.alias_code !== "bbn-project"))) || (this.source.type === "components"),
        rep: rep,
        type:  this.source.type || false,
        templates: [
          {value: 'mvc_vue', text: bbn._('Page with Vue component')},
          {value: 'mvc_js', text: bbn._('Page with Javascript function')},
          {value: 'mvc', text: bbn._('Simple page (combo)')},
          {value: 'action', text: bbn._('Action')},
          {value: 'file', text: bbn._('Single MVC file')}
        ],
        data: {
          tab: ((this.source.tab_mvc !== undefined) && this.source.tab_mvc.length && (this.source.type === 'mvc')) ?
                  bbn.fn.search(rep.tabs, 'url', this.source.tab_mvc) :
                  defaultTab,
          name: '',
          controller: '',
          model: '',
          html: '',
          js: '',
          css: '',
          container: '',
          class: '',
          template: template,
          extension: defaultExt,
          is_file: this.source.isFile,
          type: this.source.type || false,
          path: (this.source.path === './') ? './' : this.source.path + (this.source.path.slice(-1) !== '/' ? '/' : ''),
          id_project: this.source.id_project
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
          bbn.fn.each(this.rep.tabs, (v, i) => {
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
          for ( let i in this.availableExtensions ){
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
          tab_url: this.isMVC && this.rep && this.rep.tabs[this.data.tab] ? this.rep.tabs[this.data.tab].url : '',
          default_text: this.defaultText,
          repository: this.rep,
          type: this.source.type
        }
      },
      extensions(){
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
      hasFileDetails(){
        return this.data.template && !['file', 'action'].includes(this.data.template);
      },
    },
    methods: {
      onChangeTemplate() {
        this.$nextTick(() => {
          this.closest('bbn-floater').fullResize();
        });
      },
      onSuccess() {
        let  componentEditor = this.closest('bbn-container').find('appui-ide-editor');
        if ( this.source.isFile ){
          let link = appui.plugins['appui-project'] + '/ui/' + this.source.project.id + '/' + 'ide/file/' + this.source.currentRep + '/' + (this.source.type === 'mvc' ? this.source.type + '/' : '')
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
        if ( (this.data.path === './')  ||
          (this.data.path === 'components/') ||
          (this.data.path === 'mvc/') ||
          (this.data.path === 'lib/') ||
          (this.data.path === 'cli/') ||
          (this.source.parent === false)
        ){
          componentEditor.treeReload();
        }
        else{
          if ( componentEditor.nodeParent !== false ){
            componentEditor.nodeParent.reload();
            this.$nextTick(()=>{
              componentEditor.$set(componentEditor, 'nodeParent', false);
            });
          }
          //this.source.parent.reload();
        }
      },
      failureActive(){
        appui.error(bbn._("Error!"));
      },
      selectDir(){
        this.closest("bbn-container").getPopup({
          width: 300,
          height: 400,
          label: bbn._('Path'),
          component: 'appui-ide-popup-path',
          componentOptions: {
            source: this.$dataValues,
            operation: 'create'
          }
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
    mounted(){
      this.window = this.closest('bbn-floater');
    },
    watch: {
      "data.template"(v){
        if (this.window) {
          this.window.onResize(true)
        }

        if (!this.data.name) {
          this.$refs.filename.focus();
        }

        let storage = this.getStorage();
        if (!storage) {
          storage = {};
        }
        bbn.fn.log("TEMPLATE", storage, v);
        if (v !== storage.template) {
          storage.template = v;
          this.setStorage(storage);
        }
      }
    }
  }
})();
