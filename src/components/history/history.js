/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */

(() => {
  return {
    data(){
      return {
        selected: false,
        mode: '',
        code: '',
        url: '',
        treeLoad:false,
      }
    },
    methods: {
      //method map for component tree
      transform(a){
        return $.extend (a, {
          text: "name_file" in a ? a.text + ' &nbsp; <span class="w3-badge w3-small w3-light-grey">' +   a.numChildren  + '</span>' : a.text,
          num: a.numChildren || 0,
          type: "name_file" in a  ? "" : a.text
        });
      },
      //  click in node file for to make a post and upload its content
      treeNodeActivate(node){
        if ( this.selected ){
          this.selected = false;
        }
        setTimeout(() =>{
          if ( node.data.folder === false ){
            bbn.fn.post(this.source.root + 'history/tree',{
              url: node.data.path + "/" + node.data.file + "." + node.data.ext ,
            }, d=>{
              if( d.data.success ){
                this.selected = true;
                this.code = d.data.code;
                this.mode = node.data.mode;
                this.$forceUpdate();
              }
            });
          }
        }, 300);
      }
    },
    computed: {
      //Initial configuration object for the tree component
      initialData(){
        if( this.url.length ){
          return {
            repository: this.source.repository,
            repository_cfg: this.source.repositories[this.source.repository],
            is_mvc: this.source.isMVC,
            path: this.url,
          }
        }
      }
    },
    created(){
      if ( this.source.repository &&
        this.source.repositories[this.source.repository] &&
        this.source.repositories[this.source.repository].bbn_path &&
        this.source.repositories[this.source.repository].path &&
        (this.source.path !== undefined) &&
        this.source.filename ){
        this.url = this.source.repositories[this.source.repository].bbn_path + '/' +
          this.source.repositories[this.source.repository].path +
          (this.source.path ? this.source.path + '/' : '') +
          this.source.filename + '/__end__';
      }
    }
  }
})();
