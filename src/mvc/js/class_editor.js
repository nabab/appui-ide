// Javascript Document

(() => {
  return {
    data() {
      return {
        isLoading: false,
        libInstalled: false,
        modified: {
          "status": false,
        },
        tests_info: null,
        currentClass: '',
        currentLibrary: '',
        root: appui.plugins['appui-newide'] + '/',
        addActions: [
          {
            text: bbn._("New class"),
            action: () => {}
          },
          {
            text: bbn._("New trait"),
            action: () => {}
          },
          {
            text: bbn._("New interfavce"),
            action: () => {}
          }
        ],
        data: null,
        ct: null,
        url: null,
        currentURL: null,
      }
    },
    methods: {
      alertResult(resp) {
        if (resp.success) {
          this.libInstalled = true;
          appui.success(bbn._("Test Environment created"));
        }
        else {
          this.libInstalled = false;
          appui.error(bbn._("Something went wrong: " + resp.error));
        }
      },
      makeEnv() {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-newide'] + '/data/lib_install', {class: this.source.name, lib: this.source.lib}, d => {
          this.alertResult(d);
          bbn.fn.post(appui.plugins['appui-newide'] + '/data/available-tests', {class: this.source.class, lib: this.lib}, d => {
            if (d.success) {
              this.tests_info = d.data;
              if ('modified' in d) {
                this.modified = d.modified;
                bbn.fn.log(this.modified);
              }
            }
            else {
              this.tests_info = {};
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
          });
        });
      },
      delEnv() {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-newide'] + '/data/delete_install', {lib: this.source.lib}, d => {
          if (d.success) {
            this.libInstalled = false;
            this.tests_info = null;
            this.isLoading = false;
            this.modified = {
              "status": false,
            };
            this.isLoading = false;
          }
          else {
            appui.error(bbn._("Unable to remove Test Environment"));
            this.isLoading = false;
          }
        });
      },
    },
    mounted() {
      setTimeout(() => {
        this.ct = this.closest('bbn-container');
        let currentURL = this.ct.url;
        if (this.currentLibrary) {
          currentURL += "/" + this.currentLibrary;
          if (this.currentClass) {
            currentURL += "/" + bbn.fn.replaceAll("\\", "-", this.currentClass);
          }
        }
        this.ct.currentURL = currentURL;
        this.currentURL = currentURL;
        this.url = this.ct.url;
      }, 250);
    },
    watch: {
      currentClass(v) {
        if (this.currentURL) {
          this.currentURL = this.url + "/" + this.currentLibrary + "/" + bbn.fn.replaceAll("\\", "-", v);
          this.ct.currentURL = this.currentURL;
        }
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-newide'] + '/class_editor', {class: v, lib: this.currentLibrary}, d => {
          this.data = d.data;
          this.isLoading = true;
          bbn.fn.post(appui.plugins['appui-newide'] + '/data/check_install', {lib: this.currentLibrary}, d => {
            if (d.success && d.found) {
              this.libInstalled = true;
              bbn.fn.post(appui.plugins['appui-newide'] + '/data/available-tests', {class: v, lib: this.currentLibrary}, d => {
                if (d.success) {
                  this.tests_info = d.data;
                  if ('modified' in d) {
                    this.modified = d.modified;
                    bbn.fn.log(this.modified);
                  }
                }
                else {
                  this.tests_info = {};
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
              });
            }
            else {
              this.libInstalled = false;
              this.isLoading = false;
            }
          });
        });
      },
      currentLibrary(v) {
        if (this.currentURL) {
        	this.ct.currentURL = this.url + "/" + v;
        }
      }
    }
  };
})();