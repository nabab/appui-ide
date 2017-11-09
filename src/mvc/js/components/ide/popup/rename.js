/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */
  Vue.component('appui-ide-popup-rename', {
    template: '#bbn-tpl-component-appui-ide-popup-rename',
    props: ['source'],
    data(){
      return {
        new_name: this.source.nodeData.name,
        new_ext: ''
      }
    },
    methods: {
      close(){
        const popup = bbn.vue.closest(this, ".bbn-popup");
        popup.close();
      },
      /**
       *  TODO
       * @param id
       * @returns {boolean}
       */

      ctrlCloseTab(id){

        let ctrlChangeCode = appui.ide.$refs.tabstrip.getVue(id).$refs.component[0].changedCode,
            tabs = appui.ide.$refs.tabstrip['tabs'].slice(),
            url = tabs[idx]['url'],
            current = tab[idx]['current'];


        if ( ctrlChangeCode ){
          let dirTab = this.formData.path + this.formData.name;
          bbn.fn.confirm(
            bbn._('Do you want to save the changes before?'),
            () =>{
              appui.ide.save( true );

              if ( this.isFile ){
                /*path.pop();
                path.push(this.new_name);
                tabStrip.tabs[idx]['title'] = path.join('/');*/

              }else {
                for ( let i = 0; i < tabs.length; i++ ){

                  if ( tabs[i] ){
                    //If you rename a folder that is inserted in the context of the path of one or more open
                    //tabs then you proceed with the closure of the tab (s) and its reopening.
                    let idx = tabs[i]['title'].indexOf(dirTab);

                    if ( idx === 0 ){

                      let newParamsTab = {
                          url: '',
                          current: '',
                          title: ''
                        };

                      //  if the folder to be renamed is not the direct relative
                      if ( dirTab !== tabs[i]['title'].substring(0, tabs[i]['title'].lastIndexOf('/')) ){

                        let step= Url = tabs[i]['url'].split('/'),
                            stepCurrent = tabs[i]['current'].split('/'),
                            stepTitle = tabs[i]['title'].split('/');

                        //checking and reallocating the new value within the url of the tab
                        for ( let i in stepUrl ){
                          if ( stepUrl[i] === this.formData.name ){
                            stepUrl[i] = this.new_name;
                          }
                        }
                        newParamsTab.url = stepUrl.join('/');

                        //checking and reallocating the new value within the current of the tab
                        for ( let i in stepCurrent ){
                          if ( stepCurrent[i] === this.formData.name ){
                            stepCurrent[i] = this.new_name;
                          }
                        }
                        newParamsTab.current = stepCurrent.join('/');


                        //checking and reallocating the new value within the title of the tab
                        for ( let i in stepTitle ){
                          if ( stepTitle[i] === this.formData.name ){
                            stepTitle[i] = this.new_name;
                          }
                        }

                        newParamsTab.title = stepTitle.join('/');

                        appui.ide.$refs.tabstrip['tabs'][i]

                      }
                      else {
                  /*      let end      = tabs[i]['title'].lastIndexOf('/'),
                            nameFile = tabs[i]['title'].substring(end);
                        cfg.data.dir = this.formData.path + this.new_name;
                        cfg.data.name = nameFile;*/
                      }

                    }
                  }
                }
              }




            },
            () => {

              appui.ide.afterCtrlChangeCode();
            }
          );
        }
        else {
          appui.ide.$refs.tabstrip.close(this.$refs.tabstrip.selected, true);
        }
        return true
      },
      beforeSubmit(){
        const tabStrip = appui.ide.$refs.tabstrip;
        let path = this.source.nodeData.path.split('/');
        //if it is a file, you perform open tab check operations and in case we rename its tab title
         if ( tabStrip ){

           var idx = tabStrip.getIndex('file/' + appui.ide.currentRep + this.source.nodeData.dir + this.source.nodeData.name);
          //if the file we have to rename is open and is also active then we rename it
           if ( Number.isInteger(idx) && idx > -1 ){


            //fare il controllo prima di chiudere in caso di salvataggio e poi cambiare url
              if ( this.ctrlCloseTab(idx) ){

              }

          }
        }
      },
      onSuccess(){
      /*  const tabStrip = appui.ide.$refs.tabstrip;
        let path = this.source.nodeData.path.split('/');
        //if it is a file, you perform open tab check operations and in case we rename its tab title

        if ( tabStrip ){
          var idx = tabStrip.getIndex('file/' + appui.ide.currentRep + this.source.nodeData.dir + this.source.nodeData.name);
          //if the file we have to rename is open and is also active then we rename it
          if ( Number.isInteger(idx) && idx > -1 ){
            if ( this.isFile ){
              path.pop();
              path.push(this.new_name);
              tabStrip.tabs[idx]['title'] = path.join('/');

            }
            //folder
            else {
              console.log(this);
              //I compose the initial directory to compare with open tabs

              let dirTab = this.formData.path + this.formData.name;

              //copy of the open tabs to make sure that I can make changes without affecting the original.
              var tabs = appui.ide.$refs.tabstrip['tabs'].slice();

              //browse the' array for control and in case do the closing and reopening tab operation
              for ( let i = 0; i < tabs.length; i++ ){

                if ( tabs[i] ){
                  bbn.fn.warning("guardadaddad");
                  console.log("titlotab", tabs[i]['title'])
                  console.log("dirtab", dirTab)
                  console.log("indice", i);
                  console.log("tab", tabs[i]);
                  console.log("condizione", tabs[i]['title'].indexOf(dirTab) === 0)
                  console.log("trova paarte titolo", tabs[i]['title'].indexOf(dirTab))
                  console.log("this", this)

                  //If you rename a folder that is inserted in the context of the path of one or more open
                  //tabs then you proceed with the closure of the tab (s) and its reopening.
                  let idx = tabs[i]['title'].indexOf(dirTab);

                  if ( idx === 0 ){

                    let cfg = {
                      data: {
                        dir: '',
                        name: '',
                        tab: ''
                      }
                    };

                    if ( this.isMVC ){
                      let tabFile = tabs[i]['current'].lastIndexOf('/');
                      tabFile = tabFile + 1;
                      cfg.data.tab = tabs[i]['current'].substring(tabFile);
                    }
                    //  if the folder to be renamed is not the direct relative
                    if ( dirTab !== tabs[i]['title'].substring(0, tabs[i]['title'].lastIndexOf('/')) ){

                      let end = tabs[i]['title'].lastIndexOf('/'),
                          nameFile = tabs[i]['title'].substring(end),
                          addDir = tabs[i]['title'].substring(0, end);

                      var levels = addDir.split('/');

                      for (let i in levels){
                        if ( levels[i] ===  this.formData.name ){
                          levels[i] = this.new_name;
                        }
                      }

                      cfg.data.dir = levels.join('/');
                      cfg.data.name = nameFile;
                    }
                    else{
                      let end = tabs[i]['title'].lastIndexOf('/'),
                          nameFile = tabs[i]['title'].substring(end);
                      cfg.data.dir =  this.formData.path + this.new_name;
                      cfg.data.name = nameFile;
                    }
                    appui.ide.$refs.tabstrip.close(i);
                    setTimeout(()=>{
                      appui.ide.openFile(cfg);
                    }, 800);
                  }
                }

              }
            }
          }
        }*/
        appui.success(bbn._("Renamed!"));
      },
    },
    computed: {
      isFile(){
        return !this.source.nodeData.folder;
      },
      isMVC(){
        return (this.source.repositories[this.source.currentRep] !== undefined ) && (this.source.repositories[this.source.currentRep].tabs !== undefined);
      },
      extensions(){
        let res = [];
        if ( !this.isMVC ){
          $.each(this.source.repositories[this.source.currentRep].extensions, (i, v) =>{
            res.push({
              text: '.' + v.ext,
              value: v.ext
            });
          });
        }
        return res;
      },
      formData(){
       return{
         repository: this.source.repositories[this.source.currentRep],
         path: this.source.nodeData.dir,
         name: this.source.nodeData.name,
         ext: this.source.nodeData.ext,
         is_mvc: this.isMVC,
         is_file: this.isFile
       }
      }
    },
    mounted(){
      bbn.fn.warning("fdfdfd");
      bbn.fn.log("rename", this);
      if ( this.isFile ){
        this.new_ext = this.source.nodeData.ext;
      }
    }
  });



