// Javascript Document

(() => {
  return {
    data() {
      return {
        tests_info: null,
        methods_info: null,
        tests_info: null,
        tests_info: null,
      }
    },
    mounted() {
      this.data = this.source.data;
      bbn.fn.post(appui.plugins['appui-ide'] + '/data/available-tests', {class: this.currentClass, lib: this.currentLibrary, root: this.libRoot}, d => {
        if (d.success) {
          this.tests_info = d.data;
          this.methods_info = d.methods;
          if ('modified' in d) {
            this.modified = d.modified;
          }
          if ('classmodified' in d) {
            this.classmodified = d.classmodified;
          }
        }
        else {
          this.tests_info = {};
          this.methods_info = {};
          for (let method in d.data) {
            let tmp = {
              "method": d.data[method].name,
              "details": [],
              "available_tests": "N/A"
            };
            this.tests_info[d.data[method].name] = tmp;
          }
        }
        this.isLoading = false;
        bbn.fn.log('Infos', this.tests_info);
        this.updateMenu();
        resolve();
      });
    },
  };
})();
