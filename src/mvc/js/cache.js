// Javascript Document
(()=>{
  return {
    data(){
      return{
        root: appui.plugins['appui-ide'] + '/',
        selectedFile : "",
        contentCache: ""
      }
    },
    methods:{
      getContent(node){
        if ( !node.data.folder ){
          this.post( this.root + 'cache',{
           // cache: node.data.path,
             cache: node.data.nodePath,
            }, d => {
            if ( d ){
              //this.selectedFile = node.data.path;
              this.selectedFile = node.data.nodePath;
              this.selectedFileCreation = bbn.fn.fdate(bbn.fn.date(Math.round(d.timestamp*1000)));
              this.selectedFileExpire = d.expire || bbn._('Never');
              this.selectedFileHash = d.hash;
              this.contentCache = JSON.stringify(d.value);
            }
          });
        }
      },
      deleteAll(){
        this.post( this.root + 'cache',{
          deleteAll: true,
          deleteContent: 0
          }, d => {
          if ( d.success ){
            this.contentCache = "";
            this.getRef('cacheList').reload();
          }
        });
      },
      treeMapper(ele){
        return {
          path: ele.path,
          icon: ele.folder ? 'nf nf-custom-folder' : 'nf nf-fa-file',
          folder: ele.folder,
          nodePath: ele.nodePath || '',
          text: ele.text + (ele.num ? "&nbsp;&nbsp;<span class='bbn-badge bbn-s bbn-bg-light-grey'>" + ele.num + "</span>" : ''),
          numChildren: ele.num || 0
        }
      },
      contextMenu(n , i){
        let obj = [
          {
            icon: 'nf nf-fa-trash',
            text: !n.data.folder ? bbn._('Delete file cache') : bbn._('Delete folder'),
            action: (node) => {
              this.post( this.root + 'cache',{
                //deleteCache: node.data.path,
                deleteCache: node.data.nodePath,
                deleteContent: 1
              }, d => {
                if ( d.success ){
                  let treeOfNode = bbn.vue.closest(node, 'bbn-tree');
                  if ( node.level !== 0 ){
                    treeOfNode.$parent.parent.reload();
                  }
                  else{
                    treeOfNode.reload();
                  }
                  this.$nextTick(()=>{
                    //if delete single file
                    if ( !node.data.folder ){
                      //let's check if the file we delete is the one selected

                      //if ( this.selectedFile === node.data.path ){
                      if ( this.selectedFile === node.data.nodePath ){
                        this.contentCache = "";
                      }
                    }//if we delete a folder that contains a selected file then it will be closed
                    else{
                      let folder = this.selectedFile.split("/"),
                          //folderCompare = node.data.path.split("/"),
                          folderCompare = node.data.nodePath.split("/"),
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
                this.post( this.root + 'cache',{
                  //deleteCache: node.data.path,
                  deleteCache: node.data.nodePath,
                  deleteContent: 0
                  }, d => {
                  if ( d.success ){
                    let treeOfNode = node.closest('bbn-tree');
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