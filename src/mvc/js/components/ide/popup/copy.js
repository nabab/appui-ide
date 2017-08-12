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
      newName: this.source.fData.name,
      newPath: this.source.fData.dir || './',
      newExt: ''
    }, this.source);
  },
  methods: {
    isMVC(){
      return (this.repositories[this.currentRep] !== undefined ) && (this.repositories[this.currentRep].tabs !== undefined);
    },
    extensions(){
      let res = [];
      if ( !this.isMVC() ){
        $.each(this.repositories[this.currentRep].extensions, (i, v) => {
          res.push({
            text: '.' + v.ext,
            value: v.ext
          });
        });
      }
      return res;
    },
    selectDir(){
      bbn.vue.closest(this, ".bbn-tab").popup({
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
      popup.close(popup.num - 1);
    },
    submit(){
      if ( (this.fData.name !== this.newName) ||
        (this.fData.dir !== this.newPath) ||
        (this.isFile && (this.newExt !== this.fData.ext))
      ){
        bbn.fn.post(this.root + 'actions/copy', {
          repository: this.repositories[this.currentRep],
          path: this.fData.dir,
          new_path: this.newPath,
          name: this.fData.name,
          new_name: this.newName,
          ext: this.fData.ext,
          new_ext: this.newExt,
          is_mvc: this.isMVC(),
          is_file: this.isFile
        }, d => {
          if ( d.success ){
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
            appui.success(bbn._("Renamed!"));
          }
          else {
            appui.error(bbn._("Error!"));
          }
        });
      }
    }
  },
  computed: {
    isFile(){
      return !this.fData.is_folder;
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