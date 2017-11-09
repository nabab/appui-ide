<div class="bbn-full-screen bbn-ide-history">
  <bbn-splitter orientation="horizontal">
    <div class="bbn-h-100"
         style="width: 230px; overflow: auto"
         :collapsible="true"
         :resizable="true">

      <bbn-tree class="bbn-ide-history-tree tree"
                :source="source.root + 'history/tree'"
                :data="initialData"
                :map="transform"
                @select="treeNodeActivate"
                ref="treeHistory"
      ></bbn-tree>
      <!--<bbn-tree v-if="treeLoad"
                class="bbn-ide-history-tree tree"
                :source="dataTree"
                @select="treeNodeActivate"
                ref="treeHistory">-->

      </bbn-tree>

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
