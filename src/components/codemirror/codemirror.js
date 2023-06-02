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
        lastValidVueObject: this.getVueObject(),
        jscompletion: []
      };
    },
    /**
                                                                        * @event mounted
                                                                        */
    mounted() {
      bbn.fn.log(this.currentMode);
      if (!bbn.doc) {
        bbn.doc = {};

      }
      if (this.currentMode === 'js' && !bbn.doc['bbn-js']) {
        bbn.fn.ajax("https://raw.githubusercontent.com/nabab/bbn-js/master/doc/tern.json", "json", null, (d) => {
          bbn.doc['bbn-js'] = d;
        });
      }
      bbn.fn.log("COMPONENTS/CODEMIRROR THEME/MODE", this.theme, this.mode);
      if (!window.lsp) {
        let lsp = document.createElement('script');
        lsp.src = 'lsp.js';
        document.getElementsByTagName('head')[0].appendChild(lsp);
      }
      if (!window.eslint4b) {
        let eslintScript = document.createElement('script');
        eslintScript.src = 'eslint4b.js';
        document.getElementsByTagName('head')[0].appendChild(eslintScript);

      }
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
        bbn.fn.log(cm.theme, this.currentTheme, cm.theme[this.currentTheme]);

        if (!cm.ext) {
          bbn.fn.log("JJRLJRLJELJRLZJKLAJLKEJZKLRJELAJLZEJR");
          window.codemirror6.ext = cm.getBasicExtensions(cm);
          cm.ext = window.codemirror6.ext;
        }
        bbn.fn.log("MODE", this.currentMode)
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
        for (let n in cm.ext) {
          extensions.push(cm.ext[n]);
        }
        extensions.push(cm.languageExtensions[modeCode[this.currentMode]]);
        extensions.push(cm.theme[this.currentTheme]);
        switch (this.currentMode) {
          case "javascript":
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
              bbn.fn.log("FILE", "file:///" + file);
              let lsPhp = window.lsp.languageServer({
                serverUri: "wss:///" + window.location.hostname + ":443/lsp/php",
                rootUri: "file:///home/dev-qr/",
                documentUri: "file:///" + file,
                languageId: 'php' 
              });
              extensions.push(lsPhp);
            }
            extensions.push(cm.php.php({
              baseLanguage: cm.languageExtensions.html
            }));
            break;
          case "css":


            extensions.push(cm.css.css());

            break;
          case "less":

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
        if (this.currentMode !== "less" && this.currentMode !== "php") {
          extensions.push(cm.autocomplete.autocompletion({closeOnBlur: false, override: [this.completionSource]}));
        }
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
        let word = context.matchBefore(/(this\.\w*)|\w+/);
        let node = codemirror6.language.syntaxTree(context.state).resolveInner(context.pos, -1)
        let fn          = this.getWidgetCompletion();
        let res         = fn(context);


        bbn.fn.log("AUTOCOMPLETE", node, res);
        if (!res || !res.options) {
          res = {options: [

          ]};
        }


        if (this.currentMode === 'js') {
          let js = this.getJavascriptCompletion(context, node);
          res.validFor = /^(?:[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*|this\..*?)$/;
          bbn.fn.log("AUTOCOMPLETE JS", js);
          res.options.unshift(...js);
        }

        bbn.fn.log(res);
        if (node.name === '.') {
          bbn.fn.log("ICI");
        }

        return res;
      },

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
      getFirstNode(node, context) {
        bbn.fn.log(node);
        while (node.prevSibling) {
          node = node.prevSibling;
        }
        return context.state.sliceDoc(node.from, node.to);
      },
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
      getVueObject() {
        try {
          let vueObject = eval(this.value);
          this.lastValidVueObject = vueObject;
          return vueObject;
        } catch (error) {
          return this.lastValidVueObject;
        }
      },
      beforeDotIs(node, word, context) {
        bbn.fn.log("MON REUF", node);
        let previous = node.prevSibling;
        if (previous) {
          previous =  context.state.sliceDoc(previous.from, previous.to) === word;
        }
        bbn.fn.log(previous);
        if ((node.name === '.' && node.prevSibling.name === word) || previous)
          return true;
        return false;
      },
      getJavascriptCompletion(context, node) {
        let res = [];
        let first = this.getFirstNode(node, context);
        bbn.fn.log("first", first);

        if (first && first.startsWith('this')) {
          bbn.fn.log("LOL", this.getVueObject());
          let vueObject = new Vue(this.getVueObject());
          if (first === "this") {
            bbn.fn.log("ICI No", vueObject);
            for (let key in vueObject) {
              bbn.fn.log(key);
              let type = "variable";
              try {
                if (typeof vueObject[key] === 'function') {
                  type = "function";
                }
              } catch (error) {
                bbn.fn.log("Just for debug, you can ignore this error", error);
              }
              res.push({label: key, type: type})
            }
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
                    bbn.fn.log("Just for debug, you can ignore this error", error);
                  }
                  res.push({label: key, type: type});
                }
              }
            } catch (error) {
              bbn.fn.log("Just for debug, you can ignore this error", error);
            }
          }
          bbn.fn.log(res);
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

        } else {
          let defaultLabel = [
            {label: "this", type: "variable"},
            {label: "bbn", type: "variable"}
          ];

          res.unshift(...defaultLabel);
        }


        return res;
      },
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