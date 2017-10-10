/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */
  Vue.component('appui-ide-popup-rename', {
    template: '#bbn-tpl-component-appui-ide-popup-rename',
    props: ['source'],
    data(){
      return {
        new_name: this.source.nodeData.name,
        new_ext: ''
      }
    },
    methods: {
      close(){
        const popup = bbn.vue.closest(this, ".bbn-popup");
        popup.close();
      },
      successActive(){
        const tabStrip = appui.ide.$refs.tabstrip;
        let path = this.source.nodeData.path.split('/');
        if ( tabStrip ){
          var idx = tabStrip.getIndex('file/' + appui.ide.currentRep + this.source.nodeData.dir +  this.source.nodeData.name );

          if ( idx > -1 ){
            path.pop();
            path.push(this.new_name);
            tabStrip.tabs[idx]['title'] = path.join('/');
          }
        }
        appui.success(bbn._("Renamed!"));
      },
/*      submit(){
        if ( (this.newName !== this.fData.name) || (this.isFile && (this.newExt !== this.fData.ext)) ){
          let obj = {
            repository: this.repositories[this.currentRep],
            path: this.fData.dir,
            name: this.fData.name,
            new_name: this.newName,
            ext: this.fData.ext,
            new_ext: this.newExt,
            is_mvc: this.isMVC,
            is_file: this.isFile
          };
          bbn.fn.post(this.root + 'actions/rename', obj, (d) =>{
            if ( d.success ){
              const ide = bbn.vue.closest(this, ".bbn-tab").getComponent();
              const tabStrip = ide.$refs.tabstrip;
              const filesList = ide.$refs.filesList;
              const editor = ide.$refs.editor;

              if ( tabStrip ){
                var idx = tabStrip.getIndex('file/' + this.currentRep + obj.path + obj.name);

                if ( idx > -1 ){
                  console.log("editor",editor);
                  alert("esiste");
                }
              }
              if ( filesList && $.isFunction(filesList.reload) ){

                if ( this.isFile ){
                  filesList.reload();
                  this.fdata = obj;
                  this.fdata.ext = this.newExt;
                }
              }
              appui.success(bbn._("Renamed!"));
            }
            else {
              appui.error(bbn._("Error!"));
            }
            this.close();

          });
        }
      }*/
    },
    computed: {
      isFile(){
        return !this.source.nodeData.isFolder;
      },
      isMVC(){
        return (this.source.repositories[this.source.currentRep] !== undefined ) && (this.source.repositories[this.source.currentRep].tabs !== undefined);
      },
      extensions(){
        let res = [];
        if ( !this.isMVC ){
          $.each(this.source.repositories[this.source.currentRep].extensions, (i, v) =>{
            res.push({
              text: '.' + v.ext,
              value: v.ext
            });
          });
        }
        return res;
      },
      formData(){
       return{
         repository: this.source.repositories[this.source.currentRep],
         path: this.source.nodeData.dir,
         name: this.source.nodeData.name,
         ext: this.source.nodeData.ext,
         is_mvc: this.isMVC,
         is_file: this.isFile
       }
      }
    },
    mounted(){

      if ( this.isFile ){
        this.new_ext = this.source.nodeData.ext;
      }
    }
  });



/*
 Vue.component('appui-ide-popup-rename', {
 template: '#bbn-tpl-component-appui-ide-popup-rename',
 props: ['source'],
 data(){
 return $.extend({
 newName: this.source.fData.name,
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
 close(){
 const popup = bbn.vue.closest(this, ".bbn-popup");
 popup.close(popup.num - 1);
 },
 submit(){
 if ( (this.newName !== this.fData.name) || (this.isFile && (this.newExt !== this.fData.ext)) ){
 bbn.fn.post(this.root + 'actions/rename', {
 repository: this.repositories[this.currentRep],
 path: this.fData.dir,
 name: this.fData.name,
 new_name: this.newName,
 ext: this.fData.ext,
 new_ext: this.newExt,
 is_mvc: this.isMVC(),
 is_file: this.isFile
 }, d => {
 if ( d.success ){
 const tab = bbn.vue.closest(this, ".bbn-tab");
 console.log("Rename", tab, this);



 $.each(tab.$children, (i, v) => {
 if ( v.$refs.filesList &&
 v.$refs.filesList.widgetName &&
 (v.$refs.filesList.widgetName === 'fancytree')
 ){
 const node = v.$refs.filesList.widget.getNodeByKey(this.fData.key),
 path = this.fData.path.split('/');
 console.log("Rename", node, path);
 node.data.name = this.newName;
 if ( this.isFile ){
 node.data.ext = this.newExt;
 }
 path.pop();
 path.push(this.newName);
 node.data.path = path.join('/');
 node.setTitle(this.newName);
 node.render(true);*/
/*
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
 });*/














