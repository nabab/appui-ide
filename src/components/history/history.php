<div class="bbn-full-screen bbn-ide-history">
  <bbn-splitter :resizable="true"
                :collapsible="true"
                orientation="horizontal"
  >
    <bbn-pane :resizable="true" :collapsible="true" :size="230">
      <bbn-tree class="bbn-ide-history-tree tree"
                :source="source.root + 'history/tree'"
                :data="initialData"
                :map="transform"
                @select="treeNodeActivate"
                @load="loadedTree"
                ref="treeHistory"
      ></bbn-tree>
    </bbn-pane>
    <bbn-pane>
      <div class="bbn-full-screen" v-if="selected">
        <bbn-code :value="code"
                  :mode="mode"
        ></bbn-code>
      </div>
      <div v-if="noHistory" class="bbn-h-100 bbn-middle">
        <div class="bbn-card bbn-vmiddle bbn-c bbn-lpadded">
            <span class="bbn-xxxl bbn-c">
              <?=_("No history")?>
            </span>
        </div>
      </div>
    </bbn-pane>
  </bbn-splitter>
</div>
