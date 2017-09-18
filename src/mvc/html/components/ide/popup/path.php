<div class="tree bbn-ide-selectdir bbn-100 bbn-padded">
  <bbn-tree ref="tree_form"
            class="tree"
            :source="root + 'tree'"
            :map="treeMapper"
            @select="treeNodeActivate"
            :data="treeInitialData"
  ></bbn-tree>
</div>