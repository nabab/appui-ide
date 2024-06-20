(() => {
  return {
    props: ['source'],
    methods: {
      addChildPermission(){
        let obj = {
                id: this.permissions.id,
                code: this.getRef('perm_child_code').getRef('element').value,
                text: this.getRef('perm_child_text').getRef('element').value
              };

        if ( obj.id && obj.code.length && obj.text.length ){
          this.post(appui.plugins['appui-ide'] + '/permissions/add', obj, (d) => {
            if ( d.data && d.data.success ){
              // Notify
              //$cont.append('<i class="nf nf-fa-thumbs_up" style="margin-left: 5px; color: green"></i>');
              // Insert the new item to list
              delete obj.id;
              //this.permissions.children.push(obj);
              this.source.children.push(obj);
              // Clear fields
              this.getRef('perm_child_code').getRef('element').value = '';
              this.getRef('perm_child_text').getRef('element').value = '';
            }
            else {
              // Notify
              //$cont.append('<i class="nf nf-fa-thumbs_down" style="margin-left: 5px; color: red"></i>');
            }
            // Remove notify
            /*setTimeout(function(){
              $("i.fa-thumbs_up, i.fa-thumbs_down", $cont).remove();
            }, 3000);*/
          });
        }
      },    
      saveChildPermission(e){
        //let inputs = $(e.target).closest('li').find('input'),
        const inputs = e.target.closest('li').querySelectorAll('input');
        const obj = {
          id: this.source.id,
          code: inputs[0].value,
          text: inputs[1].value
        };

        if ( obj.id && obj.code.length && obj.text.length ){
          this.post(appui.plugins['appui-ide'] + '/permissions/save', obj, (d) => {
            /*if ( d.data && d.data.success ){
              // Notify
              $cont.append('<i class="nf nf-fa-thumbs_up" style="margin-left: 5px; color: green"></i>');
            }
            else {
              // Notify
              $cont.append('<i class="nf nf-fa-thumbs_down" style="margin-left: 5px; color: red"></i>');
            }
            // Remove notify
            setTimeout(function(){
              $("i.fa-thumbs_up, i.fa-thumbs_down", $cont).remove();
            }, 3000);*/
          });
        }
      },
      removeChildPermission(e){
        //let a = e.target.closest('li').querySelectorAll('input')[0];       
        const obj = {
                id: this.source.id,
                code: e.target.closest('li').querySelectorAll('input')[0].value 
              };      
        if ( obj.id && obj.code.length ){
          appui.confirm('Are you sure to remove this item?', () => {
            this.post(appui.plugins['appui-ide'] + '/permissions/delete', obj, (d) => {
              if ( d.data && d.data.success ){
                this.source.children.splice(bbn.fn.search(this.source.children, 'code', obj.code), 1);
              }
            });
          });
        }
      }
    }
  }
})();
