<div class="tree bbn-full-screen bbn-ide-selectdir">
  <bbn-tree class="tree"
            :source="treeLoad"
            :select="treeNodeActivate"
            :cfg="{lazyLoad: treeLazyLoad}"
  ></bbn-tree>
</div>