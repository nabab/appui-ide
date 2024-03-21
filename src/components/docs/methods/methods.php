<bbn-splitter class="bbn-ide-container" orientation="vertical">
  <bbn-pane class="bbn-ide-toolbar-container"
            :size="40"
            :scrollable="false"
            overflow="visible"
  >
    <bbn-toolbar class="bbn-overlay">
      <div class="bbn-flex-width bbn-w-100">
        <div class="bbn-w-90 bbn-vmiddle">
          <span class="bbn-b bbn-xl"><?= _("Class:") ?></span>
          <span class="bbn-xl"
                style="margin-left: 10px"
                v-text="source.class.full"
          ></span>
        </div>
        <!-- Legend -->
          <div class="bbn-w-30 bbn-r bbn-vmiddle bbn-spadded bbn-flex-width">
            <div class="bbn-flex-fill"></div>
            <div class="bbn-w-20 bbn-grid-fields bbn-spadded">
              <label class="bbn-b"><?= _('Member') ?></label>
              <div class="bbn-w-60 bbn-vmiddle">
                <div class="bbn-w-90 bbn-h-50 bbn-bg-black"></div>
              </div>
            </div>
            <div class="bbn-w-20 bbn-grid-fields bbn-spadded">
              <label class="bbn-b"><?= _('Method') ?></label>
              <div class="bbn-w-60 bbn-vmiddle">
                <div class="bbn-w-90 bbn-h-50 bbn-background-effect-tertiary"></div>
              </div>
            </div>
          </div>
      </div>
    </bbn-toolbar>
  </bbn-pane>
  <bbn-pane>
    <bbn-splitter :resizable="true"
                  :collapsible="true"
                  orientation="horizontal"
                  class="bbn-flex-fill"
      >
        <bbn-pane :size="300"
                  :collapsible="true"
                  :resizable="true"
        >
          <bbn-tree v-if="treeClass.length"
                    ref="tree"
                    :source="treeClass"
          ></bbn-tree>
        </bbn-pane>
        <bbn-pane>
          <bbn-scroll>
            <div v-if="treeClass.length && showClass"
                 v-for="(section, i) in treeClass"
            >
              <div v-for="(ele, id) in section.items">
                <component :is="$options.components.element"
                           :source= "ele"
                           class="bbn-smargin"
                           :ref="section+'_'+ele.text"
                ></component>
              </div>
            </div>
          </bbn-scroll>
        </bbn-pane>
    </bbn-splitter>
  </bbn-pane>
</bbn-splitter>

