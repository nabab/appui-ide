/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */
Vue.component('appui-ide-popup-copy', {
  template: '#bbn-tpl-component-appui-ide-popup-copy',
  props: ['source'],
  data(){
    return $.extend({
      path: '',
      newName: this.source.fData.data.name,
      path: this.source.fData.data.dir || './',
      newExt: ''
    }, this.source);
  },
  methods: {
    extensions(){
      let res = [];
      if ( this.isMVC ){
        $.each(this.repositories[this.currentRep].extensions, (i, v) =>{
          res.push({
            text: '.' + v.ext,
            value: v.ext
          });
        });
      }
      return res;
    },
    selectDir(){
      bbn.vue.closest(this, ".bbn-tab").$refs.popup[0].open({
        width: 300,
        height: 400,
        title: bbn._('Path'),
        component: 'appui-ide-popup-path',
        source: this.$data
      });
    },
    setRoot(){
      this.newPath = './';
    },
    close(){
      const popup = bbn.vue.closest(this, ".bbn-popup");
      popup.close();
    },
    submit(){
      console.log("dss", this);
     if ( (this.fData.data.name !== this.newName) ||
        (this.fData.data.dir !== this.path) ||
        (this.isFile && (this.newExt !== this.fData.data.ext))
      ){
         let obj =  {
           repository: this.repositories[this.currentRep],
           path: this.fData.data.dir,
           new_path: this.path,
           name: this.fData.data.name,
           new_name: this.newName,
           ext: this.fData.data.ext,
           new_ext: this.newExt,
           is_mvc: this.isMVC,
           is_file: this.isFile
         };
        console.log("copry", obj);

        bbn.fn.post(this.root + 'actions/copy', obj, ( d ) => {
          if ( d.success ){
            alert("success copy");
            const tab = bbn.vue.closest(this, ".bbn-tab");
            $.each(tab.$children, (i, v) => {
              if ( v.$refs.filesList &&
                v.$refs.filesList.widgetName &&
                (v.$refs.filesList.widgetName === 'fancytree')
              ){
                const node = v.$refs.filesList.widget.getNodeByKey(this.fData.key),
                      path = this.fData.path.split('/');
                node.data.name = this.newName;
                if ( this.isFile ){
                  node.data.ext = this.newExt;
                }
                path.pop();
                path.push(this.newName);
                node.data.path = path.join('/');
                node.setTitle(this.newName);
                node.render(true);

              }
            });
            this.close();
            appui.success(bbn._("Copy succesfully!"));
          }
          else {
            appui.error(bbn._("Error!"));
          }
        });
      }
    }
  },
  computed: {
    isMVC(){
     return (this.repositories[this.currentRep] !== undefined ) && (this.repositories[this.currentRep].tabs !== undefined);
    },
    isFile(){
      if ( this.fData.data.folder ){
        return false
      }
      else{
        return true;
      }
    }
  },
  mounted(){
    if ( this.isFile ){
      this.newExt = this.fData.ext;
    }
    this.$nextTick(() => {
      setTimeout(() => {
        $(this.$el).bbn('analyzeContent', true);
      }, 100);
    });
  }
});