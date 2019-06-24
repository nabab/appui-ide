(() => {
  return {
    props: ['source'],
    data(){
      return $.extend({
        ide: null,
        originalValue: this.source.value,
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
       return ((appui.ide.isComponent === false) && (this.rep.alias_code === 'mvc')) || (bbn.vue.closest(this, 'appui-ide-mvc') !== false);
      },
      isComponent(){
        return ((appui.ide.isComponent === true) || (this.rep.alias_code === "components")) || (bbn.vue.closest(this, 'appui-ide-component') !== false);
      },
      isProject(){
        return !!appui.ide.isProject;
      },
      isFile(){
        return !this.isMVC && !this.isComponent;
      },      
      rep(){
        if ( appui.ide.repositories && appui.ide.currentRep ){
          return this.ide.repositories[appui.ide.currentRep];
        }
        return false;
      },
      isClass(){
        if ( (this.isFile && this.isProject) || (this.isFile && (this.rep.alias_code === "cls")) ){
          return true;
        }
        return false;
      }, 
      isChanged(){
        return this.originalValue !== this.value;
      },
      path(){
        let path = this.rep.bbn_path + '/' + (this.rep.path === '/' ? '' : this.rep.path);
        if ( this.isProject ){
          if ( this.isMVC || this.isComponent || this.isFile ){
            path = this.source.id.slice();
            path = path.split('/');
            path.shift();
            path = path.join('/');
          }
        }
        else if ( !this.isProject && this.isMVC && this.rep.tabs ){
          let idx = bbn.fn.search(this.rep.tabs, "url", this.tab);
          if ( this.rep.tabs[idx] ){
            path += this.rep.tabs[idx].path;
          }
        }
        return path;
      },
      //
      filePath(){
        let paths = this.path.split('/');
        paths.pop();
        paths = paths.join("/") ;
        if ( paths.length ){
          return  paths
        }
        return this.path;
      },
      typeProject(){
        if ( this.isProject ){
          if ( this.isMVC ){
            return 'mvc';
          }
          else if ( this.isComponent ){
            return 'components';
          }
          else{
            return 'lib';
          }
        }
        return false;
      },
      fixed(){
        if ( (this.rep.tabs !== undefined) && (this.typeProject === false) ){
          let rep = this.isProject ? this.getReposiotryProject() : this.rep,
            idx = bbn.fn.search(rep.tabs, "url", this.tab);
          if ( this.isMVC && rep && rep.tabs && rep.tabs[idx] && rep.tabs[idx].fixed ){
            return this.ide.repositories[this.ide.repository].tabs[idx].fixed;
          }
        }
        return false
      },
      filename(){
        let filename = this.source.id.slice();
        filename = filename.split('.');
        filename = filename.shift().split('/').pop();
        return filename;
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
        if ( this.ide.filename && this.source.extension && this.path.length ){
         return  this.source.id
        }
        return false;
      }
    },
    methods: {
      getReposiotryProject(){
        if ( appui.ide.repositories && appui.ide.currentRep ){
          let repository = appui.ide.repositories[appui.ide.currentRep];
          if ( this.typeProject ){
            repository = appui.ide.repositoryProject( this.typeProject );
          }
          return repository;
        }
        return false;
      },
      save(cm){
        const editor = this.getRef('editor'),
              state = editor.getState(),
              tabContainer = this.$parent;
        if ( (this.isChanged && state && state.selections && state.marks) ||
         (this.initialState !== state) &&
         (state !== false)
        ){

          let pathHistory = this.filePath;

          if ( this.isProject && this.isMVC ){
            pathHistory = "";
            let arr = this.filePath.split('/'),
                pos = false;
            bbn.fn.each(arr, (val, i) =>{
              if ( val === 'mvc' ){
                pos = i+1;
                return false;
              }
            });

            if ( pos ){
              arr.splice(pos, 1);
              pathHistory = arr.join('/');
            }
          }

          let obj = {
            repository: this.isProject ? this.getReposiotryProject() : this.rep,
            typeProject: this.typeProject,
            tab: this.tab,
            ssctrl: this.ssctrl,
            path: this.fixed ? this.filePath : this.ide.path,
            filename: this.fixed || this.filename,
            extension: this.extension,
            full_path: this.id,
            selections: state.selections,
            marks: state.marks,
            line: state.line,
            char: state.char,
            code: editor.value,
            filePath : pathHistory
          };
          bbn.fn.post(this.ide.root + "actions/save", obj , (d) => {
            let tab = this.closest('bbn-container'),
                parent = {},
                tabnav = bbn.vue.closest(this, 'bbn-tabnav'),
                parentTabNav = {};

            if ( this.isComponent === true ){
              parent = this.closest('appui-ide-components');
            }
            else if ( this.isMVC === true ){
              parent = this.closest('appui-ide-mvc');
            }
            else if ( (!this.typeProject || (this.typeProject === 'lib')) &&
              this.isFile
            ){
              parent = this.closest('appui-ide-file');
            }

            parentTabNav = parent.closest('bbn-tabnav');

            if ( d.data && d.data.success ) {
              //remove icon plus why there is file in tab
                if ( !this.isFile ){
                  tabnav.$set(tabnav.tabs[tab['idx']], 'title', '');
                  if ( (parent.emptyTabs !== undefined) &&
                    (parent.emptyTabs.lastIndexOf(tab['url']) > -1)
                  ){
                    parent.emptyTabs.splice(parent.emptyTabs.lastIndexOf(tab['url']), 1);
                    parentTabNav.reload(parentTabNav.selected);
                  }
                }
              this.originalValue = this.value;
              appui.success(bbn._("File saved!"));
              if ( this.isMVC ){
                if ( tabContainer.source.tab === "php" ){
                  let tabs = bbn.vue.closest(this, 'appui-ide-mvc').getRef('tabstrip').tabs;
                  for( let tab of tabs ){
                    if ( tab.title === "Settings" && (tab.disabled === true) ){
                      tab.disabled = false;
                    }
                  }
                  bbn.vue.closest(this, "appui-ide-mvc").source.setting = true;
                }
              }
            }
            //Delete the file if code is empty and if it isn't a super controller
            else if ( d.data && d.data.deleted ){
              if ( parent.emptyTabs !== undefined ){
                parent.emptyTabs.push(tab['url']);
                parentTabNav.reload(parentTabNav.selected);
              }
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
          let pathMVC = this.ide.path;
          if ( pathMVC.indexOf('mvc/') === 0 ){
            pathMVC = pathMVC.replace("mvc/","");
          }
          let link = (this.ide.route ? this.ide.route + '/' : '') +
          (pathMVC === 'mvc' ? '' : pathMVC + '/') +  this.ide.filename;

          bbn.fn.link(link, true);

          return true;
        }
        if ( typeof(this.mode) === 'string' ){
          switch ( this.mode ){
            case "php":
              bbn.fn.post(this.ide.root + "test", {code: this.value}, (d) => {
                const tn = bbn.vue.closest(this, 'bbn-tabnav'),
                      idx = tn.tabs.length;
                tn.router.add({
                  title: moment().format('HH:mm:ss'),
                  load: false,
                  content: d.content,
                  url: 'output' + idx,
                  selected: true
                });                
                this.$nextTick(()=>{
                  tn.router.route('output' + idx);
                });
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
                this.closest("bbn-container").popup($("<div/>").append(document.importNode(oDocument.documentElement, true)).html(), "Problem with SVG");
              }
              break;
            default:
              appui.alert(this.value, "Test: " + this.mode);
          }
        }
      },
      setState(){
        const code = this.getRef('editor');
        //case for serach a content
        if ( (appui.ide.search.link !== undefined)  && (appui.ide.cursorPosition.line > 0 || appui.ide.cursorPosition.ch > 0) ){
          code.widget.focus();
          setTimeout(() => {
            code.cursorPosition(appui.ide.cursorPosition.line, appui.ide.cursorPosition.ch);
            /*this.$nextTick(()=>{
               this.ide.search.link = false;
               this.ide.cursorPosition.line= 0;
               this.ide.cursorPosition.ch= 0;
            });*/
          }, 800);
        }
        else{
          this.$nextTick(() => {
            code.loadState(this.initialState);
          });
        }
      }
    },
    beforeMount(){
      this.ide = this.closest('.appui-ide-source-holder').$data;      
    },
    mounted(){     
      //for get current editor (computed currentEditor)
      if ( appui.ide.runGetEditor ){        
        appui.ide.$set(appui.ide, 'runGetEditor', false)
      }
      this.$nextTick(()=>{
        appui.ide.$set(appui.ide, 'runGetEditor', true)
      })     
    },   
    watch: {
      isChanged(isChanged){
        let tabNav = this.closest('bbn-tabnav');
        tabNav.tabs[tabNav.selected].isUnsaved = isChanged;
      }
    },
   
  }
})();
