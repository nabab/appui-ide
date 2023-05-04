// Javascript Document

(() => {
  let modeCode = {
    js: 'javascript',
    php: 'php',
    css: 'css',
    less: 'css',
    html: 'html',
    json: 'json',
    xml: 'xml',
    md: 'md',
    sql: 'sql',
    scss: 'css'
  };
  return {
    /**
                   * @mixin bbn.vue.basicComponent
                   * @mixin bbn.vue.inputComponent
                   * @mixin bbn.vue.eventsComponent
                   */
    mixins:
    [
      bbn.vue.basicComponent,
      bbn.vue.inputComponent,
      bbn.vue.eventsComponent
    ],
    props: {
      /**
                      * Language passed in props of the component
                      *
                      * @prop {String} [php] mode
                      */
      mode: {
        type: String,
        default: 'js',
        validation(v) {
          return !!modeCode[v];
        }
      },
      /**
                      * Theme passed in props of the component
                      *
                      * @prop {String} [basicLight] theme
                      */
      theme: {
        type: String,
        default: 'basicLight'
      }
    },
    data() {
      return {
        /**
                        * Widget containing the codemirror instance
                        *
                        * @data {Object} [null] widget
                        */
        widget: null,
        /**
                        * Mode use to display the content of file
                        *
                        * @data {Object} [null] currentMode
                        */
        currentMode: this.mode,
        /**
                        * Current theme use
                        *
                        * @data {Object} [null] currentTheme
                        */
        currentTheme: this.theme,
        state: null,
        lastKeyDown: null
      };
    },
    /**
                    * @event mounted
                    */
    mounted() {
      bbn.fn.log("COMPONENTS/CODEMIRROR THEME/MODE", this.theme, this.mode);
      if (!window.codemirror6) {
        let ele = document.createElement('script');  // temporary
        ele.src = '/cm.js';
        ele.onload = () => {
          bbn.fn.log(ele);
          this.init();
        };
        document.getElementsByTagName("head")[0].appendChild(ele);
      }
      else {
        this.init();
      }
    },
    methods: {
      foldAll() {
        window.codemirror6.language.foldAll(this.widget);
        //window.codemirror6.language.foldInside(window.codemirror6.language.syntaxTree(this.widget));
      },
      unfoldAll() {
        window.codemirror6.language.unfoldAll(this.widget);
      },
      openSearchPanel() {
        window.codemirror6.search.openSearchPanel(this.widget);
      },
      closeSearchPanel() {
        window.codemirror6.search.closeSearchPanel(this.widget);
      },
      findNext() {
        window.codemirror6.search.findNext(this.widget);
      },
      findPrevious() {
        window.codemirror6.search.findPrevious(this.widget);
      },
      replaceAll() {
        window.codemirror6.search.replaceAll(this.widget);
      },
      /**
                      * Return an array with extensions give in cfg
                      *
                      * @method getExtensions
                      * @param {Object} cfg Configue of extensions
                      * @return {Array}
                      */
      getExtensions() {
        let cm = window.codemirror6;
        cm.getBasicExtensions();
        if (!this.currentMode || !this.currentTheme) {
          throw new Error("You must provide a language and a theme");
        }
        if (!cm.languageExtensions[modeCode[this.currentMode]]) {
          throw new Error("Unknown language");
        }
        if (!cm.themeExtensions[this.currentTheme]) {
          throw new Error("Unknown theme");
        }
        let extensions = [];
        for (let n in cm.ext) {
          extensions.push(cm.ext[n]);
        }
        extensions.push(cm.languageExtensions[modeCode[this.currentMode]]);
        extensions.push(cm.themeExtensions[this.currentTheme]);
        switch (this.currentMode) {
          case "javascript":
            extensions.push(cm.javascript.javascript());
            break;
          case "html":
            extensions.push(cm.html.html());
            break;
          case "php":
            extensions.push(cm.php.php({
              baseLanguage: cm.languageExtensions.html
            }));
            break;
          case "css":
            extensions.push(cm.css.css());
            break;
          case "json":
            extensions.push(cm.json.json());
            break;
          case "xml":
            extensions.push(cm.xml.xml());
            break;
          case "md":
            extensions.push(cm.markdown.markdown());
            break;
        }
        extensions.push(cm.autocomplete.autocompletion({override: [this.completionSource]}));
        bbn.fn.log(this.currentMode, extensions);
        return extensions;
      },
      /**
                      * Return an array with options of autocompletions
                      *
                      * @method completionSource
                      * @param {String} context Text in text-area of the instance codemirror
                      * @return {Object}
                      */
      completionSource(context) {
        let word = context.matchBefore(/\w*/);
        let fn          = this.getWidgetCompletion();
        let res         = fn(context);


        bbn.fn.log("RES", res);

        if (!res || !res.options) {
          res = {options: []};
        }


        res.options.unshift(...[
          {label: "match", type: "keyword"},
          {label: "hello", type: "variable", info: "Hello<br>World"},
          {label: "baba", type: "function", info() {
            return new Promise((resolve, reject) => {
              bbn.fn.log('baba');
              let div = document.createElement('p');
              div.className = 'bbn-padding bbn-no-margin';
              div.innerHTML = "Hello<br>World";
              resolve(div);
            });
          }},
          {label: "dada", type: "function", info() {
            return new Promise((resolve, reject) => {
              bbn.fn.log('dada');
              let div = document.createElement('p');
              div.className = 'bbn-no-padding bbn-no-margin';
              div.innerHTML = "Hello<br>World2";
              resolve(div);
            });
          }},
          {label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "Hello World"}
        ]);

        return res;
      },

      createVueConfiguration() {
        const config = {
          extraTags: {},
          extraGlobalAttributes: {},
        }
        let components = Object.keys(Vue.options.components).sort();
        bbn.fn.iterate(Vue.options.components, (cp, cpName) => {
          bbn.fn.log(cpName);
          config.extraTags[cpName] = {};
          if (cp.options && cp.options.props) {
            config.extraTags[cpName].attrs = {}

            bbn.fn.iterate(cp.options.props, (prop, propName) => {
              config.extraTags[cpName].attrs[bbn.fn.camelToCss(propName)] = null;
              config.extraTags[cpName].attrs[":" + bbn.fn.camelToCss(propName)] = null;
              bbn.fn.log(propName, prop.type);
            })
          }
        });

				return config;
      },

      getWidgetCompletion() {

        const Myconfig = this.createVueConfiguration();

        let res = null;
        switch (this.currentMode) {
          case 'html':
            res = window.codemirror6.html.htmlCompletionSourceWith(Myconfig);
            break;
          case 'php':
            res = window.codemirror6.html.htmlCompletionSource;
            break;
          case 'js':
            res = window.codemirror6.javascript.localCompletionSource;
            break;
          case 'css':
            res = window.codemirror6.css.cssCompletionSource;
            break;
        }
        bbn.fn.log("HAAAAAAAAAAAAAA", res);
        if (!res) {
          res = () => {
            return {
              options: []
            };
          };
        }
        return res;
      },
      /**
                      * Update code in editor and do an emitInput
                      *
                      * @method onChange
                      * @param {String} tr Text in text-area of the instance codemirror
                      * @return {Object}
                      */
      onChange(tr) {
        this.widget.update([tr]);
        let value = this.widget.state.doc.toString();
        if (value !== this.value) {
          this.emitInput(value);
        }
      },
      /**
                      * Initialize a new instance of codemirror in this.widget
                      *
                      * @method init
                      * @return {Object}
                      */
      init() {
        let cm = window.codemirror6;
        let extensions = this.getExtensions();
        let editorStateCfg = {
          doc: this.value,
          extensions: extensions,
        };
        this.state = cm.state.EditorState.create(editorStateCfg);
        this.widget = new cm.view.EditorView({
          state: this.state,
          parent: this.getRef('element'),
          dispatch: this.onChange
        });
        bbn.fn.log(this.mode);
        this.ready = true;
      },
      saveState() {
        bbn.fn.log(this.state.toJSON());
      },
      onKeyDown(event) {
        this.lastKeyDown = event;
        this.$emit('keydown', event);
      }
    },
    watch: {
      theme() {
        if (this.widget) {
          this.widget.destroy();
        }
        this.init();
      }
    }
  };
})();