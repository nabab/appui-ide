(() => {
  return{
    data(){
      return{
        info:false,
        elementInfo:{
          element: {},
          json: [],
          tree:[]
        }
      }
    },
    computed:{},
    methods:{
      btns_repository(row, col , idx){
        return [
          {
            text: bbn._("Info"),
            command:()=>{
              this.showTree(row, col, idx);
            },
            icon: 'fa fa-info',
            title: bbn._('info'),
            notext: true
          }
        ]
      },
      showTree(row, col, idx){
        bbn.fn.post('ide/editor/directories/info',{
          info: true,
          id: row.id,
          name: row.text,
          code: row.code
        }, d =>{
          if ( d.success ){
            this.elementInfo.tree=[];
            this.elementInfo.element = row;
            this.elementInfo.json = d.informations;
            if ( d.tree.num > 0 ){
              this.elementInfo.tree.push(d.tree);
            }
            this.info = true;
          }
        });
      },
      //ACTIONS
      deleteElement(){
        alert("delete")
      },
      modifyElement(){
        alert("modify")
      },
      adds(){
        alert("add");
      }
    },
    watch:{},
    created(){},
    mounted(){},
    components:{}
  }
})();
