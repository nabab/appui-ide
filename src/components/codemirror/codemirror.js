// Javascript Document
(() => {

  return {
    /**
     * @mixin bbn.cp.mixins.basic
     * @mixin bbn.cp.mixins.input
     * @mixin bbn.cp.mixins.events
     */
    mixins: [
      bbn.cp.mixins.basic,
      bbn.cp.mixins.input,
      bbn.cp.mixins.events
    ],
    statics() {
      return {
        modeCode: {
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
          bbn: 'bbn'
        }
      }
    },
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
          return !!appuiIdeCodemirrorCp.modeCode[v];
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
      },
      doc: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        myCode: this.doc,
        currentMode: this.mode,
        currentTheme: this.theme,
        lastKeyDown: null,
        // for autocompletion to get last valid object create with current js file
        lastValidVueObject: this.getVueObject(),
        editor: null
      };
    },
    methods: {

      init() {
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
      },
      foldAll() {
        this.editor.foldAll();
        //bbnCodeCp.cm.language.foldInside(bbnCodeCp.cm.language.syntaxTree(this.widget));
      },
      unfoldAll() {
        this.editor.unfoldAll();

      },
      openSearchPanel() {
        this.editor.openSearchPanel();
      },
      closeSearchPanel() {
        this.editor.closeSearchPanel();
      },
      findNext() {
        this.editor.findNext();
      },
      findPrevious() {
        this.editor.findPrevious();
      },
      replaceAll() {
        this.editor.replaceAll();
      },
      /**
       * Return an array with extensions give in cfg
       *
       * @method getExtensions
       * @param {Object} cfg Configue of extensions
       * @return {Array}
       */
      getExtensions() {
        let cm = window.bbnCodeCp?.cm;

        if (!cm) {
          return [];
        }

        if (!this.currentMode || !this.currentTheme) {
          throw Error("You must provide a language and a theme");
        }
        if (!cm.languageExtensions[appuiIdeCodemirrorCp.modeCode[this.currentMode]]) {
          throw Error("Unknown language");
        }
        if (!cm.theme[this.currentTheme]) {
          throw Error("Unknown theme");
        }
        let extensions = [];
        // push each basic extension
        for (let n in cm.extensions) {
          extensions.push(cm.extensions[n]);
        }
        // push current language extension and current theme extension
        extensions.push(cm.languageExtensions[appuiIdeCodemirrorCp.modeCode[this.currentMode]]);
        extensions.push(cm.theme[this.currentTheme]);
        switch (this.currentMode) {
          case "javascript":
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
            extensions.push(cm.bbn.bbn());
            extensions.push(cm.elmet);
            break;
          case "php":
            if (window.lsp) {
              let file = this.closest("appui-ide-coder").source.path; // app-ui/vendor/bbn/appui-ide/src/components/codemirror/codemirror.less
              // create language server extensions with configuration
              let lsPhp = window.lsp.languageServer({
                serverUri: "wss:///" + window.location.hostname + ":443/lsp/php",
                rootUri: "file:///home/dev-qr/",
                documentUri: "file:///" + file,
                languageId: 'php'
              });
              //extensions.push(lsPhp);
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
              let file = this.closest("appui-ide-coder").source.path; // app-ui/vendor/bbn/appui-ide/src/components/codemirror/codemirror.less
              //bbn.fn.log("FILE", "file:///" + file);
              let lsCss = window.lsp.languageServer({
                serverUri: "wss:///" + window.location.hostname + ":443/lsp/less",
                rootUri: "file:///home/dev-qr/",
                documentUri: "file:///" + file,
                languageId: 'less'
              });
              //extensions.push(lsCss);
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
          extensions.push(cm.autocomplete.autocompletion({
            closeOnBlur: false,
            override: [a => this.completionSource(a)]
          }));
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
        let node = bbnCodeCp.cm.language.syntaxTree(context.state).resolveInner(context.pos, -1)
        // function used for autocompletion for a specific language
        let fn = this.getWidgetCompletion();
        // launch the autocompletion function with current context
        let res = fn(context);
        bbn.fn.log("COMPLETION RESULT", res);

        // create options array if not exist to add more autocompletion
        if (!res || !res.options) {
          res = {
            options: [

            ]
          };
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
      createComponentConfiguration() {
        const allClasses = Array.from(document.querySelectorAll('[class]')).flatMap(e => e.className.toString().split(/\s+/))
        const classes = new Set()

        allClasses.forEach(c => classes.add(c))
        const config = {
          extraTags: {},
          extraGlobalAttributes: {
            class: classes
          },
        }
        let components = bbn.cp.known.slice().sort();
        bbn.fn.iterate(components, cpName => {
          const cp = eval(bbn.fn.camelize(cpName + '-cp'));
          config.extraTags[cpName] = {};
          if (cp.bbnCfg && cp.bbnCfg.props) {
            config.extraTags[cpName].attrs = {}

            bbn.fn.iterate(cp.bbnCfg.props, (prop, propName) => {
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
        //bbn.fn.log("node", node);
        let res = [];
        let first = this.getFirstNode(node, context);
        //bbn.fn.log("FIRST", first);
        // if the node-chain start with "this" we autocomplete this. or this. + nested key
        if (first && first.startsWith('this')) {
          let vueObject = new Vue(this.getVueObject());
          // autocomplete for this.
          if (first === "this") {
            for (let key in vueObject) {
              //bbn.fn.log(key);
              let type = "variable";
              try {
                if (typeof vueObject[key] === 'function') {
                  type = "function";
                }
              } catch (error) {}
              res.push({
                label: key,
                type: type
              })
            }
            // autocomplete for this[{{nested_key}}]  
          } else {
            try {
              let prop = this.getNestedProp(vueObject, first)
              if (bbn.fn.isObject(prop)) {
                for (let key in prop) {
                  let type = "variable";
                  try {
                    if (typeof prop[key] === 'function') {
                      type = "function";
                    }
                  } catch (error) {}
                  res.push({
                    label: key,
                    type: type
                  });
                }
              }
            } catch (error) {}
          }
          // same as this but for bbn
        } else if (first && first.startsWith('bbn')) {
          try {
            let bbnObject = eval(first);
            //bbn.fn.log("FIRST", first);
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
                res.push(final);
              }
            }
          } catch (error) {}
          // default autocompletion, we can add autocompletion for function here
        } else {
          if (first !== "") {
            try {
              const result = eval(first);
              if (result instanceof Object) {
                for (let key in result) {
                  let type = "variable";
                  try {
                    if (typeof result[key] === 'function') {
                      type = "function";
                    }
                  } catch (error) {}
                  res.push({
                    label: key,
                    type: type
                  });
                }
              }
            } catch (error) {}
            res.unshift(...res);

          } else {
            let defaultLabel = [{
                label: "this",
                type: "variable"
              },
              {
                label: "bbn",
                type: "variable"
              }
            ];

            res.unshift(...defaultLabel);

          }

        }


        const customSort = (a, b) => {
          const labelA = a.label.toLowerCase();
          const labelB = b.label.toLowerCase();

          if (labelA.startsWith('$') && !labelB.startsWith('$')) {
            return 1;
          }

          if (labelA.startsWith('_') && !labelB.startsWith('_')) {
            return 1;
          }

          if (!labelA.startsWith('$') && labelB.startsWith('$')) {
            return -1;
          }

          if (!labelA.startsWith('_') && labelB.startsWith('_')) {
            return -1;
          }

          return labelA.localeCompare(labelB);
        }

        //bbn.fn.log("RES", res.sort(customSort));

        return res;
      },
      // basic js completion source
      jsCompletionSource(context) {
        let validFor = /^(?:[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*|this\..*?)$/;
        let inner = bbnCodeCp.cm.language.syntaxTree(context.state).resolve(context.pos, -1);
        if (inner.name == "TemplateString" || inner.name == "String" ||
          inner.name == "LineComment" || inner.name == "BlockComment")
          return null;
        let isWord = inner.to - inner.from < 20 && validFor.test(context.state.sliceDoc(inner.from, inner.to));
        //bbn.fn.log("bbnCodeCp.cm", !isWord && !context.explicit);
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
        const Myconfig = this.createComponentConfiguration();
        // return each autocompletion function for each language, for html we use another autocompletion with basic completion
        let res = null;
        switch (this.currentMode) {
          case 'html':
            res = bbnCodeCp.cm.html.htmlCompletionSourceWith(Myconfig);
            break;
          case 'php':
            res = bbnCodeCp.cm.html.htmlCompletionSource;
            break;
          case 'js':
            res = this.jsCompletionSource;
            break;
          case 'css':
            res = bbnCodeCp.cm.css.cssCompletionSource;
            break;
          case 'less':
            res = bbnCodeCp.cm.css.cssCompletionSource;
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
      onKeyDown(event) {
        bbn.fn.log(["KEY DOWN ON CODEMIRROR", event]);
        this.lastKeyDown = this.editor.lastKeyDown;
      }
    },
    mounted() {
      this.editor = this.getRef("code");
    }
  };
})();
