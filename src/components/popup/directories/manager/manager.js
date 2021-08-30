// Javascript Document

(() => {
  return {
    computed: {
      repositoriesArray(){
        return Object.values(this.source.repositories);
      },
    },
    methods: {
      trStyle(row) {
        return {backgroundColor: row.bcolor || 'black', color: row.fcolor || 'white'};
      }
    },
    mounted(){
      bbn.fn.log("manager mounted", this.repositoriesArray)
    }
  }
})();