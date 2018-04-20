(()=>{
  return {
    data(){
      return {
        content: {}
      }
    },
    mounted(){
      bbn.fn.post('ide/editor/directories/info',{
        code: this.source.code,
        tableRepository: true
      }, d =>{
        if ( d.success ){
          this.content= d.repositories
        }
        bbn.fn.log("aaaaa", this.content)
      });
    }    
  }

})();
