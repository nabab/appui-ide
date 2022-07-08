/**
  * @file ide component
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
        root: appui.plugins['appui-newide'] + '/',
        myCode: "",
        themes: [
          "basicLight",
          "basicDark",
          "gruvboxDark",
          "gruvboxLight",
          "materialDark",
          "nordTheme",
          "solarizedDark",
          "solarizedLight"
        ],
        myTheme: "basicDark",
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
        container: null
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
        /*if ( !d.data.folder || (d.data.folder && d.data.is_vue) ){
          if( !this.isProject && !this.isMVC && this.existingTab(d) ){
            //change d.data.path for d.data.uid
            bbn.fn.link(
              'ide/editor/file/' +
              this.currentRoot +
              (d.data.uid || '') +
              '/_end_/code',
              true
            );
          }
          else{*/
        bbn.fn.log(d);
        this.openFile(d);
        //}
        //}
      },
      openFile(file) {
        let tab = '',
            link = '';
            //prefix = this.container.currentView.url + '/';
        //bbn.fn.log("prefix  = " + prefix);
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
          bbn.fn.log(link);
          this.getRef('router').route(link);
        }
      },
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