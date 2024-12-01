<div class="bbn-overlay bbn-flex-height">
  <!--Search in current repository or all repositories-->
  <div class="bbn-header bbn-padding bbn-w-100 bbn-h-35 bbn-vmiddle bbn-flex-width">
    <div v-if="!source.all && source.isProject">
      <span>
        <strong>
          <i class="nf nf-fa-cogs"></i>
          <?= _('Type:') ?>
        </strong>
        &nbsp;
      </span>
    </div>
    <div v-if="!source.all && source.isProject"
          class="bbn-flex-fill"
    >
      <span class="bbn-green"
            v-text="source.type"
      ></span>
    </div>
    <div>
      <span>
        <strong>
          <i class="zmdi zmdi-search-in-file"></i>
          <?= _('Search') ?>
          <span v-text="'('+ typeSearch +') :'"></span>
        </strong>
        &nbsp;
      </span>
    </div>
    <div class="bbn-flex-fill">
      <span v-text="source.search"></span>
    </div>
    <div v-if="!source.all && source.searchFolder.length">
      <span v-if="!source.component">
        <strong>
          <i class="zmdi zmdi-folder"></i>
          <?= _('Folder:') ?>
        </strong>
        &nbsp;
      </span>
      <span v-else>
        <strong>
          <i class="nf nf-fa-vuejs"></i>
          <?= _('Component:') ?>
        </strong>
        &nbsp;
      </span>
    </div>
    <div v-if="!source.all && source.searchFolder.length"
          class="bbn-flex-fill"
    >
      <span v-text="source.searchFolder"></span>
    </div>
    <div v-if="source.all">
      <span>
        <strong>
          <?= _('Repositories:') ?>
        </strong>
        &nbsp;
      </span>
    </div>
    <div  v-if="source.all"
          class="bbn-flex-fill"
    >
      <span v-text="source.repositoriesFound ? source.repositoriesFound : '--'"></span>
      <span>/</span>
      <span v-text="source.totalRepositories ? source.totalRepositories : '--'"></span>
    </div>
    <div>
      <span>
        <strong>
          <?= _('Files:') ?>
        </strong>
        &nbsp;
      </span>
    </div>
    <div class="bbn-flex-fill">
      <span v-text="source.filesFound ? source.filesFound : '--'"></span>
      <span>/</span>
      <span v-text="source.totFiles ? source.totFiles : '--'"></span>
    </div>
    <div>
      <span>
        <strong>
          <?= _('Occourences:') ?>
        </strong>
        &nbsp;
      </span>
    </div>
    <div class="bbn-flex-fill">
      <span v-text="source.occurences ? source.occurences : '--'"></span>
    </div>
  </div>
  <div class="bbn-flex-fill">
    <div v-if="source.occurences > 0"
          class="bbn-h-100 bbn-w-100 bbn-padding"
    >
      <bbn-tree class="tree"
                :source="list"
                @select="selectElement"
                ref="searchContent"
      ></bbn-tree>
    </div>
    <div v-else
          class="bbn-h-100 bbn-w-100 bbn-padding"
    >
      <span class="bbn-xxxl">
        <strong>
          <?= _('no search result') ?>
        </strong>
      </span>
    </div>
  </div>
</div>
