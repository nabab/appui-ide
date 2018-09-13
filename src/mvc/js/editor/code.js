/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 07/07/2017
 * Time: 16:11
 */
(() => {
  return {
    data(){
      return $.extend({
        ide: bbn.vue.closest(this, '.bbn-tabnav').$parent.$data,
        originalValue: this.source.value,
        imessage: {
          title: '',
          content: '',
          start: null,
          end: null,
          id_option: this.source.permissions ? this.source.permissions.id : null
        },
        today: moment().format('YYYY-MM-DD HH:mm:ss'),
        initialState: {
          marks: this.source.marks,
          selections: this.source.selections,
          line: this.source.line,
          char: this.source.char
        }
      }, this.source);
    },
    computed: {
      isMVC(){
        return !!this.tab
      },
      rep(){
        if ( this.ide.repositories && this.ide.repository && this.ide.repositories[this.ide.repository] ){
          return this.ide.repositories[this.ide.repository]
        }
        return false
      },
      isChanged(){
        return this.originalValue !== this.value;
      },
      path(){
        let path = this.rep.bbn_path + '/' + this.rep.path,
            idx = bbn.fn.search(this.rep.tabs, "url", this.tab);
        if ( this.isMVC && this.rep.tabs && this.rep.tabs[idx] ){
          path += this.rep.tabs[idx].path;
        }
        return path;
      },
      filePath(){
        const bits = this.ide.path.split('/');
        let filePath = '',
            idx = bbn.fn.search(this.rep.tabs, "url", this.tab);
        if ( this.isMVC && this.rep && this.rep.tabs && this.rep.tabs[idx] && this.rep.tabs[idx].fixed ){
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

          if( filePath.length ){
            return filePath + '/'
          }
          else{
            return this.path;
          }
        }

        return this.path
      },
      fixed(){
        let idx = bbn.fn.search(this.rep.tabs, "url", this.tab);
        if ( this.isMVC &&  this.rep && this.rep.tabs && this.rep.tabs[idx] && this.rep.tabs[idx].fixed ){
          return this.ide.repositories[this.ide.repository].tabs[idx].fixed;
        }
        return false
      },
      fullPath(){
        if ( this.fixed ){
          if ( $.isNumeric(this.ssctrl) && (this.ssctrl > 0) ){
            return this.path + this.filePath + this.fixed;
          }
          else{
            return this.path + this.fixed;
          }
        }
        if ( this.ide.filename && this.extension && this.path.length ){
          return this.path + (this.ide.path.length ? this.ide.path + '/' : '') + this.ide.filename + '.' + this.extension;
        }
        return false;
      },
      settingFormPermissions(){
        return this.permissions !== undefined
      },
      /*

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
       },*/
      saveButtonText(){
        return this.imessage.id ? bbn._('Save') : bbn._('Add');
      }
    },
    watch: {
      isChanged(isChanged){
        let tabNav = bbn.vue.closest(this, 'bbns-tab').tabNav;
        tabNav.tabs[tabNav.selected].isUnsaved = isChanged;
      }
    },
    methods: {
      save(cm){
        const editor = this.$refs.editor,
              state = editor.getState();
              bbn.fn.warning("stato");
              bbn.fn.log(  this.getTab());
        if ( (this.isChanged && state && state.selections && state.marks) || (this.initialState !== state) && (state !== false) ){
          bbn.fn.post(this.ide.root + "actions/save", {
            repository: this.ide.repository,
            tab: this.tab,
            ssctrl: this.ssctrl,
            path: this.fixed ? this.filePath : this.ide.path,
            filename: this.fixed || this.ide.filename,
            extension: this.extension,
            full_path: this.fullPath,
            selections: state.selections,
            marks: state.marks,
            line: state.line,
            char: state.char,
            code: editor.value,
          }, (d) => {
            if ( d.data && d.data.success ){
              this.originalValue = this.value;
              appui.success(bbn._("File saved!"));
              bbn.fn.log("save",this, this.getTab());
              if ( this.getTab().source.tab === "php" ){

                let tabs = bbn.vue.closest(this, 'appui-ide-mvc').$refs.tabstrip.tabs;
                for( let tab of tabs ){
                  if ( tab.title === "Settings" && (tab.disabled === true) ){
                    tab.disabled = false;
                  }
                }
                bbn.vue.find(appui.ide, "appui-ide-mvc").source.setting = true;
              }
            }
            else if ( d.data && d.data.deleted ){
              this.originalValue = this.value;
              appui.success(bbn._("File deleted!"));
            }
            else {
              appui.error(bbn._('Error'));
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
            this.ide.filename, true
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
                  content: d.content,
                  url: 'output' + idx,
                  selected: true
                });
                tn.selected = tn.tabs.length - 1;
              });
              break;
            case "js":
              eval(this.value);
              break;
            case "svg":
              const oDocument = new DOMParser().parseFromString(this.value, "text/xml");
              if ( (oDocument.documentElement.nodeName == "parsererror") || !oDocument.documentElement){
                appui.alert("There is an XML error in this SVG");
              }
              else {
                bbn.vue.closest(this, ".bbns-tab").popup($("<div/>").append(document.importNode(oDocument.documentElement, true)).html(), "Problem with SVG");
              }
              break;
            default:
              appui.alert(this.value, "Test: " + this.mode);
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
          appui.confirm('Are you sure to remove this item?', () => {
            bbn.fn.post(this.ide.root + 'permissions/delete', obj, (d) => {
              if ( d.data && d.data.success ){
                this.permissions.children.splice(bbn.fn.search(this.permissions.children, 'code', obj.code), 1);
              }
            });
          });
        }
      },
      setState(){
        const code = this.$refs.editor;
        //case for serach a content
        if ( appui.ide.search.link && (appui.ide.cursorPosition.line > 0 || appui.ide.cursorPosition.ch > 0) ){

          //for selection
          /*let start = {
                line: appui.ide.cursorPosition.line,
                ch: appui.ide.cursorPosition.ch
              },
              end = {
                line: appui.ide.cursorPosition.line,
                ch: appui.ide.search.lastSearchRepository.length + appui.ide.cursorPosition.ch

              };*/
          code.widget.focus();
          setTimeout(() => {
            code.cursorPosition(appui.ide.cursorPosition.line, appui.ide.cursorPosition.ch);
            this.$nextTick(()=>{
               appui.ide.search.link = false;
               appui.ide.cursorPosition.line= 0;
               appui.ide.cursorPosition.ch= 0;
            });
          }, 800);
        }
        else{
          this.$nextTick(() => {
            code.loadState(this.initialState);
          });
        }
      },
      saveImessage(){
        if ( this.imessage.title && this.imessage.content && this.imessage.id_option ){
          bbn.vue.closest(this, 'bbns-tab').popup().confirm(bbn._('Are you sure you want save this internal message?'), () => {
            bbn.fn.post(this.ide.root + 'actions/imessages/add', this.imessage, d => {
              if ( d.success ){
                this.source.imessages.push($.extend({}, this.imessage));
                this.newImessage();
                appui.success(bbn._('Saved'));
              }
            });
          });
        }
      },
      newImessage(){
        this.imessage.title = '';
        this.imessage.content = '';
        this.imessage.start = null;
        this.imessage.end = null;
      },
      editImessage(im){
        this.imessage.title = im.title;
        this.imessage.content = im.content;
        this.imessage.start = im.start;
        this.imessage.end = im.end;
      },
			changeStart(e){
				bbn.fn.log('aaaa', e);
			}
    }
  }
})();
