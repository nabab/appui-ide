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
      iconColor(node){
        return node.data.bcolor;
      },
      showNodeCode(node) {
        bbn.fn.log(node.data);
      },
      treeNodeActivate(d, e){
        e.preventDefault();
        bbn.fn.log("file = " + d);
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
        else{
          link = 'file/' +  this.currentRoot + file.data.uid + '/_end_/' + (file.data.tab || 'code');
        }
        if ( link ){
          bbn.fn.log("link = " + link);
          this.getRef('router').route(link);
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
      treeMenu(node) {
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