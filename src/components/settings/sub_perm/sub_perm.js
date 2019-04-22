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
          bbn.fn.post(appui.plugins['appui-ide'] + '/permissions/add', obj, (d) => {
            if ( d.data && d.data.success ){
              // Notify
              //$cont.append('<i class="nf nf-fa-thumbs_up" style="margin-left: 5px; color: green"></i>');
              // Insert the new item to list
              delete obj.id;
              this.permissions.children.push(obj);
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
        let inputs = $(e.target).closest('li').find('input'),
              obj = {
                id: this.source.id,
                code: $(inputs[0]).val(),
                text: $(inputs[1]).val()
              };

        if ( obj.id && obj.code.length && obj.text.length ){
          bbn.fn.post(appui.plugins['appui-ide'] + '/permissions/save', obj, (d) => {
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
        const obj = {
                id: this.permissions.id,
                code: $($(e.target).closest('li').find('input')[0]).val()
              };

        if ( obj.id && obj.code.length ){
          appui.confirm('Are you sure to remove this item?', () => {
            bbn.fn.post(appui.plugins['appui-ide'] + '/permissions/delete', obj, (d) => {
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
