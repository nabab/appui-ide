// Javascript Document

(() => {
  return {
    data() {
      return {
        widgets: [{
          title: "filesystems",
          itemComponent: "appui-ide-widget-finder-connection",
          items: this.source.connections.map(a => {
            a.url = appui.plugins["appui-ide"] + '/finder/source/' + a.id;
            return a;
          }),
          buttonsLeft: [{
            text: "New Connection",
            icon: "nf nf-fa-angle_left",
            action: this.createConnection
          }]
        }]
      }
    },
    methods: {
      createConnection() {
        bbn.fn.log(this.source);
      }
    }
  };
})()