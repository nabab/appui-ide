/**
 * @file editor component
 * @description Component use to initiate ide with useful options
 * @copyright BBN Solutions
 * @author Lucas Courteaud
 */

(() => {
  return {
    mixins: [bbn.cp.mixins.basic, bbn.cp.mixins.localStorage],
    data() {
      return {
        types: bbn.ide || null,
        recentFiles: [],
        /**
         * Root of the component
         * @data {String} [appui.plugins['appui-ide'] + '/'] root
         */
        root: appui.plugins['appui-ide'] + '/',
        /**
         * Options of all paths types
         * @data {Array} [null] typeOptions
         */
        typeOptions: null,
        /**
         * Id of the selected path
         * @data {String} [''] currentPathId
         */
        currentPathId: this.source?.project?.path?.[0]?.id,
        /**
         * Enable / Disable the dropdown to select path
         * @data {Boolean} [false] isDropdownPathDisabled
         */
        isDropdownPathDisabled: false,
        /**
         * Id type of the selected path
         * @data {String} [''] currentTypeCode
         */
        currentTypeCode: 'components',
        /**
         * Name of the selected file/folder
         * @data {String} [''] nameSelectedElem
         */
        nameSelectedElem: '',
        /**
         * Vue object of this component's container
         * @data {Vue} [null] container
         */
        container: null,
        menu: [
          {
            text: bbn._('File'),
            items: [{
              icon: 'nf nf-fa-plus',
              text: bbn._('New'),
              items: [{
                icon: 'nf nf-fa-file',
                text: bbn._('Element'),
                action: a => this.newElement()
              }, {
                icon: 'nf nf-fa-folder',
                text: bbn._('Directory'),
                action: a => this.newDir()
              }]
            }]
          },
          {
            icon: 'nf nf-fa-save',
            text: bbn._('Save'),
            action: a => this.save()
          }
        ],
        treeData: null,
        copiedNode: null,
        isCut: false,
        ready: false
      };
    },
    computed: {
      currentEditor() {
        const router = this.getRef('router');
        if (router) {
          const ct = router.getFinalContainer();
          if (ct) {
            return ct.find('bbn-code');
          }
        }

        return null;
      },
      toolbarMenu() {
        let menu = [
          {
            text: bbn._('File'),
            items: [
              {
                icon: 'nf nf-fa-plus',
                text: bbn._('New'),
                items: [{
                  icon: 'nf nf-fa-file',
                  text: bbn._('Element'),
                  action: this.newElement
                }, {
                  icon: 'nf nf-fa-folder',
                  text: bbn._('Directory'),
                  action: this.newDir
                }]
              },
              {
                icon: "nf nf-md-content_paste",
                text: bbn._('Paste'),
                action: () => {
                  if (this.copiedNode) {
                    if (this.isCut) {
                      bbn.fn.post(this.root + 'editor/actions/move', {
                        url_src: this.getPathByNode(this.copiedNode),
                        url_dest: this.currentRoot,
                        data_src: this.copiedNode.data,
                        data_dest: { uid: "/" },
                        id_project: this.closest('appui-project-ui').source.project.id
                      }, (d) => {
                        if (d.success) {
                          appui.success(bbn._('Success'));
                          this.treeReload();
                          this.isCut = false;
                          this.copiedNode = null;
                        } else {
                          appui.error(bbn._('Error'));
                        }
                      })
                      return;
                    }
                    this.getPopup({
                      component: "appui-ide-form-copy",
                      componentOptions: {
                        source: {
                          name: this.copiedNode.data.name,
                          url_src: this.getPathByNode(this.copiedNode),
                          url_dest: this.currentRoot,
                          data_src: this.copiedNode.data,
                          data_dest: { uid: "/" },
                          id_project: this.closest('appui-project-ui').source.project.id
                        }
                      },
                      label: bbn._('Copy')
                    });
                  } else {
                    appui.error(bbn._('Nothing to paste'));
                  }

                }
              },
              {
                icon: 'nf nf-fa-save',
                text: bbn._('Save'),
                action: this.save
              },
              {
                icon: 'nf nf-fa-file',
                text: bbn._('Recent files'),
                items: this.recentFiles
              }
            ]
          }, {
            text: bbn._('Search'),
            items: [
              {
                icon: 'nf nf-fa-search',
                text: bbn._('Find'),
                action: () => {
                  if (this.currentEditor) {
                    this.currentEditor.openSearchPanel();
                  }
                }
              },
              {
                // just a comment for a test //
                icon: 'nf nf-fa-search_minus',
                text: bbn._('Find previous'),
                action: () => {
                  if (this.currentEditor) {
                    this.currentEditor.findPrevious();
                  }
                }
              },
              {
                icon: 'nf nf-fa-search_plus',
                text: bbn._('Find next'),
                action: () => {
                  if (this.currentEditor) {
                    this.currentEditor.findNext();
                  }
                }
              },
              {
                icon: 'nf nf-md-find_replace',
                text: bbn._('replace all'),
                action: () => {
                  if (this.currentEditor) {
                    this.currentEditor.replaceAll();
                  }
                }
              },
              {
                icon: 'nf nf-cod-fold_up',
                text: bbn._('Fold all'),
                action: () => {
                  if (this.currentEditor) {
                    this.currentEditor.foldAll();
                  }
                }
              },
              {
                icon: 'nf nf-cod-fold_down',
                text: bbn._('Unfold all'),
                action: () => {
                  if (this.currentEditor) {
                    this.currentEditor.unfoldAll();
                  }
                }
              }
            ]
          }, {
            text: bbn._('Preferences'),
            items: [
              {
                icon: 'nf nf-md-shape_plus',
                text: bbn._('Theme'),
                action: () => {
                  if (this.currentEditor) {
                    this.currentEditor.themeSettings();
                  }
                }
              },
            ]
          }
        ];

        return menu;
      },

      /**
       * Type of the current path
       *
       * @computed currentPathType
       * @return {Object}
       */
      currentType() {
        if (this.currentTypeCode && this.currentPathType?.types) {
          return bbn.fn.getRow(this.currentPathType.types, { type: this.currentTypeCode });
        }

        return null;
      },
      currentTab() {
        if (this.currentTypeCode && this.typeOptions) {
          return bbn.fn.getRow(this.typeOptions, { code: this.currentTypeCode });
        }

        return null;
      },
      /**
       * Type of the current path
       *
       * @computed currentPathType
       * @return {Object}
       */
      currentPathType() {
        if (this.currentPath && this.typeOptions) {
          return bbn.fn.getRow(this.typeOptions, { id: this.currentPath.id_alias });
        }

        return null;
      },
      /**
       * The current path
       *
       * @computed currentPath
       * @return {Object}
       */
      currentPath() {
        if (this.currentPathId && this.source?.project?.path) {
          return bbn.fn.getRow(this.source.project.path, { id: this.currentPathId });
        }

        return null;
      },
      /**
       * Name of the current path
       *
       * @computed currentPathName
       * @return {String}
       */
      currentPathName() {
        return this.currentPath ? this.currentPath.text : "";
      },
      /**
       * Current root of the selected file
       *
       * @computed currentRoot
       * @return {String}
       */
      currentRoot() {
        if (!this.currentPath) {
          return '';
        }

        let st = this.currentPath.parent_code + '/' + this.currentPath.code + '/';
        if (this.currentType) {
          st += this.currentType.path;
        }
        return st;
      }
    },
    methods: {
      getRecentFiles() {
        bbn.fn.post(appui.plugins['appui-ide'] + '/data/recent/files', {}, (d) => {
          if (d.success) {
            let res = [];
            for (let i = 0; i < d.data.length; i++) {
              let text = ((d.data[i].file).slice()).replace(/\/_end_.*/g, "");
              if (!bbn.fn.getRow(res, { text: text })) {
                res.push({
                  icon: "nf nf-fa-file",
                  file: d.data[i].file,
                  text: text,
                  action: (index, data) => {
                    this.getRef('router').route('file\/' + data.file);
                  }
                })
              }
            }
            let menu = this.getRef('mainMenu')?.currentData[0]?.data?.items;
            if (menu) {
              menu[menu.length - 1].items = res;
            } else {
              setTimeout(() => {
                this.getRecentFiles();
              }, 5000);
            }
          }
        })
      },
      openHistory() {
        this.find('appui-ide-editor-router').openHistory();
      },
      test() {
        const container = this.getRef('router').getFinalContainer();
        const component = container.closest('appui-ide-editor-router');
        bbn.fn.log(["COMPONENT change 1", component, this.source.isComponent, component.source]);
        if (this.source.isComponent && component) {
          let url = component.views[component.selected].url;
          bbn.fn.log("URL change 1", url);
          let root = '';
          bbn.fn.log("ROOT change 1", root);
          let cp = '';
          bbn.fn.log("CP change 2", cp);
          let foundComponents = false;
          bbn.fn.log("FOUNDCOMPONENTS change 1", foundComponents);
          // Removing file/ and /_end_
          let bits = url.split('/');
          bbn.fn.log("BITS change 1", bits);
          bits.splice(0, 1);
          bbn.fn.log("BITS change 2", bits);
          bits.splice(bits.length - 2, 2);
          bbn.fn.log("BITS change 3", bits);

          bbn.fn.each(bits, (a) => {
            if (a === 'components') {
              foundComponents = true;
              bbn.fn.log("FOUNDCOMPONENTS change 2", foundComponents);
            }
            else if (!foundComponents) {
              root += a + '/';
              bbn.fn.log("ROOT change 2", root);
            }
            else {
              cp += a + '-';
              bbn.fn.log("CP change 3", cp);
            }
          });
          if (cp) {
            let found = false;
            bbn.fn.log("FOUND change 1", found)
            root = root.substring(0, root.length - 1);
            bbn.fn.log("ROOT change 3", root);
            cp = cp.substring(0, cp.length - 1);
            bbn.fn.log("CP change 4", cp);
            bbn.fn.log("ROOT", root, "CP", cp, "PREFIX", bbn.env.appPrefix);
            if (root === 'app/main') {
              found = bbn.env.appPrefix + '-' + cp;
              bbn.fn.log("FOUND change 4", found)
            }
            else if (root === 'BBN_CDN_PATH/lib/bbn-vue') {
              found = 'bbn-' + cp;
              bbn.fn.log("FOUND change 5", found)
            }
            else {
              bbn.fn.iterate(appui.plugins, (a, n) => {
                if (root.indexOf('lib/' + n) === 0) {
                  found = n + '-' + cp;
                  bbn.fn.log("FOUND change 6", found)
                  return false;
                }
              })
            }
            if (found) {
              bbn.fn.log("FOUND HERE", found);
              bbn.version++;
              bbn.cp.unloadComponent(found);
              appui.info(bbn._("The component has been deleted") + '<br>' + bbn._("Loading a page with this component will redefine it."));
            } else {
              appui.error(bbn._("Impossible to retrieve the name of the component"));
            }
          }
        }
        else {
          if (component.source.settings) {
            /** @todo All this part doesmn't work */
            bbn.fn.log("THIS IS IN SETTINGS, CHECK IT IN components/editor");
            let key = this.currentURL.substring(0, this.currentURL.indexOf('_end_/') + 5),
              mvc = this.findByKey(key).find('appui-ide-mvc').$data,
              pathMVC = mvc.path;
            bbn.fn.log("KEY change 1", key);
            bbn.fn.log("MVC change 1", mvc);
            bbn.fn.log("PATHMVC change 1", pathMVC);
            if (pathMVC.indexOf('mvc/') === 0) {
              pathMVC = pathMVC.replace("mvc/", "");
              bbn.fn.log("PATHMVC change 2", pathMVC);
            }
            let link = (mvc.route ? mvc.route + '/' : '') +
              (pathMVC === 'mvc' ? '' : pathMVC + '/') + mvc.filename;
            if (bbn.fn.baseName(link) === 'index') {
              window.open(bbn.env.host + '/' + link);
            }
            else {
              appui.find('bbn-router').load(link, true);
            }
          }
          else {
            if (component.source.isMVC) {
              let pathMVC = component.source.path;
              pathMVC = pathMVC.replace("mvc/", "");
              let link = component.source.route + pathMVC;
              if (bbn.fn.baseName(link) === 'index') {
                window.open(bbn.env.host + '/' + link);
              }
              else {
                appui.route(link, true);
              }

              return;
            }
            if (typeof (this.find('appui-ide-coder').myMode) === 'string') {
              switch (this.find('appui-ide-coder').myMode) {
                case "php":
                  if (!this.isLib) {
                    bbn.fn.post(
                      this.root + "test",
                      {
                        code: this.value,
                        file: this.fullPath
                      },
                      d => {
                        const tn = this.closest('bbn-router'),
                          idx = tn.views.length;
                        tn.add({
                          label: dayjs().format('HH:mm:ss'),
                          icon: 'nf nf-fa-cogs',
                          load: false,
                          content: d.content,
                          url: 'output' + idx,
                          selected: true
                        });
                        this.$nextTick(() => {
                          tn.route('output' + idx);
                        });
                      }
                    );
                  }
                  else {
                    this.alert(bbn._('Unable to test classes!!'));
                  }
                  break;
                case "js":
                  eval(this.value);
                  break;
                case "svg":
                  const oDocument = new DOMParser().parseFromString(this.value, "text/xml");
                  if ((oDocument.documentElement.nodeName == "parsererror") || !oDocument.documentElement) {
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
          }
        }
      },
      /**
       * New file|directory dialog
       *
       * @param string title The dialog's title
       * @param bool isFile A boolean value to identify if you want create a file or a folder
       * @param string path The current path
       */
      openNew(title, isFile, node = false) {
        let editor = this.source
        bbn.fn.log("lol", editor);
        editor.types = this.types;
        let repositories = {};
        let repositoryProject;
        for (let repository of this.source.project.path) {
          if (!repository.alias) {
            bbn.fn.log("NO ATLAS", repository)
            continue;
          }
          let name = repository.parent_code + '/' + repository.code;
          repositories[name] = bbn.fn.extend({}, {
            alias_code: repository.alias.code,
            bcolor: repository.bcolor,
            code: repository.code,
            default: true,
            fcolor: repository.fcolor,
            id: repository.id,
            id_alias: repository.id_alias,
            id_parent: repository.id_parent ?? null,
            language: repository.language,
            name,
            num: repository.alias.num,
            num_children: repository.alias.num_children,
            path: repository.path,
            root: repository.parent_code,
            text: repository.text,
            label: repository.code,
            types: repository.alias.types,
            tabs: editor.types[this.currentTypeCode === 'classes' ? 'cls' : this.currentTypeCode].tabs
          })
          if (repository.id === this.currentPathId) {
            repositoryProject = repositories[name];
            bbn.fn.log("repositoryProject", repositoryProject);
          }
        }
        if (!repositoryProject) {
          bbn.fn.log("NO REPOSITORY PROJECT");
          return;
        }

        let src = {
          allData: false,
          isFile,
          path: '',
          node,
          id_project: this.closest('appui-project-ui').source.project.id,
          template: null,
          repositoryProject,
          currentRep: repositoryProject.name,
          repositories,
          root: this.root,
          project: editor.project,
          //parent: false,
          type: false,
          isProject: true
        };
        //case top menu

        //bbn.fn.log("ide NODE", node);
        if (this.currentTypeCode !== false) {
          src.type = this.currentTypeCode;
          if (src.type !== 'mvc') {
            //src.path = repositoryProject.types.find(type => type.type === src.type).path
          }
        }

        if (bbn.fn.isObject(node?.data)) {
          if (node.numChildren > 0) {
            if (!node.isExpanded) {
              node.isExpanded = true;
            }
          }

          if (node.data.isComponent) {
            src.path += node.data.uid.replace(node.data.name + '/' + node.data.name, node.data.name);
          }//other types
          else {
            //src.path = node.data.path;
            src.path += node.data.uid;
          }

          bbn.fn.log("OPEN NEW", node.data)
          src.allData = node.data;
          src.tab = node.data.tab;
          src.type = node.data.type;
        }
        bbn.fn.log(["SRC", src, node]);
        //check path
        src.path = src.path.replace('//', '/');

        //src.prefix = this.prefix;
        bbn.fn.log("PATH: " + src.path);
        if (!bbn.fn.isObject(node?.data) || node.data.folder) {
          this.closest("bbn-container").getRef('popup').open({
            label: title,
            maximizable: true,
            component: 'appui-ide-popup-new',
            source: src,
          });
        }
      },
      /**
       * Opens a dialog for create a new file
       *
       * @param node  set at false if click of the context node is data of the node tree
       */
      newElement(node = false) {
        let title = bbn._('New File');
        if (this.isProject && bbn.fn.isObject(node) &&
          ((node.data.type !== false) || (this.typeProject !== false))
        ) {
          if (((node !== false) && (node.data.type === 'components')) || (this.typeProject === 'components')) {
            title = bbn._('New Component') + ` <i class='nf nf-fa-vuejs'></i>`;
          }
          else if (((node !== false) && (node.data.type === 'lib')) || (this.typeProject === 'lib')) {
            title = bbn._('New Class');
          }
        }

        //bbn.fn.log("NODE", node);
        this.openNew(title, true, node);
      },

      /**
       * Opens a dialog for create a new directory
       * @param node  set at false if click of the context node is data of the node tree
       */
      newDir(node) {
        this.openNew(bbn._('New Directory'), false, node);
      },
      iconColor(node) {
        return node.data.bcolor;
      },
      showNodeCode(node) {
        bbn.fn.log(node.data);
      },
      treeNodeActivate(d, e) {
        e.preventDefault();
        bbn.fn.log("file = ", d);
        this.openFile(d);
      },
      openFile(file, node) {
        bbn.fn.log("FILE22", file);
        let tab = '';
        let link = '';
        let currentRoot = this.currentRoot;
        let root = bbn.fn.getRow(this.source.project.path, { id: file.data.id_path });
        if (root) {
          currentRoot = root.parent_code + '/' + root.code + '/';
          bbn.fn.log("THERE IS TYPE", file.data.type, currentRoot);
          if (file.data.type) {
            currentRoot += (file.data.type + '/');
          }
        }


        if ((file.data.type === 'mvc')) {
          tab = file.data.tab;
          link = 'file/' +
            currentRoot +
            (file.data.dir || '') +
            file.data.uid +
            '/_end_/' + tab;
        }
        else if ((file.data.type === 'components')) {
          link = 'file/' + currentRoot + file.data.uid + '/_end_/' + (file.data.tab || 'js');
        }
        else {
          link = 'file/' + currentRoot + file.data.uid + '/_end_/' + (file.data.tab || 'code');
        }
        if (link) {
          link = link.replace(/\/\//g, '/');
          bbn.fn.log("link = " + link);
          this.getRef('router').route(link);
          bbn.fn.log("router", this.getRef('router'));
          setTimeout(() => {
            this.getRecentFiles();
          }, 3000);
        }
      },
      treeReload() {
        if (this.getRef('tree')) {
          this.getRef('tree').reload();
        }
      },
      moveNode() {
        if (dest.data.folder) {
        }
        else {
          appui.error(bbn._('The recipient node is not a folder'));
          this.treeReload();
        }
      },
      mapTree(data) {
        data.text += data.git === true ? "  <i class='nf  nf-fa-github'></i>" : ""
        if (this.currentTab.tabs && data.tab) {
          data.bcolor = bbn.fn.getField(this.currentTab.tabs, 'bcolor', { url: data.tab }) || data.bcolor;
        }
        return data;
      },
      getLink(file) {
        let tab = '',
          link = '';
        bbn.fn.log("currentRoot = " + this.currentRoot);
        if ((file.data.type === 'mvc')) {
          tab = file.data.tab;
          link = 'file/' +
            this.currentRoot +
            (file.data.dir || '') +
            file.data.uid +
            '/_end_/' + tab;
        }
        else if ((file.data.type === 'component')) {
          link = 'file/' + this.currentRoot + file.data.uid + '/_end_/' + (tab || 'js');
        }
        else {
          link = 'file/' + this.currentRoot + file.data.uid + '/_end_/' + (tab || 'code');
        }

        if (link) {
          link = link.replace(/\/\//g, '/');
          bbn.fn.log("link = " + link);
          this.getRef('router').route(link);
          bbn.fn.log("router", this.getRef('router'));
        }
      },
      getPathByNode(node) {
        bbn.fn.log("CURRENT", this.currentRoot);
        bbn.fn.log("node", node.data);
        let url = node.data.uid;
        if (this.currentTypeCode && this.currentTypeCode === 'components' && node.data.isComponent) {
          url = node.data.uid.replace(node.data.name + '/' + node.data.name, node.data.name);
        }
        url = this.currentRoot + url;
        url = url.replace(/\/\//g, '/');
        return url;
      },
      treeMenu(node) {
        const nodeParent = node.parent.$parent.find('bbn-tree');
        //bbn.fn.log("NODE", node);
        let res = [];

        res.push({
          icon: 'nf nf-md-folder_plus',
          text: bbn._('New directory'),
          action: () => {
            this.newDir(node);
          }
        })

        if (this.currentTypeCode === 'components') {
          res.push(
            {
              icon: 'nf nf-md-cube_outline',
              text: bbn._('New component'),
              action: () => {
                this.openNew(bbn._('New Component'), true, node);
              }
            }
          )
        }

        if (this.currentTypeCode === 'mvc') {
          res.push(
            {
              icon: 'nf nf-fa-create',
              text: bbn._('New mvc'),
              action: () => {
                this.openNew(bbn._('New mvc'), true, node);
              }
            }
          )
        }

        if (this.currentTypeCode === 'classes') {
          res.push(
            {
              icon: 'nf nf-fa-create',
              text: bbn._('New classe'),
              action: () => {
                this.openNew(bbn._('New classe'), true, node);
              }
            }
          )
        }

        if (this.currentTypeCode === 'cli') {
          res.push(
            {
              icon: 'nf nf-fa-create',
              text: bbn._('New cli'),
              action: () => {
                this.openNew(bbn._('New cli'), true, node);
              }
            }
          )
        }

        res.push({
          icon: 'nf nf-md-content_copy',
          text: bbn._('Copy'),
          action: async () => {
            bbn.fn.log(node);
            this.copiedNode = node;
            this.isCut = false;
            await navigator.clipboard.write([
              new ClipboardItem({
                'text/plain': new Blob([
                  this.copiedNode
                ], {
                  type: 'text/plain'
                })
              })
            ])
            let bbnappui = this.closest('bbn-appui');
            let clipboard = bbnappui.find('bbn-clipboard');
          }
        })

        res.push({
          icon: 'nf nf-md-content_cut',
          text: bbn._('Cut'),
          action: () => {
            bbn.fn.log(node);
            this.copiedNode = node;
            this.isCut = true;
          }
        })

        if (this.copiedNode && node.data.folder) {
          res.push({
            icon: 'nf nf-md-content_paste',
            text: bbn._('Paste'),
            action: () => {
              if (this.isCut) {
                bbn.fn.post(this.root + 'editor/actions/move', {
                  url_src: this.getPathByNode(this.copiedNode),
                  url_dest: this.getPathByNode(node),
                  data_src: this.copiedNode.data,
                  data_dest: node.data,
                  id_project: this.closest('appui-project-ui').source.project.id
                }, (d) => {
                  if (d.success) {
                    appui.success(bbn._('Success'));
                    nodeParent.reload();
                  } else {
                    appui.error(bbn._('Error'));
                  }
                })
                return;
              }
              this.getPopup({
                component: "appui-ide-form-copy",
                componentOptions: {
                  source: {
                    node,
                    name: this.copiedNode.data.name,
                    url_src: this.getPathByNode(this.copiedNode),
                    url_dest: this.getPathByNode(node),
                    data_src: this.copiedNode.data,
                    data_dest: node.data,
                    id_project: this.closest('appui-project-ui').source.project.id
                  }
                },
                label: bbn._('Copy')
              });
            }
          });
        }

        res.push({
          icon: 'nf nf-fa-edit',
          text: bbn._('Rename'),
          action: () => {
            this.getPopup({
              component: "appui-ide-form-rename",
              componentOptions: {
                source: bbn.fn.extend({}, node.data, {node})
              },
              label: bbn._("Rename")
            });
          }
        });

        if (node.data.isComponent) {
          if (node.data.numChildren) {
            res.push({
              icon: 'nf nf-fa-trash_o',
              text: bbn._('Delete the whole folder'),
              action: () => {
                this.getPopup().confirm(bbn._("Are you sure you want to delete this folder?"), () => {
                  let url = node.data.uid;
                  const bits = url.split('/');
                  if ((bits[bits.length-1] === this.source.name) && (bits[bits.length-2] === this.source.name)) {
                    bits.splice(i - 1, 1);
                    url = bits.join('/');
                  }
                  url = this.currentRoot + url;
                  this.realDelete(nodeParent, {
                    url,
                    id_project: this.source.project.id,
                    data: bbn.fn.extend({}, node.data, {folder: true})
                  })
                });
              }
            })
          }

          res.push({
            icon: 'nf nf-fa-trash_o',
            text: bbn._('Delete'),
            action: () => {
              this.getPopup().confirm(bbn._("Are you sure you want to delete this component?"), () => {
                let url = node.data.uid;
                if (this.currentTypeCode && this.currentTypeCode === 'components') {
                  const bits = url.split('/');
                  if ((bits[bits.length-1] === this.source.name) && (bits[bits.length-2] === this.source.name)) {
                    bits.splice(i - 1, 1);
                    url = bits.join('/');
                  }
                }
                url = this.currentRoot + url;
                this.realDelete(nodeParent, {
                  url,
                  id_project: this.source.project.id,
                  data: bbn.fn.extend({}, node.data, {folder: false})
                })
              });
            }
          })
        }
        else {
          res.push({
            icon: 'nf nf-fa-trash_o',
            text: bbn._('Delete'),
            action: () => {
              this.getPopup().confirm(bbn._("Are you sure you want to delete this file?"), () => {
                let url = this.currentRoot + node.data.uid;
                this.realDelete(nodeParent, {
                  url,
                  id_project: this.source.project.id,
                  data: node.data
                })
              });
            }
          })
        }

        return res;
      },
      realDelete(nodeParent, cfg) {
        bbn.fn.post(this.root + 'editor/actions/delete', cfg, d => {
          if (d.success) {
            appui.success(bbn._('Deleted'));
            nodeParent.reload();
          } else {
            appui.error(bbn._('Error'));
          }
        })
      },
      getPopup() {
        return this.closest('bbn-container').getPopup(...arguments);
      },
      setNodeData(node) {
        if (!node) {
          return this.treeData;
        }

        return bbn.fn.extend({}, this.treeData, { isComponent: node.isComponent, uid: node.uid, name: node.name });
      }
    },
    /**
     * @event created
     * @fires fn.post
     */
    created() {
      const cfg = this.getStorage();
      if (cfg) {
        if (cfg.typeCode && (cfg.typeCode !== this.currentTypeCode)) {
          this.currentTypeCode = cfg.typeCode;
        }
        if (cfg.pathId && (cfg.pathId !== this.currentPathId)) {
          this.currentPathId = cfg.pathId;
        }
      }

      this.treeData = {
        id_project: this.source.project.id,
        type: this.currentTypeCode,
        id_path: this.currentPathId
      };
      if (!appui.projects.options.ide) {
        bbn.fn.post(appui.plugins['appui-ide'] + "/data/types", d => {
          this.typeOptions = d.types;
          appui.projects.options.ide = {
            types: d.types
          };
          this.typeOptions = appui.projects.options.ide.types;
          this.ready = true;
        });
      }
      else {
        this.typeOptions = appui.projects.options.ide.types;
        this.ready = true;
      }
    },
    mounted() {
      if (!bbn.doc) {
        bbn.doc = {};
      }
      this.getRecentFiles();
      this.container = this.closest('bbn-container');
      if (!this.types) {
        bbn.fn.post(this.root + 'data/path/types', {}, (d) => {
          this.types = d.types;
          bbn.ide = d.types;
        });
      }
    },
    watch: {
      currentTypeCode(v) {
        this.treeData.type = v;
        this.setStorage({
          typeCode: this.currentTypeCode,
          pathId: this.currentPathId
        })
        if (v && this.currentPathType && this.currentPathType.types) {
          this.$nextTick(() => {
            const tree = this.getRef('tree');
            if (tree) {
              tree.updateData();
            }
          });
        }
      },
      currentPathId(v) {
        this.treeData.id_path = v;
        this.setStorage({
          typeCode: this.currentTypeCode,
          pathId: this.currentPathId
        })
        this.$nextTick(() => {
          const tree = this.getRef('tree');
          if (tree) {
            tree.updateData();
          }
        });
      }
    }
  };
})();
