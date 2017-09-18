/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 07/07/2017
 * Time: 16:11
 */
(() => {
  return {
    data(){
      return $.extend(this.source, {
        ide: bbn.vue.closest(this, '.bbn-tabnav').$parent.$data,
        originalValue: this.source.value
      });
    },
    computed: {
      isMVC(){
        return !!this.tab
      },
      isChanged(){
        return this.originalValue !== this.value;
      },
      path(){
        const rep = this.ide.repositories[this.ide.repository];
        let path = rep.bbn_path + '/' + rep.path;
        if ( this.isMVC && rep.tabs && rep.tabs[this.tab] ){
          path += rep.tabs[this.tab].path;
        }
        return path;
      },
      fullPath(){
        const rep = this.ide.repositories[this.ide.repository],
              bits = this.ide.path.split('/');

        let filePath = '';
        if ( this.isMVC && rep && rep.tabs && rep.tabs[this.tab] && rep.tabs[this.tab].fixed ){
          if ( $.isNumeric(this.ssctrl) && bits.length ){
            $.each(bits, (i, v) => {
              if ( i < this.ssctrl ){
                filePath += v;
              }
              if ( bits[i+1] && ( (i + 1) < this.ssctrl ) ){
                filePath += '/';
              }
            });
          }
          return this.path + (filePath.length ? filePath + '/' : '') + rep.tabs[this.tab].fixed;
        }
        if ( this.ide.filename && this.extension && this.path.length ){
          return this.path + (this.ide.path.length ? this.ide.path + '/' : '') + this.ide.filename + '.' + this.extension;
        }
        return false;
      }
    },
    methods: {
      save(cm){
        const state = this.$refs.editor.getState();
        if ( this.isChanged && state && state.selections && state.marks ){
          bbn.fn.post(this.ide.root + "actions/save", {
            repository: this.ide.repository,
            tab: this.tab,
            ssctrl: this.ssctrl,
            path: this.ide.path,
            filename: this.ide.filename,
            extension: this.extension,
            full_path: this.fullPath,
            selections: state.selections,
            marks: state.marks,
            code: state.value,
          }, (d) => {
            if ( d.data && d.data.success ){
              this.originalValue = state.value;
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
        if ( this.isMVC ){
          bbn.fn.link(
            (this.ide.route ? this.ide.route + '/' : '') +
            (this.ide.path ? this.ide.path + '/' : '') +
            this.ide.filename
          );
          return true;
        }
        if ( typeof(this.mode) === 'string' ){
          switch ( this.mode ){
            case "php":
              bbn.fn.post(this.ide.root + "test", {code: this.value}, (d) => {
                const tn = bbn.vue.closest(this, '.bbn-tabnav'),
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
              eval(this.value);
              break;
            case "svg":
              const oDocument = new DOMParser().parseFromString(this.value, "text/xml");
              if ( (oDocument.documentElement.nodeName == "parsererror") || !oDocument.documentElement){
                bbn.fn.alert("There is an XML error in this SVG");
              }
              else {
                bbn.vue.closest(this, ".bbn-tab").popup($("<div/>").append(document.importNode(oDocument.documentElement, true)).html(), "Problem with SVG");
              }
              break;
            default:
              bbn.fn.alert(this.value, "Test: " + this.mode);
          }
        }

      },
      addChildPermission(){
        const obj = {
                id: this.permissions.id,
                code: this.$refs.perm_child_code.$refs.element.value,
                text: this.$refs.perm_child_text.$refs.element.value
              };

        if ( obj.id && obj.code.length && obj.text.length ){
          bbn.fn.post(this.ide.root + 'permissions/add', obj, (d) => {
            if ( d.data && d.data.success ){
              // Notify
              //$cont.append('<i class="fa fa-thumbs-up" style="margin-left: 5px; color: green"></i>');
              // Insert the new item to list
              delete obj.id;
              this.permissions.children.push(obj);
              // Clear fields
              this.$refs.perm_child_code.$refs.element.value = '';
              this.$refs.perm_child_text.$refs.element.value = '';
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
        const obj = {
                id: this.permissions.id,
                code: this.permissions.code,
                text: this.permissions.text,
                help: this.permissions.help || ''
              };

        if ( obj.id && obj.code.length && obj.text.length ){
          bbn.fn.post(this.ide.root + 'permissions/save', obj, d => {
            if ( d.data && d.data.success ){
              appui.success(bbn._("Permission saved!"));
            }
            else {
              appui.error(bbn._("Error!"));
            }
          });
        }
      },
      saveChildPermission(e){
        const inputs = $(e.target).closest('li').find('input'),
              obj = {
                id: this.permissions.id,
                code: $(inputs[0]).val(),
                text: $(inputs[1]).val()
              };

        if ( obj.id && obj.code.length && obj.text.length ){
          bbn.fn.post(this.ide.root + 'permissions/save', obj, (d) => {
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
        const obj = {
                id: this.permissions.id,
                code: $($(e.target).closest('li').find('input')[0]).val()
              };

        if ( obj.id && obj.code.length ){
          bbn.fn.confirm('Are you sure to remove this item?', () => {
            bbn.fn.post(this.ide.root + 'permissions/delete', obj, (d) => {
              if ( d.data && d.data.success ){
                this.permissions.children.splice(bbn.fn.search(this.permissions.children, 'code', obj.code), 1);
              }
            });
          });
        }
      }
    },
    mounted(){
      this.$nextTick(() => {
        $(this.$el).bbn('analyzeContent', true);
      });
    }
  }
})();