(() => {
  let parserComponent;
  return {
    props:['source'],
    data(){
      return {
        parser: this.source.treeData,
        errorParser: this.source.error,
        showTreeParser: false,
        parserClass: this.source.class,
        showAllParser: false,
      }
    },
    computed: {
      sourceParser(){
        let editor = this.closest('appui-ide-editor');
        if ( bbn.fn.isArray(this.parser) && this.parser.length ){
          if ( (editor.possibilityParser === "class") && !this.showAllParser ){
            let idx = bbn.fn.search(this.parser, 'name', 'methods');
            let sourceTree = bbn.fn.extend([], this.parser, true);
            bbn.fn.each(sourceTree[idx]['items'], (meth,i)=>{
              meth['items'] =  bbn.fn.filter(meth['items'], 'type', 'origin')
              meth['numChildren'] = meth['items'].length;
              meth['num'] =  meth['items'].length;
            });
            return sourceTree;
          }
          else if ( this.showAllParser || (editor.possibilityParser === "component") ){
            return this.parser;
          }
        }
        return false;
      },
      getCode(){
        return this.closest('appui-ide-editor').currentId === this.source.idElement;
      }
    },
    mounted(){
      parserComponent = this;
    },
    components:{
      'item':{
        props:['source'],
        template:
        `<div :style="{color: colorElement, display: 'inline'}"
              @click="getRow">
          <i :class="classIcon"></i>
          <span v-if="source.file" >File:</span>
          <span :class="['bbn-spadding',{'bbn-green': source.type === 'parent', 'bbn-red': source.type === 'trait'}]"
                :style="{cursor: (source.line !== undefined) && (source.line !== false) ? 'pointer' : 'default'}"
                v-text="source.name"
          ></span>
          <span v-if="(source.type !== undefined) && (source.type !== false) && (source.line !== false) && (source.file !== true)"
                :class="['bbn-i', {'bbn-green': source.type === 'parent', 'bbn-red': source.type === 'trait'}]"
                :style="{cursor: ((source.line !== undefined) && (source.line !== false) && (source.type === 'origin')) ? 'pointer' : 'default'}"
                v-text="' (line: ' + source.line + ')'"
          ></span>
        </div>`,
        computed:{
          colorElement(){
            return this.closest('appui-ide-editor').possibilityParser === 'component' ? '#44b782' : "black"
          },
          classIcon(){
            let editor = this.closest('appui-ide-editor');
            if ( editor.possibilityParser !== 'component' ){
              if ( (this.source.type === undefined) ){
                return 'nf nf-custom-folder_config';
              }
              else if ( (this.source.type !== undefined) && (this.source.type === false) ){
                return "nf nf-dev-code";
              }
              else if ( (this.source.type !== undefined) && (this.source.file === true) ){
                return "nf nf-md-subdirectory_arrow_right";
              }
              return 'nf nf-md-function';
            }
            else if ( editor.possibilityParser === 'component' ){
              if ( (this.source.eleComponent !== undefined) ){
                if ( (this.source.eleComponent === 'props') || (this.source.eleComponent === 'data') ){
                  return "nf nf-dev-code";
                }
                else if ( (this.source.eleComponent === 'watch') || (this.source.eleComponent === 'computed') ){
                  return "nf nf-fa-eye";
                }
                else if ( this.source.eleComponent === 'methods' ){
                  return 'nf nf-md-function';
                }
              }
              return "nf nf-md-vuejs";
            }
          }
        },
        methods:{
          getRow(){
            let editor = this.closest('appui-ide-editor');
            if ( ((this.source.line !== undefined) || (this.source.line !== false)) &&
              (editor.currentCode !== false )
            ){
              this.$nextTick(()=>{
                if ( (this.source.type === 'origin') && parserComponent.getCode ){
                  editor.currentCode.loadState({line: this.source.line-1, char: 0})
                }
              })
            }
          }
        }
      },
   }
  }
})()