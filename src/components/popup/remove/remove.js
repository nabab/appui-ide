(()=>{
  return {
    created(){
      this.post(this.source.root + 'info_element', this.source, d => {
        this.list = d.list;
        this.listExts = d.exts;
      });
    },
    data(){
      return{
        list: [],
        formData: {
          all: true,
          ext:"",
          section: ""
        },
        listExts: {},
        showPannel:(this.source.is_component && this.source.data.isComponent && !this.source.only_component) || this.source.is_mvc ? true : false,
        btns: [
          'cancel',
          {
            text: bbn._("Delete"),
            class:"bbn-primary",
            icon: 'nf nf-fa-trash',
            action: ()=>{
              this.getRef('form').submit();
            }
        }]
      }
    },
    computed:{
      exts(){
        if ( this.formData.section.length ){
          return [ this.listExts[this.formData.section] ];
        }
        return [];
      },
      message(){
        let text = '';
        if ( this.formData.all ){
          text += bbn._('Are you sure you want to delete all') + ' ' + this.source.name + ' ?';
        }
        else{
          text += bbn._('Are you sure you want to delete') + ' ';
          // files mvc or  files components
          if ( (this.source.is_file) ||
            (this.source.is_component && this.source.data.isComponent && !this.source.only_component)
          ){
            if (  this.formData.ext !== "" ){
              text += bbn._('file') + ' : ' + this.source.name + this.formData.ext + '?';
            }
          }
          //folders mvc
          else if ( !this.source.is_file && this.source.is_mvc ) {
            if (  this.formData.section !== "" ){
              text += bbn._('the folder' ) + ' in: ' + this.formData.section + ' ? ';
            }
          }
          // only component
          else if ( this.source.is_component && this.source.data.isComponent && this.source.only_component){
            text += bbn._('the component') + ' ' + this.source.name + ' ? ';
          }
        }
        return text;
      }
    },
    methods:{
      loaded(){
        this.$nextTick(() => {
          if ( this.exts.length ){
            this.formData.ext = this.exts[0].value;
          }
        });
      },
      failureRemove(){
        appui.error(bbn._("Error!"));
      },
      successremoveElement(){
        let editor = this.closest('bbn-container').find('appui-ide-editor');
       // if ( this.formData.all ){
          let key = 'file/' + editor.currentRep;

          if ( this.source.is_mvc ){
            key += '/mvc/' + this.source.data.dir + this.source.data.name + '/_end_';
          }
          else if ( this.source.is_component ){
            key += this.source.data.path + '/_end_';
          }

          let idx = editor.getRef('tabstrip').getIndex(key);


          this.$nextTick(()=>{
            if ( idx != false ){
              if ( this.formData.all ){
                editor.getRef('tabstrip').close(idx);
              }// if delete only tab
              else{
                editor.getRef('tabstrip').reload(idx);
              }
            }
          });
        //}

        this.$nextTick(()=>{
          if ( editor.tempNodeofTree !== false ){
            editor.tempNodeofTree.closest('bbn-tree').reload();
            editor.tempNodeofTree = false;
          }
        });
        appui.success(bbn._("Deleted!"));
      }
    }
  }
})();
