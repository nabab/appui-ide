<div class="bbn-full-screen">
  <bbn-splitter orientation="vertical"
                class="bbn-ide-searchContent"
                :collapsible="true"
                :resizable="true">
    <bbn-pane :size="35"
              :scrollable="false"
              :resizable="true"
              class="bbn-padded"
    >
      <div class="k-header bbn-padded bbn-w-100 bbn-h-100 bbn-vmiddle bbn-flex-width">
        <div v-if="source.isProject">
          <span>
            <strong>
              <i class="nf nf-fa-cogs"></i>
              <?=_('Type')?>
            </strong>
            &nbsp;
          </span>
        </div>
        <div v-if="source.isProject" class="bbn-flex-fill">
          <span v-text="source.type"></span>
        </div>
        <div>
          <span>
            <strong>
              <i class="zmdi zmdi-search-in-file"></i>
              <?=_('Search')?>
              <span v-text="'('+ typeSearch +') :'"></span>
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
          <span v-if="!source.component">
            <strong>
              <i class="zmdi zmdi-folder"></i>
              <?=_('Folder:')?>
            </strong>
            &nbsp;
          </span>
          <span v-else>
            <strong>
              <i class="nf nf-fa-vuejs"></i>
              <?=_('Component:')?>
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
              <?=_('Files:')?>
            </strong>
            &nbsp;
          </span>
        </div>
        <div class="bbn-flex-fill">
          <span v-text="source.totFiles ? source.totFiles : '--'"></span>
          <span>/</span>
          <span v-text="source.allFiles ? source.allFiles : '--'"></span>
        </div>
        <div>
          <span>
            <strong>
              <?=_('Occourences:')?>
            </strong>
            &nbsp;
          </span>
        </div>
        <div class="bbn-flex-fill">
          <span v-text="source.totLines ? source.totLines : '--'"></span>
        </div>
      </div>
    </bbn-pane>
    <div v-if="source.totFiles" class="bbn-h-100 bbn-w-100 bbn-padded">
      <bbn-tree class="tree"
                :source="list"
                @select="selectElement"
                ref="searchContent"
      ></bbn-tree>
    </div>
    <div v-else class="bbn-h-100 bbn-w-100 bbn-padded">
      <span class="bbn-xxxl">
        <strong>
          <?=_('no search result')?>
        </strong>
      </span>
    </div>
  </bbn-splitter>
</div>
