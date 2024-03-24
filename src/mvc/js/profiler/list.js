// Javascript Document
(() => {
  return {
    data(){
      return {
        users: appui.users
      };
    },
    methods: {
      detail(row) {
        bbn.fn.link(this.source.root + 'profiler/detail/' + row.id);
      },
      updateURLs() {
        bbn.fn.each(this.getRef('table').currentData, a => {
          if (this.source.urls.indexOf(a.url) === -1) {
            this.source.urls.push(a.url);
          }
        })
      }
    }
  };
})();