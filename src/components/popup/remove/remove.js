(()=>{
  return {
    created(){
      bbn.fn.post(this.source.root + 'info_element', this.source, d => {
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
        showPannel:(this.source.is_component && this.source.data.is_vue && !this.source.only_component) || this.source.is_mvc ? true : false,
        btns: [
          'cancel',
          {
            text: bbn._("Delete"),
            class:"k-primary",
            icon: 'fas fa-trash',
            command: ()=>{
              this.$refs.form.submit();
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
        let text = bbn._('Are you sure you want to delete') + ' ';

        if ( this.formData.all ){
          text += bbn._('all') + ' ' + this.source.name + '?';
        }
        else{
          // files mvc or  files components
          if ( (this.source.is_file) ||
            (this.source.is_component && this.source.data.is_vue && !this.source.only_component)
          ){
            if (  this.formData.ext !== "" ){
              text += bbn._('file') + ':' + this.source.name + this.formData.ext + '?';
            }
          }
          //folders mvc
          else if ( !this.source.is_file && this.source.is_mvc ) {
            if (  this.formData.section !== "" ){
              text += bbn._('the folder' ) + ' in: ' + this.formData.section + '?';
            }
          }
          // only component
          else if ( this.source.is_component && this.source.data.is_vue && this.source.only_component){
            text += bbn._('the component') + ' ' + this.source.name + '?';
          }
        }
        return text;
      },

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
        let editor = bbn.vue.closest(this, "bbns-tab").getComponent();

        if ( this.all ){
          let key = 'file/' + appui.ide.currentRep;

          if ( this.source.is_mvc ){
            key += 'mvc/' + this.source.data.dir + this.source.data.name + '/_end_';
          }
          else if ( this.source.is_component ){
            key += this.source.data.path + '/_end_';
          }

          let idx = editor.$refs.tabstrip.getIndex(key);


          this.$nextTick(()=>{
            if ( idx != false ){
              editor.$refs.tabstrip.close(idx);
            }
          });
        }

        this.$nextTick(()=>{
          if ( editor.tempNodeofTree !== false ){
            bbn.vue.closest(editor.tempNodeofTree, 'bbn-tree').reload();
            editor.tempNodeofTree = false;
          }
        });

        appui.success(bbn._("Deleted!"));
      }
    }
  }
})();
