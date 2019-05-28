/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */
(() => {
  return {
    data(){
      return {
        new_name: this.source.nodeData.name,
        new_ext: ''
      }
    },
    methods: {
      close(){
        this.closest("bbn-popup").close();
      },
      /**
       *  TODO
       * @param id
       * @returns {boolean}
       */

      ctrlCloseTab(id){
        let ctrlChangeCode = appui.ide.getRef('tabstrip').getVue(id).getRef('component').changedCode,
            tabs           = appui.ide.getRef('tabstrip')['tabs'].slice(),
            url            = tabs[idx]['url'],
            current        = tab[idx]['current'];
        if ( ctrlChangeCode ){
          let dirTab = this.formData.path + this.formData.name;
          appui.confirm(
            bbn._('Do you want to save the changes before?'),
            () => {
              appui.ide.save(true);

              if ( this.isFile ){
                /*path.pop();
                path.push(this.new_name);
                tabStrip.tabs[idx]['title'] = path.join('/');*/

              } else{
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

                        let step = Url = tabs[i]['url'].split('/'),
                            stepCurrent = tabs[i]['current'].split('/'),
                            stepTitle   = tabs[i]['title'].split('/');

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
                        //appui.ide.getRef('tabstrip[')'tabs'][i]
                      }
                      else{
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
        else{
          appui.ide.getRef('tabstrip').close(this.getRef('tabstrip').selected, true);
        }
        return true
      },
      beforeSubmit(){
        const tabStrip = appui.ide.getRef('tabstrip');
        let path = this.source.nodeData.path.split('/');
        //if it is a file, you perform open tab check operations and in case we rename its tab title
        if ( tabStrip ){
          var idx = tabStrip.router.getIndex('file/' + appui.ide.currentRep + this.source.nodeData.dir + this.source.nodeData.name);
          //if the file we have to rename is open and is also active then we rename it
          if ( Number.isInteger(idx) && idx > -1 ){
            if ( this.ctrlCloseTab(idx) ){
            }
          }
        }
      },
      onSuccess(){

        let editor = this.closest("bbn-container").getComponent(),
            key = 'file/' + appui.ide.currentRep;

        if ( this.source.isMVC ){
          key += 'mvc/' + this.source.nodeData.path + '/_end_';
        }
        else if ( this.source.isCcomponent ){
          key += this.source.data.path + '/_end_';
        }

        let idx = editor.getRef('tabstrip').router.getIndex(key);



        if ( idx != false ){
          editor.getRef('tabstrip').close(idx);
        }

        if ( appui.ide.nodeParent ){         
          appui.ide.nodeParent.reload();
          this.$nextTick(()=>{
            appui.ide.$set(appui.ide, 'nodeParent', false);
          });
        }
        else{
          // this.$nextTick(() => {
          //   appui.ide.getRef('tabstrip').close(appui.ide.tabSelected);
          // });
          this.$nextTick(() => {
            let newUrl = appui.ide.getRef('tabstrip').tabs[appui.ide.tabSelected].current;
            appui.ide.getRef('tabstrip').currentURL = newUrl;
            bbn.fn.link('ide/editor/' + newUrl);
            appui.ide.getRef('tabstrip').load(newUrl);
          });

          if ( appui.ide.currentRep === this.source.currentRep ){
            appui.ide.getRef('filesList').reload();
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
          $.each(this.source.repositories[this.source.currentRep].extensions, (i, v) => {
            res.push({
              text: '.' + v.ext,
              value: v.ext
            });
          });
        }
        return res;
      },

      formData(){
        let obj = {
          repository: this.source.repository,
          //path: !this.source.parent ? this.source.nodeData.path : this.source.nodeData.dir,
          path: this.source.nodeData.dir,
          name: this.source.nodeData.name,
          ext: this.source.nodeData.ext,
          is_mvc: this.isMVC,
          is_file: this.isFile,
          is_component: this.source.isComponent,
          is_project: this.source.is_project,
          type: this.source.nodeData.type
        };
        if ( this.source.is_component ){
          obj.path = this.source.nodeData.path;
        }
        if ( this.source.repository['types'] !== undefined ){
          obj.component_vue =  this.source.component_vue;
          obj.only_component = this.source.only_component;
        }
        return obj;
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
  }
})();
