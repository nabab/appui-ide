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
              if ( this.ctrlCloseTab(idx) ){ }
          }
        }
      },
      onSuccess(){
      //  alert("dddd")
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
       if ( this.source.parent ){
         this.source.parent.reload();
       }
       else{
          /*
          *  TODO  update of the open tab after the rename
          *
          *
          */
         /*
         let tab = appui.ide.$refs.tabstrip.tabs[appui.ide.tabSelected];
         if ( this.isMVC ){
           tab.source.title = this.formData.path +  this.new_name;
           tab.source.path = this.formData.path +  this.new_name;
           tab.source.url = this.source.currentRep +  this.formData.path + this.formData.name + '/__end__';
           tab.title =  this.formData.path + this.new_name;
           let id = appui.ide.$refs.tabstrip.tabs[appui.ide.tabSelected].url.lastIndexOf(this.formData.name) + 1;
           tab.url =  tab.url.substring(0, id) + '/__end__';
         }
         else{
           tab.source.filename = this.new_name;
           tab.source.path = this.formData.path;
         }
        */

         this.$nextTick(()=>{
           appui.ide.$refs.tabstrip.close(appui.ide.tabSelected);
         });


         this.$nextTick(()=>{
           let newUrl = appui.ide.$refs.tabstrip.tabs[appui.ide.tabSelected].current;
           appui.ide.$refs.tabstrip.currentURL = newUrl;
           bbn.fn.link('ide/editor/' + newUrl);
           appui.ide.$refs.tabstrip.load(newUrl);
         });

         if ( appui.ide.currentRep === this.source.currentRep ){
           appui.ide.$refs.filesList.reload();
         }
       }

        appui.success(bbn._("Renamed!"));
      },
    },
    computed: {
      isFile(){
        return !this.source.nodeData.folder;
      },
      isMVC(){
        return this.source.isMVC
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
         path:  !this.source.parent ?  this.source.nodeData.path : this.source.nodeData.dir,
         name: this.source.nodeData.name,
         ext: this.source.nodeData.ext,
         is_mvc: this.isMVC,
         is_file: this.isFile
       }
      }
    },
    mounted(){
      if ( this.isFile && !this.isMVC ){
        this.new_ext = this.source.nodeData.ext;
      }
      else if ( this.isMVC ){
        this.new_ext = "";
      }
    }
  });
