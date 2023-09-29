// Javascript Document

(() => {
  return {
    data() {
      return {
        url: appui.plugins['appui-ide'] + '/'
      };
    },
    computed: {
      methods()
      {
        let res = [];
        for (let method in this.source.methods) {
          let meth = this.source.methods[method];
          bbn.fn.log("METH", meth);
          let tmp = {
            "header": meth.name,
            "component": "appui-ide-cls-testor-codeditor",
            "scrollable": true,
            "componentOptions": {
              "mode": "purephp",
              "source": {
                lib: this.source.lib,
                root: this.source.root,
                class: this.source.class,
                function: meth.name,
                code: meth.code,
                button: true,
                changed: false,
              },
            }
          };
          res.push(tmp);
        }
        return res;
      },
    },
    methods: {
    },
    mounted() {
      this.url = appui.plugins['appui-ide'] + '/';
    },
  };
})();