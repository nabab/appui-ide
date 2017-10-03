<div class="tree bbn-ide-selectdir bbn-padded">
  <bbn-tree class="bbn-full-screen tree"
            :source="root + 'tree'"
            :map="treeMapper"
            @select="treeNodeActivate"
            :data="treeInitialData"
  ></bbn-tree>
</div>