/*
 Vue.component('appui-ide-popup-rename', {
 template: '#bbn-tpl-component-appui-ide-popup-rename',
 props: ['source'],
 data(){
 return $.extend({
 newName: this.source.fData.name,
 newExt: ''
 }, this.source);
 },
 methods: {
 isMVC(){
 return (this.repositories[this.currentRep] !== undefined ) && (this.repositories[this.currentRep].tabs !== undefined);
 },
 extensions(){
 let res = [];
 if ( !this.isMVC() ){
 $.each(this.repositories[this.currentRep].extensions, (i, v) => {
 res.push({
 text: '.' + v.ext,
 value: v.ext
 });
 });
 }
 return res;
 },
 close(){
 const popup = bbn.vue.closest(this, ".bbn-popup");
 popup.close(popup.num - 1);
 },
 submit(){
 if ( (this.newName !== this.fData.name) || (this.isFile && (this.newExt !== this.fData.ext)) ){
 bbn.fn.post(this.root + 'actions/rename', {
 repository: this.repositories[this.currentRep],
 path: this.fData.dir,
 name: this.fData.name,
 new_name: this.newName,
 ext: this.fData.ext,
 new_ext: this.newExt,
 is_mvc: this.isMVC(),
 is_file: this.isFile
 }, d => {
 if ( d.success ){
 const tab = bbn.vue.closest(this, ".bbn-tab");
 console.log("Rename", tab, this);



 $.each(tab.$children, (i, v) => {
 if ( v.$refs.filesList &&
 v.$refs.filesList.widgetName &&
 (v.$refs.filesList.widgetName === 'fancytree')
 ){
 const node = v.$refs.filesList.widget.getNodeByKey(this.fData.key),
 path = this.fData.path.split('/');
 console.log("Rename", node, path);
 node.data.name = this.newName;
 if ( this.isFile ){
 node.data.ext = this.newExt;
 }
 path.pop();
 path.push(this.newName);
 node.data.path = path.join('/');
 node.setTitle(this.newName);
 node.render(true);*/
/*
 });
 this.close();
 appui.success(bbn._("Renamed!"));
 }
 else {
 appui.error(bbn._("Error!"));
 }
 });
 }
 }
 },
 computed: {
 isFile(){
 return !this.fData.is_folder;
 }
 },
 mounted(){
 if ( this.isFile ){
 this.newExt = this.fData.ext;
 }
 this.$nextTick(() => {
 setTimeout(() => {
 $(this.$el).bbn('analyzeContent', true);
 }, 100);
 });
 }
 });*/














