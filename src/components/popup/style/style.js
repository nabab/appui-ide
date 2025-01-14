(()=>{
  return{
    props:['source'],
    data(){
      return {
        themes: [],
        themePreview: this.source.themeCode,
        content: '<?php\n/*\n * Describe what it does!\n *\n **/\n\n$content = [\n  "field_one" => "a",\n  "field_two" => 1\n];\nvar_dump($content);',
        btns: [
          'cancel', {
            label: 'Change',
            title: 'Change',
            class:'bbn-primary',
            icon: 'nf nf-fa-edit',
            action: this.changeTheme
        }]
      }
    },
    methods:{
      changeTheme() {
        throw new Error("changeTheme not implemented (to update!)");
        this.post(this.source.root + 'actions/change_theme',{
          theme: this.themePreview
        }, d => {
          if ( d.success ){
            let editor = this.closest('bbn-container').find('appui-ide-editor'),
            codes = editor.findAll('appui-ide-code');
            editor.$set(editor, 'themeCode', this.themePreview)
            if ( codes.length ){
              bbn.fn.each(codes, v => {
                v.$set(v, 'theme', this.themePreview)
              })
            }
            appui.success(bbn._('successfully edited'));
            this.$nextTick(()=>{
              this.closest('bbn-popup').close();
            });
          }
        });
      }
    },
    created(){
      if ( this.source.themes.length ){
        bbn.fn.each(this.source.themes, v =>{
          this.themes.push({
            text: v,
            value: v
          })
        });
      }
    }
  }
})();