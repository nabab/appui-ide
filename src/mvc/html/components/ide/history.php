<div class="bbn-full-screen bbn-ide-history">
  <bbn-splitter orientation="horizontal"
                :collapsible="true"
                :resizable="true">
    <bbn-pane :size="230"
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
                ref="treeHistory"
      </bbn-tree>-->

    </bbn-pane>
    <bbn-pane :scrollable="false">
      <bbn-code v-if="selected"
                :value="code"
                :mode="mode"
      ></bbn-code>
    </bbn-pane>
  </bbn-splitter>
</div>

