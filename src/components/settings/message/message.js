(() => {
  return {
    props: ['source'],
    data(){
      return {
        imessage: {
          title: '',
          content: '',
          start: null,
          end: null,
          id_option: this.source.permissions ? this.source.permissions.id : null
        },
        today: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    },
    computed: {
      settingFormPermissions(){
        return this.permissions !== undefined
      },
      saveButtonText(){
        return this.imessage.id ? bbn._('Save') : bbn._('Add');
      }
    },
    methods: {
      saveImessage(){
        if ( this.imessage.title && this.imessage.content && this.imessage.id_option ){
          this.closest('bbn-container').popup().confirm(bbn._('Are you sure you want save this internal message?'), () => {
            bbn.fn.post(appui.plugins['appui-ide'] + '/actions/imessages/add', this.imessage, d => {
              if ( d.success ){
                //this.source.imessages.push($.extend({}, this.imessage));
                this.source.imessages.push(bbn.fn.extend(true, {}, this.imessage));
                this.newImessage();
                appui.success(bbn._('Saved'));
              }
            });
          });
        }
      },
      newImessage(){
        this.imessage.title = '';
        this.imessage.content = '';
        this.imessage.start = null;
        this.imessage.end = null;
      },
      editImessage(im){
        this.imessage.title = im.title;
        this.imessage.content = im.content;
        this.imessage.start = im.start;
        this.imessage.end = im.end;
      },
      changeStart(e){
       bbn.fn.log('aaaa', e);
      }
    }
  }
})();
