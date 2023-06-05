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
    scss: 'css',
    test: 'test',
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
        default: 'ayuLight'
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
        lastKeyDown: null,
        // for autocompletion to get last valid object create with current js file
        lastValidVueObject: this.getVueObject(),
      };
    },
    /**
                                                                        * @event mounted
                                                                        */
    mounted() {
      if (!bbn.doc) {
        bbn.doc = {};

      }
      if (this.currentMode === 'js' && !bbn.doc['bbn-js']) {
        // create json object in bbn.doc with bbn-js documentation
        bbn.fn.ajax("https://raw.githubusercontent.com/nabab/bbn-js/master/doc/tern.json", "json", null, (d) => {
          bbn.doc['bbn-js'] = d;
        });
      }
      // load script for language server utility
      if (!window.lsp) {
        let lsp = document.createElement('script');
        lsp.src = 'lsp.js';
        document.getElementsByTagName('head')[0].appendChild(lsp);
      }
      // load script for eslint for javascript linter
      if (!window.eslint4b) {
        let eslintScript = document.createElement('script');
        eslintScript.src = 'eslint4b.js';
        document.getElementsByTagName('head')[0].appendChild(eslintScript);

      }
      // load script with codemirror6 and all extensions
      if (!window.codemirror6) {
        let cmScript = document.createElement('script');
        cmScript.src = '/cm.js';
        cmScript.onload = () => {
          // Both ESLint and CodeMirror scripts have been loaded
          this.init();
        };
        document.getElementsByTagName('head')[0].appendChild(cmScript);
      }
      this.init();

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
        
        if (!cm.ext) {
          // get basics extensions for editor like keymap, autocompletion...
          window.codemirror6.ext = cm.getBasicExtensions(cm);
          cm.ext = window.codemirror6.ext;
        }
        if (!this.currentMode || !this.currentTheme) {
          throw new Error("You must provide a language and a theme");
        }
        if (!cm.languageExtensions[modeCode[this.currentMode]]) {
          throw new Error("Unknown language");
        }
        if (!cm.theme[this.currentTheme]) {
          throw new Error("Unknown theme");
        }
        let extensions = [];
        // push each basic extension
        for (let n in cm.ext) {
          extensions.push(cm.ext[n]);
        }
        // push current language extension and current theme extension
        extensions.push(cm.languageExtensions[modeCode[this.currentMode]]);
        extensions.push(cm.theme[this.currentTheme]);
        switch (this.currentMode) {
          case "javascript":
            extensions.push(cm.javascript.javascript());
            if (window.eslint4b) {
              // create linter with eslint configuration
              extensions.push(cm.lint.linter(cm.javascript.esLint(new window.eslint4b(), {
                parseOptions: {
                  ecmaVersion: 2019,
                  sourceType: 'script'
                },
                env: {
                  browser: true
                },
                rules: {
                  semi: ['error', 'never'],
                },
                globals: {
                  bbn: 'readonly'
                }
              })));
            }


            break;
          case "js":
            extensions.push(cm.javascript.javascript());
            if (window.eslint4b) {
              extensions.push(cm.lint.linter(cm.javascript.esLint(new window.eslint4b(), {
                parseOptions: {
                  ecmaVersion: 2019,
                  sourceType: 'script'
                },
                env: {
                  browser: true
                },
                rules: {
                  semi: ['error', 'never'],
                },
                globals: {
                  bbn: 'readonly'
                }
              })));
            }

            break;
          case "html":
            extensions.push(cm.vue.vue());
            break;
          case "php":
            if (window.lsp) {
              let file = this.closest("appui-newide-coder").source.path; // app-ui/vendor/bbn/appui-newide/src/components/codemirror/codemirror.less
              // create language server extensions with configuration
              let lsPhp = window.lsp.languageServer({
                serverUri: "wss:///" + window.location.hostname + ":443/lsp/php",
                rootUri: "file:///home/dev-qr/",
                documentUri: "file:///" + file,
                languageId: 'php' 
              });
              extensions.push(lsPhp);
            }
            // extend php with html
            extensions.push(cm.php.php({
              baseLanguage: cm.languageExtensions.html
            }));
            break;
          case "css":


            extensions.push(cm.css.css());

            break;
          case "less":
            // create language server extensions for less
            if (window.lsp) {
              let file = this.closest("appui-newide-coder").source.path; // app-ui/vendor/bbn/appui-newide/src/components/codemirror/codemirror.less
              bbn.fn.log("FILE", "file:///" + file);
              let lsCss = window.lsp.languageServer({
                serverUri: "wss:///" + window.location.hostname + ":443/lsp/less",
                rootUri: "file:///home/dev-qr/",
                documentUri: "file:///" + file,
                languageId: 'less' 
              });
              extensions.push(lsCss);
            }

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
        // we can't override autocompletion because is already override with lsp
        if (this.currentMode !== "less" && this.currentMode !== "php") {
          extensions.push(cm.autocomplete.autocompletion({closeOnBlur: false, override: [this.completionSource]}));
        }
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
        // current word where the cursor is
        let word = context.matchBefore(/(this\.\w*)|\w+/);
        // current node where the cursor is
        let node = codemirror6.language.syntaxTree(context.state).resolveInner(context.pos, -1)
        // function used for autocompletion for a specific language
        let fn          = this.getWidgetCompletion();
        // launch the autocompletion function with current context
        let res         = fn(context);

        // create options array if not exist to add more autocompletion
        if (!res || !res.options) {
          res = {options: [

          ]};
        }


        // here I need the node so I can't use the precedent autocompletion function to get completion for this, bbn and more
        if (this.currentMode === 'js') {
          let js = this.getJavascriptCompletion(context, node);
          res.validFor = /^(?:[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*|this\..*?)$/;
          // we add it in the options array
          res.options.unshift(...js);
        }
        return res;
      },

      // create configuration with bbn component loaded in the dom
      createVueConfiguration() {
        const config = {
          extraTags: {},
          extraGlobalAttributes: {},
        }
        let components = Object.keys(Vue.options.components).sort();
        bbn.fn.iterate(Vue.options.components, (cp, cpName) => {
          config.extraTags[cpName] = {};
          if (cp.options && cp.options.props) {
            config.extraTags[cpName].attrs = {}

            bbn.fn.iterate(cp.options.props, (prop, propName) => {
              config.extraTags[cpName].attrs[bbn.fn.camelToCss(propName)] = null;
              config.extraTags[cpName].attrs[":" + bbn.fn.camelToCss(propName)] = null;
            })
          }
        });

        return config;
      },
      // get first node of the current node-chain
      getFirstNode(node, context) {
        bbn.fn.log(node);
        while (node.prevSibling) {
          node = node.prevSibling;
        }
        return context.state.sliceDoc(node.from, node.to);
      },
      // get nested prop in an object or array
      getNestedProp(obj, propString) {
        let propPath = propString.replace('this.', '').split('.');
        let currentProp = obj;

        for (let i = 0; i < propPath.length; i++) {
          let accessor = propPath[i];

          // Check if we're accessing an array
          if (accessor.includes('[') && accessor.includes(']')) {
            let [key, index] = accessor.split(/\[|\]/).filter(x => x); // Filter is used to remove empty strings from the array

            if (currentProp[key] && typeof currentProp[key] === 'object' && Array.isArray(currentProp[key])) {
              currentProp = currentProp[key][parseInt(index)];
            } else {
              return undefined;
            }
          } else {
            if (currentProp[accessor]) {
              currentProp = currentProp[accessor];
            } else {
              return undefined;
            }
          }
        }

        return currentProp;
      },
      // get the vue Object from current file
      getVueObject() {
        try {
          let vueObject = eval(this.value);
          this.lastValidVueObject = vueObject;
          return vueObject;
        } catch (error) {
          return this.lastValidVueObject;
        }
      },
      getJavascriptCompletion(context, node) {
        let res = [];
        let first = this.getFirstNode(node, context);

        // if the node-chain start with "this" we autocomplete this. or this. + nested key
        if (first && first.startsWith('this')) {
          let vueObject = new Vue(this.getVueObject());
          // autocomplete for this.
          if (first === "this") {
            for (let key in vueObject) {
              bbn.fn.log(key);
              let type = "variable";
              try {
                if (typeof vueObject[key] === 'function') {
                  type = "function";
                }
              } catch (error) {
              }
              res.push({label: key, type: type})
            }
          // autocomplete for this[{{nested_key}}]  
          } else {
            try {
              let prop = this.getNestedProp(vueObject, first)
              bbn.fn.log("PROP", prop);
              if (bbn.fn.isObject(prop)) {
                for (let key in prop) {
                  let type = "variable";
                  try {
                    if (typeof prop[key] === 'function') {
                      type = "function";
                    }
                  } catch (error) {
                  }
                  res.push({label: key, type: type});
                }
              }
            } catch (error) {
            }
          }
        // same as this but for bbn
        } else if (first && first.startsWith('bbn')) {
          try {
            let bbnObject = eval(first);
            bbn.fn.log("FIRST", first);
            if (bbn.fn.isObject(bbnObject)) {
              for (let key in bbnObject) {
                let final = {};
                final.label = key;
                let documentation = "";
                let doc = this.getNestedProp(bbn.doc['bbn-js'], first + '.' + key);
                let type = "variable";
                if (bbn.fn.isFunction(bbnObject[key])) {
                  type = "function";
                }
                // if in bbn.doc[bbn-js] we have the documentation of the key we add it in the object to get it in the function to create the window
                if (doc) {
                  final.doc = doc;
                  final.info = (completionNode) => {
                    return new Promise((resolve, reject) => {
                      let div = document.createElement('div');
                      div.className = "bbn-xspadding bbn-no-margin"
                      if (completionNode.doc['!type']) {
                        let htype = document.createElement('h5');
                        htype.innerText = completionNode.doc['!type'];
                        div.appendChild(htype);
                        div.appendChild(document.createElement('hr'))
                      }
                      if (completionNode.doc['!url']) {
                        let url = document.createElement('a');
                        url.href = completionNode.doc['!url'];
                        url.innerText = "bbn.io/js/" + completionNode.label
                        div.appendChild(url);
                        div.appendChild(document.createElement('br'));
                      }

                      if (completionNode.doc['!doc']) {
                        let htmldoc = document.createElement('span');
                        htmldoc.innerText = completionNode.doc['!doc'];
                        div.appendChild(htmldoc);
                      }
                      resolve(div);
                    })
                  }
                }
                final.type = type;
                bbn.fn.log("FINAL", final);
                res.push(final);
              }
            }
          } catch (error) {
            bbn.fn.log(error);
          }
        // default autocompletion, we can add autocompletion for function here
        } else {
          let defaultLabel = [
            {label: "this", type: "variable"},
            {label: "bbn", type: "variable"}
          ];

          res.unshift(...defaultLabel);
        }


        return res;
      },
      // basic js completion source
      jsCompletionSource(context) {
        let validFor = /^(?:[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*|this\..*?)$/;
        let inner = codemirror6.language.syntaxTree(context.state).resolve(context.pos, -1);
        if (inner.name == "TemplateString" || inner.name == "String" ||
            inner.name == "LineComment" || inner.name == "BlockComment")
          return null;
        let isWord = inner.to - inner.from < 20 && validFor.test(context.state.sliceDoc(inner.from, inner.to));
        console.log("CODEMIRROR6", !isWord && !context.explicit);
        if (!isWord && !context.explicit)
          if (inner.name !== '.')
            return null;
        let options = [];
        return {
          options,
          from: isWord ? inner.from : context.pos,
          validFor: validFor
        };
      },
      getWidgetCompletion() {

        const Myconfig = this.createVueConfiguration();

        // return each autocompletion function for each language, for html we use another autocompletion with basic completion
        let res = null;
        switch (this.currentMode) {
          case 'html':
            res = window.codemirror6.html.htmlCompletionSourceWith(Myconfig);
            break;
          case 'php':
            res = window.codemirror6.html.htmlCompletionSource;
            break;
          case 'js':
            res = this.jsCompletionSource;
            break;
          case 'css':
            res = window.codemirror6.css.cssCompletionSource;
            break;
          case 'less':
            res = window.codemirror6.css.cssCompletionSource;
            break;
        }
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
        // get all needed extensions
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
        if (event.key === ".") {
          codemirror6.autocomplete.startCompletion(this.widget)
        }
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