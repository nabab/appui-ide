// Javascript Document
(()=>{
  return {
    data(){
      return{
        root:'ide/',
        selectedFile : "",
        contentCache: ""
      }
    },
    methods:{
      getContent(node){
        if ( !node.data.folder ){
          this.post( this.root + 'data_cache',{
            cache: node.data.path,
            }, d => {
            if ( d.data ){
              this.selectedFile = node.data.path;
              this.contentCache = d.data[0];
            }
          });
        }
      },
      deleteAll(){
        this.post( this.root + 'data_cache',{
          deleteAll: true,
          deleteContent: 0
          }, d => {
          if ( d.data.success ){
            this.contentCache = "";
            this.getRef('cacheList').reload();
          }
        });
      },
      treeMapper(ele){
        return {
          path: ele.path || [],
          icon: ele.folder ? 'nf nf-custom-folder' : 'nf nf-fa-file',
          folder: ele.folder,
          text: ele.text + (ele.num ? "&nbsp;&nbsp;<span class='bbn-badge bbn-s bbn-bg-light-grey'>" + ele.num + "</span>" : ''),
          num: ele.num || 0,
          numChildren: ele.num || 0
        }
      },
      contextMenu(n , i){
        let obj = [
          {
            icon: 'nf nf-fa-trash',
            text: !n.data.folder ? bbn._('Delete file cache') : bbn._('Delete folder'),
            action: (node) => {
              this.post( this.root + 'data_cache',{
                deleteCache: node.data.path,
                deleteContent: 1
              }, d => {
                if ( d.data.success ){
                  let treeOfNode = bbn.vue.closest(node, 'bbn-tree');
                  //node.$parent.reload();
                  treeOfNode.$parent.parent.reload();
                  this.$nextTick(()=>{
                    //if delete single file
                    if ( !node.data.folder ){
                      //let's check if the file we delete is the one selected
                      if (this.selectedFile === node.data.path){
                        this.contentCache = "";
                      }
                    }//if we delete a folder that contains a selected file then it will be closed
                    else{
                      let folder = this.selectedFile.split("/"),
                          folderCompare = node.data.path.split("/"),
                          ctrl= false;
                      folder.shift();
                      folder.pop();
                      folderCompare.shift();
                      folder = folder.join("/");
                      folderCompare = folderCompare.join("/");
                      if ( folder.indexOf(folderCompare) > -1 ){
                        this.contentCache = "";
                      }
                    }
                  });
                }
              });
            }
          }
        ];
        if ( !n.data.folder){
          return obj
        }
        else{
          if ( n.data.numChildren > 0 ){
            obj.push({
              icon: 'nf nf-fa-trash',
              text: bbn._("Delete folder's contents"),
              action: (node) => {
                this.post( this.root + 'data_cache',{
                  deleteCache: node.data.path,
                  deleteContent: 0
                  }, d => {
                  if ( d.data.success ){
                    let treeOfNode = bbn.vue.closest(node, 'bbn-tree');
                    treeOfNode.reload();
                    this.contentCache = "";
                  }
                });
              }
            });
          }
          return obj
        }
      }
    },
    watch: {
      contentCache(val){
        if( !val.length ){
          this.selectedFile = "";
        }
      }
    }
  }
})();
