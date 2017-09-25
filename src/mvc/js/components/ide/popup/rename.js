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
      return $.extend({
        newName: this.source.fData.name,
        newExt: ''
      }, this.source);
    },
    methods: {
      extensions(){
        let res = [];
        if ( !this.isMVC ){
          $.each(this.repositories[this.currentRep].extensions, (i, v) =>{
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
        popup.close();
      },
      submit(){
        if ( (this.newName !== this.fData.name) || (this.isFile && (this.newExt !== this.fData.ext)) ){
          let obj= {
            repository: this.repositories[this.currentRep],
            path: this.fData.dir,
            name: this.fData.name,
            new_name: this.newName,
            ext: this.fData.ext,
            new_ext: this.newExt,
            is_mvc: this.isMVC,
            is_file: this.isFile
          };
          bbn.fn.post(this.root + 'actions/rename', obj , (d) =>{
            if ( d.success ){
              const tab = bbn.vue.closest(this, ".bbn-tab");
              console.log("dsd", tab);
              alert("dsds");
              $.each(tab.$children, (i, v) =>{
                if (v.$refs.tabstrip){
                  console.log("dddd", v.getTab())
                  alert("dsdsds")
                }
                if ( v.$refs.filesList && $.isFunction(v.$refs.filesList.reload) ){
                 // var path = this.fData.path.split('/');
                  if ( this.isFile ){
                    v.$refs.filesList.reload();
                    this.fdata = obj;
                    this.fdata.ext = this.newExt;
                    this.close();
                    appui.success(bbn._("Renamed!"));
                  }
                 // path.pop();
                 // path.push(this.newName);
                }
              });

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
      },
      isMVC(){
        return (this.repositories[this.currentRep] !== undefined ) && (this.repositories[this.currentRep].tabs !== undefined);
      },
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














