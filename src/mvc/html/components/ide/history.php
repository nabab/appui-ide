<div class="bbn-100 bbn-ide-history">
  <bbn-splitter orientation="horizontal">
    <div class="bbn-h-100"
         style="width: 200px; overflow: auto"
         :collapsible="true"
         :resizable="true">
      <!--bbn-tree class="bbn-ide-history-tree tree bbn-100"
                :source="treeLoad"
                :select="treeNodeActivate"
                :cfg="{lazyLoad: treeLazyLoad}"
      ></bbn-tree-->
      <bbn-tree class="bbn-ide-history-tree tree bbn-100"
                :source="root + 'history/tree'"
                :data="treeLoad"
                :select="treeNodeActivate"
                ref="treeHistory"
      ></bbn-tree>
    </div>
    <div class="bbn-h-100"
         style="padding: 0px"
         :collapsible="true"
         :resizable="true"
         :scrollable="false">
      <bbn-code v-if="selected"
                :value="code"
                :mode="mode"
      ></bbn-code>
    </div>
  </bbn-splitter>
</div>

