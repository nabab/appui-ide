/**
  * @file editor component
  *
  * @description Component use to initiate ide with useful options
  *
  * @copyright BBN Solutions
  *
  * @author Lucas Courteaud
  */

(() => {
  return {
    data() {
      return {
        /**
         * Root of the component
         *
         * @data {String} [appui.plugins['appui-newide'] + '/'] root
         */
        root: appui.plugins['appui-newide'] + '/',
        /**
         * Options of all paths types
         *
         * @data {Array} [null] typeOptions
         */
        typeOptions: null,
        /**
         * Id of the selected path
         *
         * @data {String} [''] currentPathId
         */
        currentPathId: this.source.project.path ? this.source.project.path[0].id_option : '',
        /**
         * Enable / Disable the dropdown to select path
         *
         * @data {Boolean} [false] isDropdownPathDisabled
         */
        isDropdownPathDisabled: false,
        /**
         * Id type of the selected path
         *
         * @data {String} [''] currentTypeCode
         */
        currentTypeCode: '',
        /**
         * Name of the selected file/folder
         *
         * @data {String} [''] nameSelectedElem
         */
        nameSelectedElem: '',
        /**
         * Vue object of this component's container
         *
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
        ]
      };
    },
    computed: {
      /**
       * Type of the current path
       *
       * @computed currentPathType
       * @return {Object}
       */
      currentType() {
        if (this.currentTypeCode && this.currentPathType.types) {
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
        if (this.currentPath) {
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
      /**
       * New file|directory dialog
       *
       * @param string title The dialog's title
       * @param bool isFile A boolean value to identify if you want create a file or a folder
       * @param string path The current path
       */
      openNew(title, isFile, node = false){
        let src = {
          allData: false,
          isFile: isFile,
          path: './',
          node: false,
          template: null,
          repositoryProject: false,
          currentRep: this.currentRep,
          repositories: this.repositories,
          root: this.source.root,
          //parent: false,
          type: false,
          isProject: this.isProject
        };
        //case top menu

        if ( !bbn.fn.isObject(node) ){
          src.path = './'
          //case project
          if ( this.typeProject !== false ){
            src.type =  this.typeProject;
            if ( this.source.projects.tabs_type[this.typeProject] !== undefined ){
              src.repositoryProject = !this.repositoryProject(this.typeProject) ? this.repositories[this.currentRep] : this.repositoryProject(this.typeProject);
            }
            src.path = this.typeProject;
          }
        }
        //of context
        else {
          src.tab_mvc = node.data.tab_mvc;
          if ( node.num > 0 ){
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
          if ( node.data.type !== false ){
            src.type =  node.data.type;
            src.repositoryProject = !this.repositoryProject(node.data.type) ? this.repositories[this.currentRep] : this.repositoryProject(node.data.type);
            //case component
            if ( node.data.type === 'components' ){
              //if (  node.data.path.indexOf(node.data.dir + node.data.name + '/' + node.data.name) > -1 ){
              //src.path = node.data.path.replace( node.data.dir + node.data.name + '/' + node.data.name,  node.data.dir + node.data.name);
              if (  node.data.uid.indexOf(node.data.dir + node.data.name + '/' + node.data.name) > -1 ){
                src.path = node.data.uid.replace( node.data.dir + node.data.name + '/' + node.data.name,  node.data.dir + node.data.name);
              }
              else{
                //src.path = node.data.path;
                src.path = node.data.uid;
              }
            }//other types
            else{
              //src.path = node.data.path;
              src.path = node.data.uid;
            }
          }
          else{
            if ( node.data.folder ){
              //src.path = node.data.path;
              src.path = node.data.uid;
            }
          }
          src.allData = node.data;
        }
        //for root
        //src.prefix = this.prefix;
        if ( !bbn.fn.isObject(node) || node.data.folder ){
          //check path
          src.path = src.path.replace( '//',  '/');
          this.closest("bbn-container").getRef('popup').open({
            title: title,
            maximizable: true,
            component: 'appui-newide-popup-new',
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
        this.openNew(title, true, node);
      },

      /**
       * Opens a dialog for create a new directory
       *
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
				if (this.currentTab.tabs && data.tab) {
          data.bcolor = bbn.fn.getField(this.currentTab.tabs, 'bcolor', {url: data.tab}) || data.bcolor;
        }
        return data;
      },
      treeMenu(node) {
        bbn.fn.log("NODE", node);
        let obj = [
          {
            icon: 'nf nf-fa-edit',
            text: bbn._('Rename'),
            action: () => {
              this.getPopup({
                component: "appui-newide-form-rename",
                componentOptions: {
                  source: node.data
                },
                title: bbn._("Rename")
              });
            }
          },
          {
            icon: 'nf nf-fa-trash_o',
            text: bbn._('Delete'),
            action: () => {
              bbn.fn.log(node);
              this.getPopup({
                component: "appui-newide-form-delete",
                componentOptions: {
                  source: node.data
                },
                title: bbn._("Delete")
              });
            }
          },
          {
            icon: 'nf nf-mdi-content_copy',
            text: bbn._('Copy'),
            action: () => {
              bbn.fn.log(node);
              this.getPopup({
                component: "appui-newide-form-copy",
                componentOptions: {
                  source: node.data
                },
                title: bbn._("Copy")
              });
            }
          }
        ];
        return obj;
      }
    },
    /**
     * @event created
     * @fires fn.post
     */
    created() {
      if (!appui.projects.options.ide) {
        bbn.fn.post(appui.plugins['appui-newide'] + "/data/types", d => {
          this.typeOptions = d.types;
          appui.projects.options.ide = {
            types: d.types
          };
        });
      }
      else {
        this.typeOptions = appui.projects.options.ide.types;
      }
    },
    mounted() {
      this.container = this.closest('bbn-container');
    },
    watch: {
      currentTypeCode(v) {
        if (v && this.currentPathType && this.currentPathType.types) {
          this.$nextTick(() => {
            this.getRef('tree').updateData();
          });
        }
      },
      currentPathId(v) {
        this.$nextTick(() => {
          this.getRef('tree').updateData();
        });
      }
    }
  };
})();