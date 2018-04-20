(() => {
  return {
    props: ['source'],
    data(){
      return {
        show: !this.source.row.id ? '' : (this.source.row.extensions ? 'exts' : (this.source.row.tabs ? 'tabs' : ''))
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
        if ( this.isTabs || this.isExts ){
          return {
            schema: this.jsonSchema,
            templates: this.jsonDataTemplate
          };
        }
        return {}
      },
      jsonDataTemplate(){
        if ( this.isTabs || this.isExts ){
          let arr = [{
            text: bbn._('Extension'),
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
                  value: {
                    ext: '',
                    mode: '',
                    default: ''
                  }
                }]
              }
            });
          }
          return arr;
        }
        return [];
      },
      jsonSchema(){
        if ( this.isTabs ){
          return {
            "type": "object",
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
                  "type": "array",
                  "required": ["ext", "mode"],
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
                    }
                  }
                }
              },
              "required": ["title", "path", "url", "extension"]
            }
          };
        }
        else if ( this.isExts ){
          return {
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
          };
        }
        return {};
      }
    },
    methods:{
      success(){
        appui.success(bbn._("success"));
      },
      failure(){
        appui.error(bbn._("Error"));
      },
      validation(d){
        console.log("sssss", d, (d.tabs.length >0), d.tabs.length, d.extensions.length)
        d.tabs = d.tabs.length <= 2 ? "" : d.tabs;
        d.extensions = d.extensions.length <= 2 ? "" : d.extensions;
        if ( ((d.tabs && !d.tabs.length ) && (d.extensions && !d.extensions.length)) ||
          (d.tabs && !d.tabs.length) ||
          (d.extensions && !d.extensions.length)
        ){
          return false
        }
        if( d.tabs  && d.tabs.length ){
          d.tabs = JSON.parse(this.source.row.tabs);
          if ( d.extensions ){
            delete d.extensions
          }
        }
        alert();
        if( d.extensions  && d.extensions.length ){
          d.extensions = JSON.parse(this.source.row.extensions);
          if ( d.tabs ){
            delete d.tabs
          }
        }
        return true;
      }
    },
    watch: {
      show(){
        this.$nextTick(() => {
          if ( this.$refs.jsonEditor ){
           this.$refs.jsonEditor.reinit();
          }
        });
      }
    }
  }
})();
