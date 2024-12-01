<div class="tree bbn-ide-selectdir bbn-padding">
  <div class="bbn-overlay bbn-padding">
    <bbn-tree :source="root + 'tree'"
              :map="treeMapper"
              @select="treeNodeActivate"
              :data="treeInitialData"
    ></bbn-tree>
  </div>
</div>
