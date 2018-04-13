<div>
  <bbn-splitter orientation="horizontal">
    <!--info left-->
    <bbn-pane>
      <bbn-splitter orientation="vertical">
        <!--table repositories-->
        <bbn-pane>
          <bbn-table ref="repositories_table"
                     :source="source.repositories"
                     class="bbn-w-100"
                     :sortable="true"
                     
          >
            <bbn-column title="<?=_("Title")?>"
                        field="text"
                        :sortable="false"
                        cls="bbn-c"
            ></bbn-column>
            <bbn-column title="<?=_("Content")?>"
                        :width="100"
                        field="num_children"
                        :sortable="false"
                        cls="bbn-c"
            ></bbn-column>
            <bbn-column title="<?=_("Info")?>"
                        cls="bbn-c"
                        :width="60"
                        :buttons="btns_repository"
            ></bbn-column>
          </bbn-table>
        </bbn-pane>
        <!--table type repositories-->
        <bbn-pane>
          <bbn-table
                      :source="source.type"
          >
            <bbn-column title="<?=_("Type")?>"
                        field="text"
                        cls="bbn-c"
            ></bbn-column>
            <bbn-column title="<?=_("Info")?>"
                        cls="bbn-c"
                        :width="60"
                        :buttons="btns_repository"
            ></bbn-column>
          </bbn-table>
        </bbn-pane>
      </bbn-splitter>
    </bbn-pane>
    <!--Info right  -->
    <bbn-pane>
      <div class="bbn-flex-height" v-if="info === true">
        <div class="bbn-w-100 k-header bbn-vmidle" style="height: 50px">
          <div class="bbn-padded bbn-vmidle">
            <div class="bbn-l bbn-w-50" style="display:inline-block">
              <span class="bbn-b bbn-xl bbn-l" v-text="elementInfo.element.text" style="backgroundColor:white"></span>
            </div>
            <div class="bbn-r bbn-w-50" style="display:inline-block">
              <bbn-button icon="fa fa-trash-o"
                          @click="deleteElement"
                          :title="_('Delete')">
              </bbn-button>
              <bbn-button icon="fa fa-cogs"
                          @click="modifyElement"
                          :title="_('Modify')">
              </bbn-button>
            </div>
          </div>
        </div>
        <!--div class="bbn-flex-fill" v-if="elementInfo.tree.length">
          <div class="bbn-hpadded bbn-full-screen">
            <bbn-tree :source="elementInfo.tree"
                      ref="listRepositories"
                      :opened="true"
            ></bbn-tree>
          </div>
        </div-->
        <div class="bbn-flex-fill">
          <div class="bbn-full-screen bbn-padded" v-if="elementInfo.json.length">
            <bbn-json-editor v-model="elementInfo.json"></bbn-json-editor>
          </div>
        </div>
      </div>

    </bbn-pane>
  </bbn-splitter>
</div>
