<!-- HTML Document -->
<div class="allRepositoriesTree bbn-flex-height">
  <bbn-splitter class="bbn-flex-width" :orientation="orientationSplitter">
    <div class="bbn-flex-fill">
      <div class="top k-header bbn-w-100 bbn-vmiddle flexJustifyLeft heightTop">
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
                @dragEnd="moveNode"
                ref="allContentTree"
                :map="mapperTree"
                class="bbn-fullscreen bbn-flex-fill"
      ></bbn-tree>
    </div>
    <div>
      <div class="top k-header bbn-w-100 heightTop">
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
    </div>
  </bbn-splitter>


</div>


