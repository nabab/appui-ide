<div class="tree bbn-ide-selectdir bbn-padded">
  <div class="bbn-full-screen bbn-padded">
    <bbn-tree :source="root + 'tree'"
              :map="treeMapper"
              @select="treeNodeActivate"
              :data="treeInitialData"
    ></bbn-tree>
  </div>
</div>
