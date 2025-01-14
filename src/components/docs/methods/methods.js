// Javascript Document
(()=>{
  return {
    props: ['source'],
    data(){
      return {
        elements: 'all',
        className: '',
        showClass: false,
        sections: {
          members: false,
          methods: false
        }
      }
    },
    computed:{
      treeClass(){
        let arr = [];
        //if( (this.sections.members !== false) && (this.sections.methods !== false) ){
          bbn.fn.each(this.sections, (ele, i)=>{
            if ( ele !== false ){
              arr.push({
                text: i,
                icon: 'nf nf-fa-cogs',
                num: ele.length,
                items: ele,
                cls:  i === 'methods' ? "bbn-blue" : ''
              });
            }
          });
        //}
        return  arr;
      }
    },
    methods:{
      getInfo(){
        bbn.fn.post('docs', {class : this.className}, d =>{
          if ( d.success ){
            this.allInfo = d.infos
          }
        });
      },
      getMembers(){
        let arr = [];
        if ( (this.source.parser.members !== undefined) && this.source.parser.members.length ){
          bbn.fn.each(this.source.parser.members, (v, i) =>{
            if ( v['@attributes']['name'] !== undefined  ){
              arr.push({
                text: v['@attributes']['name'],
                icon: 'nf nf-fa-code',
                typeElement: 'member',
                data:{
                  line: v['@attributes']['line'],
                  fixed: v['@attributes']['static'],
                  visibility: v['@attributes']['visibility'],
                  description: (v.description !== undefined && v.description.compact !== undefined)  ? v.description.compact : '-',
                  type: (v.dockblock !== undefined && v.docblock.var['@attributes'].type !== undefined ) ? v.docblock.var['@attributes'].type  : '-'
                }
              });
            }
          });
        }
        return arr;
      },
      getMethods(){
        let arr = [],
            obj = {};
        if ( (this.source.parser.methods !== undefined) && this.source.parser.methods.length ){
          bbn.fn.each(this.source.parser.methods, (v, i) =>{
            if ( v['@attributes']['name'] !== undefined  ){
              obj = {
                text: v['@attributes']['name'],
                icon: 'nf nf-mdi-function',
                typeElement: 'method',
                cls: "bbn-blue",
                data:{
                  line: v['@attributes']['start'],
                  fixed: v['@attributes']['static'],
                  visibility: v['@attributes']['visibility'],
                  abstract: v['@attributes']['abstract'],
                  description: (v.description !== undefined && v.description.compact !== undefined)  ? v.description.compact : '-',
                  params: [],
                  return: '-'
                }
              };
              if ( (v.return !==  undefined) && (v.return['@attributes'] !== undefined) ){
                 obj.data.return = ( (v.return['@attributes'].nullable !== undefined ) && (v.return['@attributes'].nullable === true) ? 'null |' : '') + v.return['@attributes'].type;
              }
            }
            if ( (v.docblock !== undefined) && (v.docblock.param !== undefined) && v.docblock.param.length ){
              //for code test
              let code = false;
              if ( v.docblock.description !== undefined ){
                if ( v.docblock.description.length ){
                  if ( v.docblock.description.search("```php") !== -1 ){
                    code =  v.docblock.description.replace("```php", "<?php");
                    if ( v.docblock.description.search("```") !== -1 ){
                      code =  code.replace("```", "");
                    }
                    obj.data.codeTest = code;
                  }
                }
              }

              bbn.fn.each(v.docblock.param, (val, j) =>{
                obj.data.params.push({
                  text: val['@attributes'].variable,
                  icon: 'nf nf-fa-code',
                  data:{
                    type: val['@attributes'] !== undefined ?  val['@attributes'].type : '-',
                    description:  val['@attributes'] !== undefined ? val['@attributes'].description : '-',
                  }
                });
              });
            }
            arr.push(obj);
          });
        }
        return arr;
      }
    },
    mounted(){
      this.sections.members = this.getMembers();
      this.sections.methods = this.getMethods();
      this.showClass = true;
    },
    components: {
      'element':{
        template:`<div class="bbn-padding bbn-flex-height">
                    <div :class="['bbn-h-15', 'bbn-w-100', 'bbn-r', {
                        'bbn-header': source.typeElement === 'member',
                        'bbn-background-effect-tertiary': source.typeElement === 'method'
                      }]"
                      style="border:1 px"
                    >
                      <span style="margin-right: 2px" class="bbn-b" v-text="source.data.visibility"></span>
                    </div>
                    <div class="bbn-flex-fill" style="border: 1px solid #F0EFEF">
                      <div class="bbn-grid-fields bbn-w-100" style="margin-bottom:20px">
                        <span style="margin-left: 2px" class="bbn-b bbn-xxl">`+bbn._('Name:')+`</span>
                        <span class= "bbn-xxl" v-text="source.text" style="margin-left: 2px"></span>
                      </div>
                      <div class="bbn-padding">
                        <ul>
                          <li class="bbn-margin">
                            <div class="bbn-flex-width">
                              <span class="bbn-b bbn-w-10">`+bbn._('Description:')+`</span>
                              <div class="bbn-flex-fill" style="margin-left: 2px" v-text="source.data.description"></div>
                            </div>
                          </li>
                          <li v-if="source.typeElement === 'memmber'" class="bbn-margin">
                            <div class="bbn-flex-width">
                              <span class="bbn-b bbn-w-10">`+bbn._('Type:')+`</span>
                              <div  class="bbn-flex-fill" style="margin-left: 2px" v-text="source.data.type"></div>
                            </div>
                          </li>
                          <li v-if="(source.typeElement === 'method') && source.data.codeTest" class="bbn-margin">
                            <div class="bbn-flex-width">
                              <span class="bbn-b bbn-w-10">`+bbn._('Code Test:')+`</span>
                              <div class="bbn-flex-fill">
                                <bbn-code v-model="source.data.codeTest"
                                          mode="php"
                                          :readonly="true"
                                          theme="hopscotch"
                                ></bbn-code>
                              </div>
                            </div>
                          </li>
                          <li v-if="(source.typeElement === 'method') && source.data.params.length" class="bbn-margin">
                            <div class="bbn-flex-width">
                              <span class="bbn-b bbn-w-10">`+bbn._('Params:')+`</span>
                              <div class="bbn-flex-fill">
                                <bbn-table ref="table_params"
                                          :columns="columns"
                                          :scrollable="false"
                                          :source="source.data.params"
                                ></bbn-table>
                              </div>
                            </div>
                          </li>
                          <li v-if="source.typeElement === 'method'" class="bbn-margin" style="marguin-top: 120px">
                            <div class="bbn-flex-width">
                              <span class="bbn-b bbn-w-10">`+bbn._('Return:')+`</span>
                              <div class="bbn-red bbn-flex-fill" style="margin-left: 2px" v-text="source.data.return"></div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>`,
        props: ['source'],
        data(){
          return {
            columns:[{
              width: "120",
              label: bbn._('Type'),
              render: this.renderType
            },{
              field: "text",
              label: bbn._('Name'),
              width: "120",
            },{
              label: bbn._('Description'),
              render: this.renderDescription
            }]
          }
        },
        methods:{
          renderType(ele){
            return ele.data.type === undefined  ? '-' : ele.data.type
          },
          renderDescription(ele){
            return ele.data.description === undefined ?  '-' : ele.data.description
          }
        }
      },
    }
  }
})()