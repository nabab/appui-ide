(() => {
  return {
    mixins: [
      bbn.cp.mixins.basic,
      bbn.cp.mixins.input,
      bbn.cp.mixins.events
    ],
    props: {
      mode: {
        type: String,
        default: 'php'
      },
      theme: {
        type: String,
        default: 'ayuLight'
      },
      extensions: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        state: null,
        widget: null
      }
    },

    methods: {
      updateDoc() {
        this.$emit('update', this.currentDoc);
      },
      getExtensions() {
        let cm = bbnCodeCp.cm;

        if (!this.mode || !this.theme) {
          throw Error("You earmust provide a language and a theme");
        }
        if (!cm.languageExtensions[this.mode]) {
          throw Error("Unknown language");
        }
        if (!cm.theme[this.theme]) {
          throw Error("Unknown theme");
        }
        let extensions = [];

        // push current language extension and current theme extension
        extensions.push(cm.languageExtensions[this.mode]);
        extensions.push(cm.theme[this.theme]);
        switch (this.currentMode) {
          case "javascript":
            extensions.push(cm.javascript.javascript());
            break;
          case "js":
            extensions.push(cm.javascript.javascript());
            break;
          case "html":
            extensions.push(cm.vue.vue());
            break;
          case "vue":
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
          case "less":
            extensions.push(cm.css.css());
            break;
          case "json":
            extensions.push(cm.json.json());
            break;
          case "xml":
            extensions.push(cm.xml.xml());
            break;
          case "markdown":
            extensions.push(cm.markdown.markdown());
            break;
        }
        return extensions;
      },
      onChange(tr) {
        this.widget.update([tr]);
        let value = this.widget.state.doc.toString();
        if (value !== this.value) {
          this.emitInput(value);
        }
      },
      init() {
        let cm = bbnCodeCp.cm;
        let extensions = this.extensions ? this.extensions : this.getExtensions();
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
      },
      onKeyDown(event) {
        this.lastKeyDown = event;
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
          let newValue = "";
          if ((this.mode === 'javascript' || this.mode === 'js') && window.beautifier.js) {
            const options = {
              indent_size: 2,
              space_in_empty_paren: true
            };
            newValue = window.beautifier.js(this.widget.state.doc.toString(), options);
          } else if ((this.mode === "css" || this.mode === "less") && window.beautifier.css) {
            const options = {
              indent_size: 2,
              space_in_empty_paren: true
            };
            newValue = window.beautifier.css(this.widget.state.doc.toString(), options);
          } else if (this.mode === "html" && window.beautifier.html) {
            const options = {
              indent_size: 2,
              space_in_empty_paren: true,
              wrap_attributes: 'force-aligned'
            };
            newValue = window.beautifier.html(this.widget.state.doc.toString(), options);
          } else if (this.mode === "php") {
            const options = {
              indent_size: 2,
              space_in_empty_paren: true
            };
            newValue = window.beautifier.html(this.widget.state.doc.toString(), options);
          }

          this.widget.dispatch({
            changes: {
              from: 0,
              to: this.widget.state.doc.toString().length,
              insert: newValue
            }
          })
        }
        if (event.key === ".") {
          bbnCodeCp.cm.autocomplete.startCompletion(this.widget)
        }
        this.$emit('keydown', event);
      },
    },
    mounted() {
      this.init();
    },
  }
})();