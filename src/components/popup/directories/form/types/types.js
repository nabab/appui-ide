(() => {
  return {
    props: ['source'],
    data(){
      let show = '',
          tabs = '',
          exts = '',
          types = '';
      if ( this.source.row.id && (this.source.row.id.length || !this.source.row.id.length) ){
        tabs = (this.source.row.tabs !== undefined && this.source.row.tabs.length) ? JSON.parse(this.source.row.tabs) : [];
        exts = (this.source.row.extensions !== undefined && this.source.row.extensions.length) ? JSON.parse(this.source.row.extensions) : [];
        types = (this.source.row.types !== undefined && this.source.row.types.length) ? JSON.parse(this.source.row.types) : [];
      }

      if ( tabs.length ){
        show = "tabs";
      }
      if ( exts.length ){
        show = "exts";
      }
      if ( types.length ){
        show = "types";
      }

      return {
        tabSelected: false,
        extension: false,
        show: show,
        jsonSchemaExtension: {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "ext": {
                "type": "string",
                "readonly": true
              },
              "mode": {
                "type": "string",
                "readonly": true
              },
              "default": {
                "type": "string",
                "readonly": true
              }
            },
            "required": ["ext", "mode"],

          }
        },
        jsonSchemaTab: {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string"
              },
              "path": {
                "type": "string"
              },
              "url": {
                "type": "string"
              },
              "fcolor": {
                "type": "string"
              },
              "bcolor": {
                "type": "string"
              },
              "default": {
                "type": "boolean"
              },
              "extensions": {
                "$ref": "exts",
                "readonly": true
              }
            },
            "required": ["title", "path", "url", "extensions"]
          }
        },
        jsonSchemaProject: {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string"
              },
              "path": {
                "type": "string"
              },
              "type": {
                "type": "string"
              },
              "bcolor": {
                "type": "string"
              },
              "fcolor": {
                "type": "string"
              }
            },
            "required": ["path", "url", "type"]
          }
        }
      }
    },
    computed:{
      isTabs(){
        return this.show === "tabs";
      },
      isExts(){
        return this.show === "exts";
      },
      isProject(){
        return this.show === "types";
      },
      listTabs(){
        if ( this.source.row.tabs !== undefined && this.source.row.tabs.length ){
          return JSON.parse(this.source.row.tabs);
        }
        return [];
      },
      extensions(){
        if ( this.source.row.extensions !== undefined && this.source.row.extensions.length ){
          return JSON.parse(this.source.row.extensions);
        }
        return [];
      },
      tabs(){
        let arr = [];
        if ( this.listTabs.length ){
            arr =  this.listTabs.map( obj =>{
             return {
               text: obj.title,
               value: obj.title,
             }
           });
        }
        return arr;
      },
      listExtensions(){
        let listExts = [];
        if ( (this.isTabs === true) &&
          (this.listTabs.length > 0) &&
          this.tabSelected
        ){
          let exts = bbn.fn.getField(this.listTabs, 'extensions', 'title', this.tabSelected);
          if ( exts.length ){
            listExts = exts.map( obj =>{
              return {
                text: obj.ext,
                value: obj.ext,
              }
            });
          }
        }
        else if( this.isExts === true ){
          listExts = this.extensions.map( obj =>{
            return {
              text: obj.ext,
              value: obj.ext,
            }
          });
        }
        return listExts;
      },
      formAction(){
        return this.closest('bbn-container').find('appui-ide-editor').source.root + "directories/actions/types/" + (this.source.row.id ? 'edit' : 'add');
      },
      cfgEditor(){
        if ( this.isExts ){
          return {
            schema: this.jsonSchemaExtension,
            templates: this.jsonDataTemplate,
          };
        }
        if ( this.isTabs ){
          return {
            schema: this.jsonSchemaTab,
            schemaRefs: { exts : this.jsonSchemaExtension },
            templates: this.jsonDataTemplate
          };
        }
        if ( this.isProject ){
          return {
            schema: this.jsonSchemaProject,
            templates: this.jsonDataTemplate
          };
        }
        return {}
      },
      jsonDataTemplate(){
        if ( this.isTabs || this.isExts || this.isType ){
          let arr = [{
            text: bbn._('Extensions'),
            title: bbn._('Insert a new extension'),
            className: 'jsoneditor-type-object',
            value: {
              ext: '',
              mode: '',
              default: '',
            }
          }];
          if ( this.isTabs ){
            arr.unshift({
              text: bbn._('Tab'),
              title: bbn._('Insert a new tab'),
              className: 'jsoneditor-type-object',
              value: {
                title: bbn._('Insert a title'),
                path: bbn._("Insert a path"),
                url:  bbn._("Insert a url"),
                fcolor: "",
                bcolor: "",
                default: false,
                extensions: [{
                  ext: '',
                  mode: '',
                  default: '',
                }]
              }
            });
          }
          if ( this.isType ){
            arr = [{
              text: bbn._('Types'),
              title: bbn._('Insert a new type'),
              className: 'jsoneditor-type-object',
              value: {
                url: bbn._("Insert a url"),
                path: bbn._("Insert a path"),
                type: bbn._("Insert a link to a type"),
                bcolor: "",
                fcolor: ""
              }
            }];
          }
          return arr;
        }
        return [];
      },
    },
    methods:{
      openFormExtensions(action){
        let exts = [];
        let id = -1;
        let src;
        let idExtension = -1;
        ///case tabs
        if( this.isTabs === true ){
          if ( this.listTabs.length && this.tabSelected ){
            exts = bbn.fn.getField(this.listTabs, 'extensions', 'title', this.tabSelected);
            id = bbn.fn.search(this.listTabs, 'title', this.tabSelected);
            idExtension = bbn.fn.search(this.listTabs[id]['extensions'], 'ext', this.extension);
          }
          if ( (exts.length > 0) && (id > -1) ){
            src = {
              action: action,
              type: this.show,
              tab: this.tabSelected,
              listTabs: this.listTabs,
              extesionsTab: exts,
              idTab: id,
              idExt: idExtension === -1 ? false : idExtension,
              extension:{
                ext: action === 'edit' ? exts[idExtension].ext : '',
                mode: action === 'edit' ? exts[idExtension].mode : '',
                default: action === 'edit' ? exts[idExtension].default : ''
              }
            };
          }
        }
        //case extensions (code)
        else if ( this.isExts === true ){
          if ( this.extensions.length > 0 ){
            id = bbn.fn.search(this.extensions, 'ext', this.extension);
          }
          else{
            id = 0;
          }
          if ( id > -1 ){
            src = {
              action: action,
              type: this.show,
              extesionsTab: this.extensions,
              idExt: id === -1 ? false : id,
              extension:{
                ext: action === 'edit' ? this.extensions[id].ext : '',
                mode: action === 'edit' ? this.extensions[id].mode : '',
                default: action === 'edit' ? this.extensions[id].default : ''
              }
            };
          }
        }

        if (src) {
          this.getPopup({
            width: 800,
            height: 600,
            label: action === 'edit' ? bbn._('Edit Extension') : bbn._('Add Extension'),
            component: 'appui-ide-form-extension',
            source: src
          });
        }

      },
      editExtension(){
        this.openFormExtensions('edit');
      },
      createExtension(){
        this.openFormExtensions('create');
      },
      deleteExtension(){
        if ( this.extension !== false ){
          if ( this.isTabs ){
            if ( this.listTabs.length && this.tabSelected ){
              let id = bbn.fn.search(this.listTabs, 'title', this.tabSelected);
              if ( id > -1 ){
                let idExtension = bbn.fn.search(this.listTabs[id]['extensions'], 'ext', this.extension);
                if ( idExtension > -1 ){
                  let tabs = this.listTabs.slice();
                  tabs[id]['extensions'].splice(idExtension, 1);
                  this.$set(this.source.row, 'tabs' , JSON.stringify(tabs));
                  let jsonEditor = this.getRef('jsonEditor');
                  if (jsonEditor) {
                    jsonEditor.reinit();
                  }
                }
              }
            }
          }
          else if ( this.isExts ){
            if ( this.extensions.length > 0 ){
              let id = bbn.fn.search(this.extensions, 'title', this.extension);
              if ( id > -1 ){
                let exts = this.extensions.slice();
                exts.splice(id, 1);
                this.$set(this.source.row, 'tabs' , JSON.stringify(exts));
                this.getRef('jsonEditor').reinit();
              }
            }
          }
        }

      },
      success(){
        this.closest('bbn-container').find('appui-ide-popup-directories-types').refreshListTypes();
        appui.success(bbn._("success"));
      },
      failure(){
        appui.error(bbn._("Error"));
      },
      validation(d){
        var tabs = [],
            exts = [];

        if ( this.source.row.tabs ){
          tabs = JSON.parse(this.source.row.tabs);
        }

        if ( this.source.row.extensions ){
          exts = JSON.parse(this.source.row.extensions);
        }

        if ( ((d.tabs && !d.tabs.length ) && (d.extensions && !d.extensions.length)) ||
          (d.tabs && !d.tabs.length) ||
          (d.extensions && !d.extensions.length) ||
          (tabs.length && exts.length)
        ){

          return false
        }

        if( d.tabs && tabs.length){
          if ( d.extensions ){
            delete d.extensions
          }
        }
        if( d.extensions && exts.length ){
          if ( d.tabs ){
            delete d.tabs
          }
        }
        return true;
      },
      getPopup() {
        return this.closest('bbn-container').getPopup(...arguments);
      }
    },
    watch: {
      show(val){
        let originalData =  this.find('bbn-form').originalData;
        if( val === 'tabs' ){
          this.source.row.tabs = originalData.tabs;
          this.source.row.extensions = JSON.stringify([]);
          this.source.row.types = JSON.stringify([]);
        }
        if( val === 'exts' ){
          this.source.row.extensions = originalData.extensions;
          this.source.row.tabs = JSON.stringify([]);
          this.source.row.types = JSON.stringify([]);
        }
        if( val === 'types' ){
          this.source.row.types = originalData.types;
          this.source.row.tabs = JSON.stringify([]);
          this.source.row.extensions = JSON.stringify([]);
        }
        this.$nextTick(() => {
          if ( this.getRef('jsonEditor') ){
           this.getRef('jsonEditor').reinit();
          }
        });
      }
    }
  }
})();
