/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 07/07/2017
 * Time: 16:11
 */
(() => {
  return {
    data(){
      const vm = this;
      return $.extend(vm.source, {
        ide: bbn.vue.closest(vm, '.bbn-tabnav').$parent.$data,
        originalValue: vm.source.value
      });
    },
    computed: {
      isMVC(){
        return !!this.tab
      },
      isChanged(){
        return this.originalValue !== this.value;
      }
    },
    methods: {
      getPath(){
        const vm = this,
              rep = vm.ide.repositories[vm.ide.repository];
        let path = rep.bbn_path + '/' + rep.path;
        if ( vm.isMVC && rep.tabs && vm.tab && rep.tabs[vm.tab] ){
          path += rep.tabs[vm.tab].path;
        }
        return path;
      },
      getFullPath(){
        const vm = this,
              path = vm.getPath(),
              rep = vm.ide.repositories[vm.ide.repository];
        if ( vm.isMVC && rep && rep.tabs && vm.tab && rep.tabs[vm.tab] && rep.tabs[vm.tab].fixed ){
          return path + (vm.ide.path.length ? vm.ide.path + '/' : '') + rep.tabs[vm.tab].fixed;
        }
        if ( vm.ide.filename && vm.extension && path.length ){
          return path + (vm.ide.path.length ? vm.ide.path + '/' : '') + vm.ide.filename + '.' + vm.extension;
        }
        return false;
      },
      save(cm){
        const vm = this,
              state = vm.$refs.editor.getState();
        if ( vm.isChanged && state && state.selections && state.marks ){
          bbn.fn.post(vm.ide.root + "actions/save", {
            repository: vm.ide.repository,
            tab: vm.tab,
            path: vm.ide.path,
            filename: vm.ide.filename,
            extension: vm.extension,
            full_path: vm.getFullPath(),
            selections: state.selections,
            marks: state.marks,
            code: state.value,
          }, (d) => {
            if ( d.data && d.data.success ){
              vm.originalValue = state.value;
              appui.success(bbn._("File saved!"));
            }
            else if ( d.data && d.data.deleted ){
              appui.success(bbn._("File deleted!"));
            }
          });
          return true;
        }
      },
      test(){
        const vm = this;

        if ( vm.isMVC ){
          bbn.fn.link((vm.ide.path ? vm.ide.path + '/' : '') + vm.ide.filename );
          return true;
        }
        if ( typeof(vm.mode) === 'string' ){
          switch ( vm.mode ){
            case "php":
              bbn.fn.post(vm.ide.root + "test", {code: vm.value}, (d) => {
                const tn = bbn.vue.closest(vm, '.bbn-tabnav'),
                      idx = tn.tabs.length;
                tn.add({
                  title: moment().format('HH:mm:ss'),
                  load: false,
                  content: d,
                  url: 'output' + idx,
                  selected: true
                });
                tn.selected = tn.getIndex('output' + idx);
              });
              break;
            case "js":
              eval(vm.value);
              break;
            case "svg":
              const oDocument = new DOMParser().parseFromString(vm.value, "text/xml");
              if ( (oDocument.documentElement.nodeName == "parsererror") || !oDocument.documentElement){
                bbn.fn.alert("There is an XML error in this SVG");
              }
              else {
                bbn.fn.popup($("<div/>").append(document.importNode(oDocument.documentElement, true)).html(), "Problem with SVG");
              }
              break;
            default:
              bbn.fn.alert(vm.value, "Test: " + vm.mode);
          }
        }

      },
      addChildPermission(){
        const vm = this,
              obj = {
                id: vm.permissions.id,
                code: vm.$refs.perm_child_code.$refs.input.value,
                text: vm.$refs.perm_child_text.$refs.input.value
              };

        if ( obj.id && obj.code.length && obj.text.length ){
          bbn.fn.post(vm.ide.root + 'permissions/add', obj, (d) => {
            if ( d.data && d.data.success ){
              // Notify
              //$cont.append('<i class="fa fa-thumbs-up" style="margin-left: 5px; color: green"></i>');
              // Insert the new item to list
              delete obj.id;
              vm.permissions.children.push(obj);
              // Clear fields
              vm.$refs.perm_child_code.$refs.input.value = '';
              vm.$refs.perm_child_text.$refs.input.value = '';
            }
            else {
              // Notify
              //$cont.append('<i class="fa fa-thumbs-down" style="margin-left: 5px; color: red"></i>');
            }
            // Remove notify
            /*setTimeout(function(){
              $("i.fa-thumbs-up, i.fa-thumbs-down", $cont).remove();
            }, 3000);*/
          });
        }
      },
      savePermission(){
        const vm = this,
              obj = {
                id: vm.permissions.id,
                code: vm.permissions.code,
                text: vm.permissions.text,
                help: vm.permissions.help || ''
              };

        if ( obj.id && obj.code.length && obj.text.length ){
          bbn.fn.post(vm.ide.root + 'permissions/save', obj, (d) => {
            /*if ( d.data && d.data.success ){
              // Notify
              $bt.after('<i class="fa fa-thumbs-up" style="margin-left: 5px; color: green"></i>');
            }
            else {
              // Notify
              $bt.after('<i class="fa fa-thumbs-down" style="margin-left: 5px; color: red"></i>');
            }
            // Remove notify
            setTimeout(function(){
              $("i.fa-thumbs-up, i.fa-thumbs-down", $cont).remove();
            }, 3000);*/
          });
        }
      },
      saveChildPermission(e){
        const vm = this,
              inputs = $(e.target).closest('li').find('input'),
              obj = {
                id: vm.permissions.id,
                code: $(inputs[0]).val(),
                text: $(inputs[1]).val()
              };

        if ( obj.id && obj.code.length && obj.text.length ){
          bbn.fn.post(vm.ide.root + 'permissions/save', obj, (d) => {
            /*if ( d.data && d.data.success ){
              // Notify
              $cont.append('<i class="fa fa-thumbs-up" style="margin-left: 5px; color: green"></i>');
            }
            else {
              // Notify
              $cont.append('<i class="fa fa-thumbs-down" style="margin-left: 5px; color: red"></i>');
            }
            // Remove notify
            setTimeout(function(){
              $("i.fa-thumbs-up, i.fa-thumbs-down", $cont).remove();
            }, 3000);*/
          });
        }
      },
      removeChildPermission(e){
        const vm = this,
              obj = {
                id: vm.permissions.id,
                code: $($(e.target).closest('li').find('input')[0]).val()
              };

        if ( obj.id && obj.code.length ){
          bbn.fn.confirm('Are you sure to remove this item?', () => {
            bbn.fn.post(vm.ide.root + 'permissions/delete', obj, (d) => {
              if ( d.data && d.data.success ){
                vm.permissions.children.splice(bbn.fn.search(vm.permissions.children, 'code', obj.code), 1);
              }
            });
          });
        }
      }

    },
    mounted(){
      const vm = this;
      vm.$nextTick(() => {
        $(vm.$el).bbn('analyzeContent', true);
      });
    }
  }
})();