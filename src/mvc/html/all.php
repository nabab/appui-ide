<!-- HTML Document -->
<div class="allRepositoriesTree">
  <bbn-splitter :orientation="orientationSplitter">
    <bbn-pane>
      <div class="top bbn-header bbn-w-100 bbn-vmiddle flexJustifyLeft heightTop">
        <div  class="paddingLeft" v-if="routeFile.filePath != ''">
        <span>
          <strong>
           <?=_('Repository : ')?>
          </strong>
        </span>
          <strong>
            <span class="paddingLeft" v-text='routeFile.root'></span>
          </strong>
          <br>
          <span>
          <strong>
           <?=_('File : ')?>
          </strong>
        </span>
          <strong>
            <span class="paddingLeft" v-text='routeFile.filePath'></span>
          </strong>
        </div>
      </div>
      <bbn-tree v-if="currentRepository !== ''"
                @select="selectNode"
                :source="source.root + 'tree_all'"
                :data="initialData"
                :draggable="true"
                @move="moveNode"
                ref="allContentTree"
                :map="mapperTree"
                class="bbn-fullscreen bbn-flex-fill"
      ></bbn-tree>
    </bbn-pane>
    <bbn-pane>
      <div class="top bbn-header bbn-w-100 heightTop">
        <div class="bbn-w-50 bbn-h-100 bbn-vmiddle flexJustifyLeft paddingLeft">
        <span class="paddingRight">
          <strong>
            <?=_('Theme : ')?>
          </strong>
        </span>
          <bbn-dropdown :source="themes"
                        v-model="theme"
                        style="width: 150px"
                        class="bbn-c"
          ></bbn-dropdown>
        </div>
        <div class="bbn-w-50 bbn-h-100 bbn-vmiddle flexJustifyRight paddingRight">
        <span class="paddingRight">
          <strong>
            <?=_('Repository : ')?>
          </strong>
        </span>
          <bbn-dropdown :source="repositories"
                        v-model="currentRepository"
                        style="width: 150px"
                        class="bbn-c"
          ></bbn-dropdown>
        </div>
      </div>
      <bbn-code ref="codeFile"
                :theme="theme"
                :mode="typeFile"
                v-model="content"
      ></bbn-code>
    </bbn-pane>
  </bbn-splitter>
</div>


