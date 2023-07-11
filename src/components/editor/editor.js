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
        currentPathId: this.source?.project?.path ? this.source?.project?.path[0]?.id : '',
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
                action: this.newElement
              }, {
                icon: 'nf nf-fa-folder',
                text: bbn._('Directory'),
                action: this.newDir
              }]
            }]
          },
          {
            icon: 'nf nf-fa-save',
            text: bbn._('Save'),
            action: this.save
          }
        ],
        copiedNode: null,
        isCut: false
      };
    },
    computed: {
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
                icon: "nf nf-mdi-content_paste",
                text: bbn._('Paste'),
                action: () => {
                  if (this.copiedNode) {
                    if (this.isCut) {
                      bbn.fn.post(this.root + 'editor/actions/move', {
                        url_src: this.getPathByNode(this.copiedNode),
                        url_dest: this.currentRoot,
                        data_src: this.copiedNode.data,
                        data_dest: {uid: "/"},
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
                          url_dest:  this.currentRoot,
                          data_src: this.copiedNode.data,
                          data_dest: {uid: "/"},
                          id_project: this.closest('appui-project-ui').source.project.id
                        }
                      },
                      title: bbn._('Copy')
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
          },
          {
            text: bbn._('Search'),
            items: [
              {
                icon: 'nf nf-fa-search',
                text: bbn._('Find'),
                action: () => {
                  this.find('appui-ide-codemirror').openSearchPanel();
                }
              },
              {
                // just a comment for a test //
                icon: 'nf nf-fa-search_minus',
                text: bbn._('Find previous'),
                action: () => {
                  this.find('appui-ide-codemirror').findPrevious();
                }
              },
              {
                icon: 'nf nf-fa-search_plus',
                text: bbn._('Find next'),
                action: () => {
                  this.find('appui-ide-codemirror').findNext();
                }
              },
              {
                icon: 'nf nf-mdi-find_replace',
                text: bbn._('replace all'),
                action: () => {
                  this.find('appui-ide-codemirror').replaceAll();
                }
              },
              {
                icon: 'nf nf-cod-fold_up',
                text: bbn._('Fold all'),
                action: () => {
                  this.find('appui-ide-codemirror').foldAll();
                }
              },
              {
                icon: 'nf nf-cod-fold_down',
                text: bbn._('Unfold all'),
                action: () => {
                  this.find('appui-ide-codemirror').unfoldAll();
                }
              }
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
          return bbn.fn.getRow(this.currentPathType.types, {type: this.currentTypeCode});
        }
        return null;
      },
      currentTab() {
        if (this.currentTypeCode && this.typeOptions) {
          return bbn.fn.getRow(this.typeOptions, {code: this.currentTypeCode});
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
          return bbn.fn.getRow(this.typeOptions, {id: this.currentPath.id_alias});
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
        if (this.currentPathId) {
          return bbn.fn.getRow(this.source.project.path, {id: this.currentPathId});
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
              if (!bbn.fn.getRow(res, {text: text})) {
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
        let cp = this.find('appui-ide-editor-router');
        if (cp) {
          cp.test();
        }
      },
      /**
             * New file|directory dialog
             *
             * @param string title The dialog's title
             * @param bool isFile A boolean value to identify if you want create a file or a folder
             * @param string path The current path
             */
      openNew(title, isFile, node = false){
        let editor = this.source
        bbn.fn.log("lol" ,editor);
        editor.types = this.types;
        let repositories = {};
        let selected = this.source.project.path[0];
        //bbn.fn.log("HAAAAAAAAAAAAAAAAAAAAA", editor.types[this.currentTypeCode === 'classes' ? 'cls' : this.currentTypeCode]);
        for (let repository of this.source.project.path) {
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
            name: name,
            num: repository.alias.num,
            num_children: repository.alias.num_children,
            path: repository.path,
            root: repository.parent_code,
            text: repository.text,
            title: repository.code,
            types: repository.alias.types,
            tabs: editor.types[this.currentTypeCode === 'classes' ? 'cls' : this.currentTypeCode].tabs,

          })
          if (repository.id === this.currentPathId) {
            selected = repositories[name];
            bbn.fn.log("SELECTED", selected);
          }
        }
        let src = {
          allData: false,
          isFile: isFile,
          path: '',
          node: node,
          id_project: this.closest('appui-project-ui').source.project.id,
          template: null,
          repositoryProject: selected,
          currentRep: selected.name,
          repositories: repositories,
          root: this.root,
          project: editor.project,
          //parent: false,
          type: false,
          isProject: true
        };
        //case top menu

        //bbn.fn.log("NEWIDE NODE", node);
        if ( this.currentTypeCode !== false ){
          src.type =  this.currentTypeCode;
          if (src.type !== 'mvc') {
            src.path = selected.types.find(type => type.type === src.type).path
          }
        }

        if (  bbn.fn.isObject(node) ) {
          bbn.fn.log("node in")
          if ( node.numChildren > 0 ){
            bbn.fn.log("node in in")
            if( !node.isExpanded ){
              node.isExpanded = true;
            }
            //src.parent = bbn.vue.find(node, 'bbn-tree');
            this.nodeParent = bbn.vue.find(node, 'bbn-tree');
          }
          else{
            //src.parent= node.parent;
            this.nodeParent = node.parent;
          }
          //caseproject

          if ( node.data.is_vue ){
            src.path += node.data.uid.replace(node.data.name  + '/' + node.data.name, node.data.name);
          }//other types
          else{
            //src.path = node.data.path;
            src.path += node.data.uid;
          }

          src.allData = node.data;
        }
        bbn.fn.log("SRC", src);
        //check path
        src.path = src.path.replace( '//',  '/');
        //src.prefix = this.prefix;
        if ( !bbn.fn.isObject(node) || node.data.folder ){
          bbn.fn.log("ERJEJALJZRLJLKJRLEJZKL0");
          this.closest("bbn-container").getRef('popup').open({
            title: title,
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
      newElement(node = false){
        let title = bbn._('New File');
        if ( this.isProject && bbn.fn.isObject(node) &&
            ((node.data.type !== false) || (this.typeProject !== false))
           ){
          if ( ((node !== false) && (node.data.type === 'components')) || (this.typeProject === 'components') ){
            title = bbn._('New Component') +  ` <i class='nf nf-fa-vuejs'></i>`;
          }
          else if ( ((node !== false) && (node.data.type === 'lib')) || (this.typeProject === 'lib') ){
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
      newDir(node){
        this.openNew(bbn._('New Directory'), false, node != undefined && node ? node : false);
      },
      iconColor(node){
        return node.data.bcolor;
      },
      showNodeCode(node) {
        bbn.fn.log(node.data);
      },
      treeNodeActivate(d, e){
        e.preventDefault();
        bbn.fn.log("file = ", d);
        this.openFile(d);
      },
      openFile(file) {
        bbn.fn.log("FILE", file);
        let tab = '',
            link = '';
        bbn.fn.log("currentRoot = " + this.currentRoot);
        if ((file.data.type === 'mvc')) {
          tab = ((file.data.tab === "php") && (this.project === 'apst-app')) ? '/settings' :  '/' + file.data.tab;
          link = 'file/' +
            this.currentRoot +
            (file.data.dir || '') +
            file.data.name +
            '/_end_' + (tab.indexOf('_') === 0 ? '/' + tab : tab);
        }
        else if ((file.data.type === 'component')) {
          link = 'file/' +  this.currentRoot + file.data.uid + '/_end_/' + (file.data.tab || 'js');
        }
        else{
          link = 'file/' +  this.currentRoot + file.data.uid + '/_end_/' + (file.data.tab || 'code');
        }
        if ( link ){
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
        if ( this.getRef('tree') ){
          this.getRef('tree').reload();
        }
      },
      moveNode() {
        if (dest.data.folder) {
        }
        else {
          alert(bbn._('The recipient node is not a folder'));
          this.treeReload();
        }
      },
      mapTree(data) {
        data.text += data.git === true ?  "  <i class='nf  nf-fa-github'></i>" : ""
        if (this.currentTab.tabs && data.tab) {
          data.bcolor = bbn.fn.getField(this.currentTab.tabs, 'bcolor', {url: data.tab}) || data.bcolor;
        }
        return data;
      },
      getLink(file) {
        let tab = '',
            link = '';
        bbn.fn.log("currentRoot = " + this.currentRoot);
        if ((file.data.type === 'mvc')) {
          tab = ((file.data.tab === "php") && (this.project === 'apst-app')) ? '/settings' :  '/' + file.data.tab;
          link = 'file/' +
            this.currentRoot +
            (file.data.dir || '') +
            file.data.name +
            '/_end_' + (tab.indexOf('_') === 0 ? '/' + tab : tab);
        }
        else if ((file.data.type === 'component')) {
          link = 'file/' +  this.currentRoot + file.data.uid + '/_end_/' + (file.data.tab || 'js');
        }
        else{
          link = 'file/' +  this.currentRoot + file.data.uid + '/_end_/' + (file.data.tab || 'code');
        }
        if ( link ){
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
        if (this.currentTypeCode && this.currentTypeCode === 'components' && node.data.is_vue) {
          url = node.data.uid.replace(node.data.name  + '/' + node.data.name, node.data.name);
        }
        url = this.currentRoot + url;
        url = url.replace(/\/\//g, '/');
        return url;
      },
      treeMenu(node) {
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
              icon: 'nf nf-fa-create',
              text: bbn._('New components'),
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
          icon: 'nf nf-mdi-content_copy',
          text: bbn._('Copy'),
          action: async () => {
            bbn.fn.log(node);
            this.copiedNode = node;
            this.isCut = false;
            await navigator.clipboard.write([
              new ClipboardItem({
                'text/plain': new Blob([
                  this.copiedNode
                ],{
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
          if (node.data.numChildren > 0) {
            this.nodeParent = bbn.vue.find(node, 'bbn-tree');
          } else {
            this.nodeParent = bbn.vue.find(node.parent.$parent, 'bbn-tree');
          }
          res.push({
            icon: 'nf nf-mdi-content_paste',
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
                    this.nodeParent.reload();
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
                    url_dest: this.getPathByNode(node),
                    data_src: this.copiedNode.data,
                    data_dest: node.data,
                    id_project: this.closest('appui-project-ui').source.project.id
                  }
                },
                title: bbn._('Copy')
              });
            }
          });
        }

        res.push({
          icon: 'nf nf-fa-edit',
          text: bbn._('Rename'),
          action: () => {
            this.nodeParent = bbn.vue.find(node.parent.$parent, 'bbn-tree');
            this.getPopup({
              component: "appui-ide-form-rename",
              componentOptions: {
                source: node.data
              },
              title: bbn._("Rename")
            });
          }
        });

        res.push({
          icon: 'nf nf-fa-trash_o',
          text: bbn._('Delete'),
          action: () => {
            this.nodeParent = bbn.vue.find(node.parent.$parent, 'bbn-tree');
            bbn.fn.log("CHOICE", node);
            bbn.fn.log("CHOICE NODE PARENT", this.nodeParent);
            if (this.nodeParent && this.nodeParent.data.numChildren === 1) {
              this.nodeParent = bbn.vue.find(node.$parent.$parent, 'bbn-tree');
            }
            bbn.fn.log(node);
            this.getPopup({
              component: "appui-ide-form-delete",
              componentOptions: {
                source: node.data
              },
              title: bbn._("Delete")
            });
          }
        })

        return res;
      },
      async initData() {
        if (!appui.projects.options.ide) {
          const d = await bbn.fn.post(appui.plugins['appui-ide'] + "/data/types");
          if (!d?.data?.types) {
            throw new Error(bbn._("Impossible to retrieve the types"));
          }
          this.typeOptions = d.data.types;
          appui.projects.options.ide = {
            types: d.data.types
          };
        }
        if (!this.types) {
          const d = await bbn.fn.post(this.root + 'data/path/types');
          if (!d.data.types) {
            throw new Error(bbn._("Impossible to retrieve the second? types"));
          }
          this.types = d.data.types;
          bbn.ide = d.data.types;
        }

        this.ready = true;
        this.$forceUpdate();
        this.getRecentFiles();
      }
    },
    /**
     * @event created
     * @fires fn.post
     */
    created() {
      if (!bbn.doc) {
        bbn.doc = {};
      }
    },
    mounted() {
      this.initData();
    },
    watch: {
      currentTypeCode(v) {
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