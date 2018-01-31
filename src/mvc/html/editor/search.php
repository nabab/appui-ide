<div class="bbn-full-screen bbn-ide-searchContent">
  <bbn-splitter orientation="vertical"
                :collapsible="true"
                :resizable="true">
    <bbn-pane :size="35"
              :scrollable="false"
              :resizable="true"
              class="bbn-padded"
    >
      <div class="k-header bbn-padded bbn-w-100 bbn-h-100 bbn-vmiddle bbn-flex-width">
          <div>
            <span>
              <strong>
                <i class="zmdi zmdi-search-in-file"></i>
                <?=_('Search:')?>
              </strong>
              &nbsp;
            </span>
          </div>
          <div class="bbn-flex-fill">
            <span v-text="source.search"></span>
          </div>
          <div>
            <span>
              <strong>
                <?=_('Repository:')?>
              </strong>
              &nbsp;
            </span>
          </div>
          <div class="bbn-flex-fill">
            <span v-text="source.nameRepository"></span>
          </div>
          <div v-if="source.searchFolder.length">
            <span>
              <strong>
                <i class="zmdi zmdi-folder"></i>
                <?=_('Folder:')?>
              </strong>
              &nbsp;
            </span>
          </div>
          <div v-if="source.searchFolder.length" class="bbn-flex-fill">
            <span v-text="source.searchFolder"></span>
          </div>
          <div>
            <span>
              <strong>
                <?=_('Total Files:')?>
              </strong>
              &nbsp;
            </span>
          </div>
          <div class="bbn-flex-fill">
            <span v-text="source.totFiles ? source.totFiles : '--'"></span>
          </div>
          <div>
            <span>
              <strong>
                <?=_('Total line code:')?>
              </strong>
              &nbsp;
            </span>
          </div>
          <div class="bbn-flex-fill">
            <span v-text="source.totLines ? source.totLines : '--'"></span>
          </div>
          <div>
            <span>
              <strong>
                <?=_('Case:')?>
              </strong>
              &nbsp;
            </span>
          </div>
          <div class="bbn-flex-fill">
            <span v-text="source.typeSearch"></span>
          </div>

      </div>
    </bbn-pane>
    <div v-if="source.totFiles" class="bbn-h-100 bbn-w-100 bbn-padded">
      <bbn-tree :source="source.list"
                @select="selectElement"
                ref="searchContent"
      ></bbn-tree>
    </div>
    <div v-else class="bbn-h-100 bbn-w-100 bbn-padded">
      <span class="bbn-xxxl">
        <strong>
          <?=_('no search result required')?>
        </strong>
      </span>
    </div>
  </bbn-splitter>
</div>
