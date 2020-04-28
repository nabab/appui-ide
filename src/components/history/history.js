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
        treeLoad: false,
        noHistory: false
      }
    },
    methods: {
      loadedTree(d){
        if ( bbn.fn.isArray(d.data) && (d.data.length === 0) ){
          this.noHistory = true;
          this.$nextTick(()=>{
            this.$refs.treeHistory.$set(this.$refs.treeHistory, 'isLoaded', false);
          });
        }
      },
      //method map for component tree
      transform(a){
        if ( a ){
          return bbn.fn.extend(a, {
            text: a.text + ( a.numChildren ? ' &nbsp; <span class="bbn-badge bbn-s bbn-bg-lightgrey">' + a.numChildren + '</span>' : ''),
            num: a.numChildren || 0,
            type: a.type ? a.type : "",
            repository: this.source.repository,
            repository_cfg: this.source.repositories[this.source.repository]
          });
        }
      },
      //  click in node file for to make a post and upload its content
      treeNodeActivate(node){
        if ( this.selected ){
          this.selected = false;
        }
        setTimeout(() => {
          if ( node.data.folder === false ){
            this.post(this.source.root + 'history/tree', {
              url: node.data.uid + "/" + node.data.file + "." + node.data.ext,
              repository: this.source.repository,
              repository_cfg: this.source.repositories[this.source.repository]
            }, d => {
              if ( d.data.success ){
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
        if ( this.url.length ){
          return {
            repository: this.source.repository,
            repository_cfg: this.source.repositories[this.source.repository],
            is_mvc: this.source.isMVC,
            uid: this.url,
          }
        }
      }
    },
    created(){
      if ( this.source.repository &&
        this.source.repositories[this.source.repository] &&
        this.source.repositories[this.source.repository].path &&
        (this.source.path !== undefined) &&
        this.source.filename
      ){
        this.url = this.source.repositories[this.source.repository].name + '/src/' +
          (this.source.path ? this.source.path + '/' : '') +
          this.source.filename + '/__end__';
      }
    }
  }
})();
