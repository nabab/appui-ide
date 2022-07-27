// Javascript Document

(() => {
  return {
    data() {
      return {
        addActions: [
          {
            text: 'Add Method',
            action: () => {}
          },
          {
            text: 'Add Prop',
            action: () => {}
          },
          {
            text: 'Add Constant',
            action: () => {}
          }
        ],
        currentMethod: "",
        currentProps: "",
        currentConst: "",
        currentCode: "",
        tabs: [
          {
						title: "Methods",
            url: "methods",
            static: true,
            idx: 0
          },
          {
						title: "Props",
            url: "props",
            static: true,
          	idx: 1
          },
          {
						title: "Constants",
            url: "constants",
            static: true,
          	idx: 2
          }
        ],
        tabSelected: 0
      };
    },
    computed: {
      methodList() {
        let res = [];
        bbn.fn.iterate(this.source.data.methods, (a, n) => {
          res.push(n);
        });
        return res;
      },
      propsList() {
        let res = [];
        bbn.fn.iterate(this.source.data.properties, (a, n) => {
          res.push(n);
        });
        return res;
      },
      constList() {
        let res = [];
        bbn.fn.iterate(this.source.data.constants, (a, n) => {
          res.push(n);
        });
        return res;
      }
    },
    watch: {
      currentMethod(v) {
        this.currentCode = v ? "<?php\n" + this.source.data.methods[v].code : "";
      }
    }
  };
})();