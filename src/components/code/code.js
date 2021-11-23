(() =>{
  return {
    props: ['source'],
    data(){
      let editor = this.closest('appui-ide-editor');
      return {
        ide: null,
        firstInput: false,
        originalValue: this.source.value,
        value: this.source.value,
        theme: editor.themeCode,
        root: editor.source.root,
        codeExist: false,
        initialState: {
          marks: this.source.marks,
          selections: this.source.selections,
          line: this.source.line,
          char: this.source.char
        }
      }
    },
    computed: {
      isMVC(){
       return ((this.closest('appui-ide-editor').isComponent === false) && (this.rep.alias_code === 'mvc')) || (this.closest('appui-ide-mvc') !== false);
      },
      isComponent(){
        return ((this.closest('appui-ide-editor').isComponent === true) || (this.rep.alias_code === "components")) || (this.closest('appui-ide-component') !== false);
      },
      isProject(){
        return this.source.project !== false;
      },
      isFile(){
        return !this.isMVC && !this.isComponent;
      },
      isCli(){
        return this.isFile && (this.source.project === 'cli');
      },//current repository
      rep(){
        if ( this.ide.repositories && this.ide.repository ){
          return this.ide.repositories[this.ide.repository];
        }
        return false;
      },
      isClass(){
        if ( ((this.isFile && this.isProject) && (this.source.project === 'lib')) ||
          (this.isFile && (this.rep.alias_code === "cls"))
        ){
          return true;
        }
        return false;
      },
      isChanged(){
        return this.originalValue !== this.value;
      },
      path(){
        let path = this.rep.bbn_path + '/' + (this.rep.path === '/' ? '' : this.rep.path);
        //if ( this.isProject ){
          if ( this.isMVC || this.isComponent || this.isFile ){
            path = this.source.id.slice();
            path = path.split('/');
            path.shift();
            path = path.join('/');
          }
        /*}
        else if ( !this.isProject && this.isMVC && this.rep.tabs ){
          let idx = bbn.fn.search(this.rep.tabs, "url", this.tab);
          if ( this.rep.tabs[idx] ){
            path += this.rep.tabs[idx].path;
          }
        }*/
        return path;
      },
      //
      filePath(){
        let paths = this.path.split('/');
        paths.pop();
        paths.pop();
        paths = paths.join("/") ;
        if ( paths.length ){
          return  paths
        }
        return this.path;
      },
      typeProject(){
        if ( this.isProject  && this.source.project){
          return this.source.project;
        }
        return false;
      },
      fixed(){
        if ( (this.rep.tabs !== undefined) && (this.typeProject === false) ){
          let rep = this.isProject ? this.getReposiotryProject() : this.rep,
            idx = bbn.fn.search(rep.tabs, "url", this.source.tab);
          if ( this.isMVC && rep && rep.tabs && rep.tabs[idx] && rep.tabs[idx].fixed ){
            return this.ide.repositories[this.ide.currentRep].tabs[idx].fixed;
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
          if ( (typeof(this.source.ssctrl) === "number") && (this.source.ssctrl > 0) ){
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
      runTracking(recentFile = true){
        if ( !this.firstInput ){
          this.firstInput = true;

          let code = this.getRef('editor'),
              info = code.getState(),
              path = '',
              pathHistory = this.filePath;

          if ( !this.typeProject ){
            path = this.fullPath.substring(this.path.length, this.fullPath.length);
          }
          else{
            path = this.path.substring(this.path.lastIndexOf('src/')+4, this.path.length);
          }

          if ( this.isProject && this.isMVC ){
            pathHistory = "";
            let arr = this.filePath.split('/'),
                pos = 0;
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

          this.post(this.root + 'actions/tracking',{
            file: path,
            state: {
              selections: info.selections !== undefined ? info.selections : false,
              marks: info.marks !== undefined ? info.marks : false,
              line: info.line !== undefined ? info.line : false,
              char: info.char !== undefined ? info.char : false,
            },
            info:{
              repository: this.isProject ? this.getRepositoryProject() : this.rep,
              typeProject: this.typeProject,
              tab: this.source.tab,
              ssctrl: this.ssctrl,
              path: this.fixed ? this.filePath : this.ide.path,
              filename: this.fixed || this.filename,
              extension: this.source.extension,
              full_path: this.source.id,
              filePath : pathHistory,
              code_file_pref: this.path.substring(this.path.lastIndexOf('src/'+ this.typeProject)+4, this.path.length)
            },
            set_recent_file: recentFile
          });
        }
      },
      getRepositoryProject(){
        let parent = false;
        if ( this.isComponent === true ){
          parent = this.closest('appui-ide-component');
        }
        else if ( this.isMVC === true ){
          parent = this.closest('appui-ide-mvc');
        }
        else if ( (!this.typeProject || (this.typeProject === 'lib')) &&
          this.isFile
        ){
          parent = this.closest('appui-ide-file');
        }
        if ( this.typeProject ){
          return this.closest('appui-ide-editor').repositoryProject( this.typeProject , parent.repository_content);
        }
        return parent.repository_content
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
                pos = 0;
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
            repository: this.isProject ? this.getRepositoryProject() : this.rep,
            typeProject: this.typeProject,
            tab: this.source.tab,
            ssctrl: this.ssctrl,
            path: this.fixed ? this.filePath : this.ide.path,
            filename: this.fixed || this.filename,
            extension: this.source.extension,
            full_path: this.source.id,
            state: {
              selections: state.selections,
              marks: state.marks,
              line: state.line,
              char: state.char
            },
            code: editor.value,
            filePath : pathHistory,
            code_file_pref: this.path.substring(this.path.lastIndexOf('src/'+ this.typeProject)+4, this.path.length)
          };
          this.post(this.root + "actions/save", obj , (d) => {
            let tab = this.closest('bbn-container'),
                parent = {},
                tabnav = this.closest('bbn-router'),
                parentTabNav = {};

            if ( this.isComponent === true ){
              parent = this.closest('appui-ide-component');
            }
            else if ( this.isMVC === true ){
              parent = this.closest('appui-ide-mvc');
            }
            else if ( (!this.typeProject || ((this.typeProject === 'lib') || (this.typeProject === 'cli'))) &&
              this.isFile
            ){
              parent = this.closest('appui-ide-file');
            }

            parentTabNav = parent.closest('bbn-router');

            if ( d.success ) {
              //remove icon plus why there is file in tab
                if ( !this.isFile ){
                  if ( (parent.emptyTabs !== undefined) &&
                    (parent.emptyTabs.lastIndexOf(tab['url']) > -1)
                  ){
                    parent.emptyTabs.splice(parent.emptyTabs.lastIndexOf(tab['url']), 1);
                    parentTabNav.reload(parentTabNav.selected);
                  }
                }
              this.originalValue = this.value;
              appui.success(bbn._("File saved!"));
              this.$emit('saved',{tab: obj.tab, path: this.source.id});
              if ( this.isMVC ){
                if ( tabContainer.source.tab === "php" ){
                  let tabs = this.closest('appui-ide-mvc').getRef('tabstrip').views;
                  for( let tab of tabs ){
                    if ( tab.title === "Settings" && (tab.disabled === true) ){
                      tab.disabled = false;
                    }
                  }
                  this.closest("appui-ide-mvc").source.setting = true;
                }
              }
            }
            //Delete the file if code is empty and if it isn't a super controller
            else if ( d.deleted ){
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

          appui.find('bbn-router').load(link, true);

          return true;
        }
        if ( typeof(this.source.mode) === 'string' ){
          switch ( this.source.mode ){
            case "php":
              if ( !this.isClass ){
                this.post(this.root + "test", {
                  code: this.value,
                  file: this.fullPath
                 }, d => {
                  const tn = this.closest('bbn-router'),
                        idx = tn.views.length;
                  tn.add({
                    title: dayjs().format('HH:mm:ss'),
                    icon: 'nf nf-fa-cogs',
                    load: false,
                    content: d.content,
                    url: 'output' + idx,
                    selected: true
                  });
                  this.$nextTick(()=>{
                    tn.route('output' + idx);
                  });
                });
              }
              else{
                this.alert(bbn._('Unable to test classes!!'));
              }
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
                let divElement = document.createElement('div').innerHTML = document.importNode(oDocument.documentElement, true);
                this.closest("bbn-container").popup(divElement.innerHTML, "Problem with SVG");
              }
              break;
            default:
              appui.alert(this.value, "Test: " + this.source.mode);
          }
        }
      },
      getLine(){
        this.runTracking();
        this.closest('appui-ide-editor').currentLine = this.getRef('editor').widget.getCursor().line;
      },
      goLine(lineNum){
        lineNum = parseInt(lineNum);
        let code = this.getRef('editor'),
            obj = {
              line: lineNum === 0  ? 0 : lineNum - 1,
              char: 0
            };
        code.loadState(obj);
      },
      //set state code of file preference
      setState(){
        let componentEditor = this.closest('appui-ide-editor'),
            code = this.getRef('editor');
        this.codeExist = !!code;

        //FOR SEARCH
        if ( componentEditor.currentLine > 0 ){
          this.goLine(componentEditor.currentLine);
          componentEditor.currentLine = 0;
        }
        else{
          let state = bbn.fn.extend({},this.initialState, true);
          state.line = state.line === false ?  0 :  parseInt(state.line);
          state.char = state.char === false ?  0 :  parseInt(state.char);
          this.$nextTick(()=>{
            code.loadState(state);
          });
          //for list recent files
          if ( componentEditor.readyMenu ){
            componentEditor.getRecentFiles();
          }
        }
      }
    },
    beforeMount(){
      //get information data of membership tabnav
      this.ide = this.closest('.appui-ide-source-holder').$data;
    },  
    watch: {
      isChanged(isChanged){
        let container = this.closest('bbn-container');
        container.dirty = isChanged;
      }
    }
  }
})();