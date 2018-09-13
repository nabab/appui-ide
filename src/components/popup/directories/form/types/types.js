(() => {
  return {
    props: ['source'],
    data(){
      let show = '',
          tabs = '',
          exts = '';
      //case edit type
      if( this.source.row.id && this.source.row.id.length ){
        tabs = JSON.parse(this.source.row.tabs),
        exts = JSON.parse(this.source.row.extensions);
      }
      //case duplicate type
      else if ( (this.source.row.id && !this.source.row.id.length)  &&
        (this.source.row.tabs.length || this.source.row.extensions.length)
      ){
        tabs = this.source.row.tabs.length ? JSON.parse(this.source.row.tabs) : [];
        exts = this.source.row.extensions.length ? JSON.parse( this.source.row.extensions) : [];
      }//case add type
      else{
        tabs = "";
        exts = "";
      }

      if ( tabs.length ){
        show = "tabs"
      }
      if ( exts.length ){
        show = "exts"
      }

      return {
        show: show,
        jsonSchemaExtension: {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "ext": {
                "type": "string"
              },
              "mode": {
                "type": "string"
              },
              "default": {
                "type": "string"
              }
            },
            "required": ["ext", "mode"]
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
                "$ref": "exts"
              }
            },
            "required": ["title", "path", "url", "extensions"]
          }
        }
      }
    },
    computed:{
      formAction(){
        return appui.ide.source.root + "directories/actions/types/" + (this.source.row.id ? 'edit' : 'add');
      },
      isTabs(){
        return this.show === "tabs";
      },
      isExts(){
        return this.show === "exts";
      },
      cfgEditor(){
        if ( this.isExts ){
          return {
            schema: this.jsonSchemaExtension,
            templates: this.jsonDataTemplate
          };
        }
        if ( this.isTabs ){
          return {
            schema: this.jsonSchemaTab,
            schemaRefs: { exts : this.jsonSchemaExtension },
            templates: this.jsonDataTemplate
          };
        }
        return {}
      },
      jsonDataTemplate(){
        if ( this.isTabs || this.isExts ){
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
          return arr;
        }
        return [];
      },
    },
    methods:{
      success(){
        this.types.refreshListTypes();
        appui.success(bbn._("success"));
      },
      failure(){
        appui.error(bbn._("Error"));
      },
      validation(d){
        var tabs = [];
        var exts = [];

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
      }
    },
    watch: {
      show(val){
        let originalData =  bbn.vue.find(this, 'bbn-form').originalData;
        if( val === 'tabs' ){
          this.source.row.tabs = originalData.tabs;
          this.source.row.extensions = JSON.stringify([]);
        }
        if( val === 'exts' ){
          this.source.row.extensions = originalData.extensions;
          this.source.row.tabs = JSON.stringify([]);
        }
        this.$nextTick(() => {
          if ( this.$refs.jsonEditor ){
           this.$refs.jsonEditor.reinit();
          }
        });
      }
    }
  }
})();
