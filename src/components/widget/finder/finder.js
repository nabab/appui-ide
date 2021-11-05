// Javascript Document

(() => {
  return {
    methods: {
      createConnection() {
        bbn.fn.log("Hello");
      },
      openFinder() {
        bbn.fn.link(appui.plugins['appui-ide'] + '/finder');
      }
    }
  }
})();