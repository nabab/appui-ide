// Javascript Document

(() => {
  return {
    data() {
      return {
        method: this.source.method,
      };
    },
    computed: {
      getMeth()
      {
        return [
          {
            "header": this.source.functionName,
            "component": "appui-ide-cls-testor-method-codeinterface",
            "scrollable": true,
            "componentOptions": {
              "mode": "purephp",
              "source": {
                code: this.source.method.functionCode
              },
            }
          }
        ];
      }
    },
    methods: {
      confirm() {
				const clsmethod = this.closest('bbn-container').find('appui-ide-cls-method');
        if (clsmethod) {
          clsmethod.code.current = this.getMeth[0].componentOptions.source.code;
          this.closest('bbn-floater').close();
        }
      },
      mounted() {
        this.method = this.source.method;
      }
    },
  };
})();