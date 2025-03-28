// Javascript Document

(() => {
  return {
    data() {
      const data = {
        isLoading: false,
        libInstalled: false,
        modified: {
          "status": false,
        },
        classmodified: {
          "status": false,
        },
        menu: [
          {
            text: bbn._("New ..."),
            items: [
              {
                text: bbn._("New class"),
                action: () => this.addClass()
              },
              {
                text: bbn._("New trait"),
                action: () => {}
              },
              {
                text: bbn._("New interface"),
                action: () => {}
              }
            ]
          },
          {
            text: bbn._("Environment"),
            items: []
          },
          {
            text: bbn._("Libraries"),
            items: []
          },
          {
            text: bbn._("Classes"),
            items: []
          },
        ],
        tests_info: null,
        methods_info: null,
        libtime: null,
        libraryChanging: false,
        currentClass: '',
        currentLibrary: '',
        currentMode: '',
        currentPath: '',
        root: appui.plugins['appui-ide'] + '/',
        data: null,
        ct: null,
        url: null,
        currentURL: null,
      };
      bbn.fn.each(this.source.libraries, d => {
        data.menu[2].items.push({
          text: d.text,
          action: () => {
            this.currentLibrary = d.value;
            this.menu[2].text = this.currentLibrary;
          }
        })
      });
      return data;
    },
    computed: {
      libRoot() {
        if (this.currentLibrary) {
          return bbn.fn.getField(this.source.libraries, 'root', {value: this.currentLibrary});
        }
        return '';
      },
      libDuration() {
        if (this.libtime) {
          let dateInMillisecs = new Date().getTime();
          let dateInSecs = Math.round(dateInMillisecs / 1000);
          let n = dateInSecs - (this.libtime);
          let days =parseInt( n / (24 * 3600));
          n = n % (24 * 3600);
          let hours = parseInt(n / 3600);
          n %= 3600;
          let minutes = n / 60;
          n %= 60;
          let seconds = n;
          let nb = 0;
          bbn.fn.log('days', days, 'hours', hours, 'minutes', minutes);
          if (days != 0) {
            if (days >= 30) {
              nb = days % 30;
              return '(' + nb + ' month' + (nb > 1 ? 's' : '') + ' ago)';
            }
            else {
              return '(' + days + ' day' + (days > 1 ? 's' : '') + ' ago)';
            }
          }
          else if (hours != 0) {
            return '(' + hours + ' hour' + (hours > 1 ? 's' : '') + ' ago)';
          }
          else if (minutes != 0) {
            return '(' + Math.round(minutes) + ' minute' + (minutes > 1 ? 's' : '') + ' ago)';
          }
        }
      }
    },
    methods: {
      updateMenu() {
        const env = {
          text: bbn._("Environment") + " <em>" + this.libDuration  + "</em>",
          items: [],
        };
        if (!this.libInstalled) {
          env.items.push(
            {
            	text: bbn._("Install"),
              icon: "nf nf-fa-edit",
            	action: () => this.makeEnv()
          	}
          );
        }
        else if (this.libInstalled) {
          env.items.push(
            {
            	text: bbn._("Delete"),
              icon: "nf nf-md-alert_remove",
            	action: () => this.delEnv()
          	}
          );
          env.items.push(
            {
            	text: bbn._("Update"),
              icon: "nf nf-md-update",
            	action: () => this.makeEnv()
          	}
          );
          if (this.modified.status || this.classmodified.status) {
            env.items.push(
              {
                text: bbn._("Push"),
                icon: "nf nf-cod-repo_push",
                action: () => {
                }
              }
            );
          }
        }
        this.menu[1] = env;
        this.getRef('menu').updateData();
      },
      alertResult(resp) {
        if (resp.success) {
          this.libInstalled = true;
          this.libtime = resp.libtime;
          appui.success(bbn._("Test Environment created"));
        }
        else {
          this.libInstalled = false;
          appui.error(bbn._("Something went wrong: " + resp.error));
        }
      },
      makeEnv() {
        this.isLoading = true;
        bbn.fn.log("makeEnv", this);
        bbn.fn.post(appui.plugins['appui-ide'] + '/data/lib_install', {class: this.currentClass, lib: this.currentLibrary, root: this.libRoot}, d => {
          this.alertResult(d);
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
          });
        });
      },
      delEnv() {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-ide'] + '/data/delete_install', {lib: this.currentLibrary, root: this.libRoot}, d => {
          if (d.success) {
            this.libInstalled = false;
            this.tests_info = {};
            this.isLoading = false;
            this.modified = {
              "status": false,
            };
            this.classmodified = {
              "status": false,
            };
            this.libtime = null;
            this.isLoading = false;
          }
          else {
            appui.error(bbn._("Unable to remove Test Environment"));
            this.isLoading = false;
          }
        });
      },
      addClass() {
        this.getPopup({
          component: 'appui-ide-cls-new',
          source: {
            lib: this.currentLibrary,
            root: this.libRoot
          },
          width: 350,
          label: bbn._("Add New Class"),
        });
      },
      loadClass()
      {
        this.isLoading = true;
        return new Promise(resolve => {
          const info = this.getInfoFromPath();
          bbn.fn.post(appui.plugins['appui-ide'] + '/class_editor', {class: this.currentClass, lib: this.currentLibrary, root: this.libRoot}, d => {
            this.data = d.data;
            bbn.fn.post(appui.plugins['appui-ide'] + '/data/check_install', {lib: this.currentLibrary, root: this.libRoot}, d => {
              if (d.success && d.found) {
                this.libInstalled = true;
                this.libtime = d.libtime;
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
              }
              else {
                this.libInstalled = false;
                this.tests_info = {};
                this.methods_info = {};
                for (let method in this.data.methods) {
                  let tmp = {
                    "method": this.data.methods[method].name,
                    "details": [],
                    "available_tests": "N/A"
                  };
                  this.tests_info[this.data.methods[method].name] = tmp;
                }
                this.isLoading = false;
                resolve();
              }
            });
          });
        });
      },
      classesToMenu(classes) {
        let res = [];
        bbn.fn.each(classes, d => {
          const bits = d.class.split('\\');
          let current = res;
          bbn.fn.each(bits, (b, i) => {
            let text = b + (i === bits.length - 1 ? '' : '\\');
            let idx = bbn.fn.search(current, {text});
            if (idx === -1) {
              let obj = {text};
              if (i === bits.length - 1) {
                obj.action = () => {
                  this.currentClass = d.class;
                  this.menu[3].text = this.currentClass;
                };
              }
              else {
                obj.items = [];
              }
              current.push(obj);
              current = obj.items;
            }
            else {
              current = current[idx].items;
            }
          });
        });
        while (res.length === 1) {
          bbn.fn.each(res[0].items, d => {
            d.text = res[0].text + d.text;
          });
          res = res[0].items;
        }
        return res;
      },
      getPopup() {
        return this.closest('bbn-container').getPopup(...arguments);
      },
      getInfoFromPath() {
        const res = {
          root: '',
          library: '',
          class: '',
          mode: '',
          path: ''
        };

        let url = this.closest('bbn-container').url;
        let path = url.length >= bbn.env.path.length ? '' : bbn.env.path.substr(url.length + 1);
        if (path) {
          let params = path.split('/');
          if (params.length > 2) {
            res.root = params[0];
            res.library = params[1] + '/' + params[2];
            if (params.length > 3) {
              res.class = bbn.fn.replaceAll("-", "\\", params[3]);
              if (params.length > 4) {
                res.mode = params[4];
                if (params.length > 5) {
                  res.path = params[5];
                  if (params[6]) {
                    res.path += '/' + params[6];
      }
                }
              }
            }
          }
        }

        bbn.fn.log([url, path, res]);
        return res;
    },
      getPathFromCfg() {
        let url = this.closest('bbn-container').url;
        if (this.currentLibrary) {
          url += "/" + this.libRoot + "/" + this.currentLibrary;
          if (this.currentClass) {
            url += "/" + bbn.fn.replaceAll("\\", "-", this.currentClass);
            if (this.currentMode) {
              url += "/" + this.currentMode;
              if (this.currentPath) {
                url += "/" + this.currentPath;
          }
        }
          }
        }

        let path = url.length < bbn.env.path.length ? '' : url.substr(bbn.env.path.length + 1);
        if (path) {
          let params = path.split('/');
          if (params.length > 1) {
            return params[0] + '/' + params[1];
          }
        }
        return '';
      }
    },
    mounted() {
      const info = this.getInfoFromPath();
      if (info.library) {
        setTimeout(() => {
          bbn.fn.log(this.$isMounted);
          this.currentLibrary = info.library;
          if (info.class) {
            setTimeout(() => {
              this.currentClass = info.class;
              if (info.mode) {
                setTimeout(() => {
                  this.currentMode = info.mode;
                  if (info.path) {
                    setTimeout(() => {
                      this.currentPath = info.path;
                    }, 100);
                  }
                }, 100);
              }
            }, 100);
          }
      }, 250);
      }
    },
    watch: {
      currentClass(v) {
        this.currentPath = '';
        this.$nextTick(() => {
          this.closest('bbn-router').route(this.getPathFromCfg());
        })
        /*if (this.currentURL) {
          this.currentURL = this.url + "/" + this.currentLibrary + "/" + bbn.fn.replaceAll("\\", "-", v);
          this.ct.currentURL = this.currentURL;
        }*/
        this.loadClass();
      },
      currentLibrary(v, ov) {
        bbn.fn.log("currentLibrary is changing from " + v + " to " + ov);
        /*if (this.currentURL) {
        	this.ct.currentURL = this.url + "/" + v;
        }*/
        this.libraryChanging = true;
        this.currentClass = '';
        this.currentPath = '';
        this.menu[3].items.splice(0, this.menu[3].items.length);
        this.updateMenu();
        if (v) {
          bbn.fn.post(this.root + 'data/classes/' + this.libRoot + '/' + this.currentLibrary, d => {
            if (d.success) {
              this.menu[3].items.push(...this.classesToMenu(d.data));
              this.updateMenu();
              this.getRef('menu').$forceUpdate();
              this.libraryChanging = false;
              this.$nextTick(() => {
                this.closest('bbn-router').route(this.getPathFromCfg());
              });
            }
          });
        }
        else{
          this.libraryChanging = false;
          this.$nextTick(() => {
            this.closest('bbn-router').route(this.getPathFromCfg());
          });
        }
      }
    }
  };
})();
