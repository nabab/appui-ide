// Javascript Document
(() => {
  return {
    data(){
      return {
        users: appui.app.users
      };
    },
    methods: {
      detail(row) {
        bbn.fn.link(this.source.root + 'profiler/detail/' + row.id);
      }
    }
  };
})();