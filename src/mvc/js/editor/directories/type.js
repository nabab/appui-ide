(() => {
  return {
    data(){
      return{
        paneInfo : false,
        type:{
          element: {},
          info: {}
        }
      }
    },
    methods:{
      btns_repository(row, col , idx){
        return [
          {
            text: bbn._("Info"),
            command:()=>{
              this.showInfo(row, col, idx);
            },
            icon: 'fa fa-info',
            title: bbn._('info'),
            notext: true
          }
        ]
      },
      showInfo(row, col, idx){
        bbn.fn.post( this.source.root + '/info',{
          info: true,
          id: row.id,
          name: row.text,
          code: row.code
        }, d =>{
          if ( d.success ){
            this.type.tree=[];
            this.type.element = row;
            this.type.info = JSON.stringify(d.informations);
            this.paneInfo = true;
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
  }
})();
