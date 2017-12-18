// Javascript Document
(()=>{
  return{
    props: ['source'],
    data(){
      return {
        currentRepository: '',
        orientationSplitter: 'horizontal',
        content:'',
        typeFile: '',
        routeFile :{
          root: '',
          filePath: ''
        },
        //value of default
        theme:  'pastel-on-dark'
      }
    },
    methods:{
      //for tree
      initialData(){
        if( this.currentRepository !== '' ){
          return {
           repository: this.currentRepository
          };
        }
      },
      mapperTree(ele){
        return ele
      },//to display its corespondent path and the origin of the selected and opened file
      getRoute(node){
        if ( node.isSelected ){
          let title = node.data.path.slice(),
              newTitle =  title.substring(title.indexOf(this.nameRepository), title.length);
          this.routeFile.root = newTitle.split('/').splice(0,1)[0];
          this.routeFile.filePath = newTitle.split('/').splice(1,newTitle.length).join('/');
        }
      },
      selectNode(ele){
        if ( !ele.data.folder ){
          bbn.fn.post(this.source.root+'all/actions/getContent', ele.data, d =>{
            if ( d.success ){
              this.getRoute(ele);
              this.content = d.content;
              //in the case of the file license that returns in the extension the same name of the file we will put the extension 'txt'
              this.typeFile = ele.data.extension === 'LICENSE' ? 'txt' : ele.data.extension;
            }
          });
        }
      },// for move mode into the tree
      moveNode(e, node, overNode){
        if( overNode.data.folder ){
          let src ={
            orig: node.data.path,
            dest: overNode.data.path
          };
          bbn.fn.post(this.source.root+'all/actions/moveNodeTree', src, d =>{
            if ( d.success ){
              overNode.parent.reload();
              if( !overNode.isExpanded ){
                overNode.isExpanded = true;
              }
              appui.success(bbn._("successfully moved!"));
            }
            else{
              appui.error(bbn._("Error move!"));
            }
          });
        }
      }
    },
    computed:{
      //for dropdown list
      repositories(){
        const all = [];
        for( let a of this.source.repositories ){
          all.push({
            value: a.repository,
            text: a.text
          });
        }
        return bbn.fn.order(all, "text");
      },
      //source for dropdow of the themes of component code
      themes(){
        let types = [];
        $.each(this.source.typesTheme, (i,v)=>{
          types.push({
            text: v,
            value: v
          });
        });
        return bbn.fn.order(types, "text");
      },
      //repository name
      nameRepository(){
        if ( this.currentRepository !== '' ){
          for( let a of this.repositories ){
            if ( a.value === this.currentRepository ){
              return a.text;
            }
          }
        }
        else{
          return '';
        }
      },
    },
    //when the "currentRepository" property is changed, the tree is reset to be updated
    watch:{
      currentRepository(newVal, oldVal){
        if (  oldVal !== '' ){
          this.$refs.allContentTree.reset();
        }
      }
    }
  }
})();