(() => {
  return {
    data(){
      return{
        paneInfo : false,
        repository:{
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
        bbn.fn.post('ide/editor/directories/info',{
          info: true,
          id: row.id,
          name: row.text,
          code: row.code
        }, d =>{
          if ( d.success ){
            this.repository.tree=[];
            this.repository.element = row;
            this.repository.info = JSON.stringify(d.informations);
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
    created(){
      let mixins = [{
        data(){
          return {
            repositories: this
          }
        }
      }];

      bbn.vue.setComponentRule(this.source.root + '/components/', 'appui-ide-directories');
      bbn.vue.addComponent('repositories', mixins);
      bbn.vue.unsetComponentRule();
    }
  };
})();
