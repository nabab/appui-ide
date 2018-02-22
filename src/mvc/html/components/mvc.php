<div class="bbn-100">
  <div class="bbn-h-100 code">
    <bbn-tabnav :autoload="false"
                :scrollable="false"
                ref="tabstrip"
                @tabLoaded="loadingTab"
    >
      <bbn-tab :static="true"
               :load="true"
               :url="repositories[repository].tabs['_ctrl'].url"
               :title="repositories[repository].tabs['_ctrl'].title"
               :bcolor="repositories[repository].tabs['_ctrl'].bcolor"
               :fcolor="repositories[repository].tabs['_ctrl'].fcolor"
      >
      </bbn-tab>
      <bbn-tab v-for="(tab, idx) in sctrl"
               :static="true"
               :load="true"
               :url="'_'.repeat(idx+1) + repositories[repository].tabs['_ctrl'].url"
               :title="repositories[repository].tabs['_ctrl'].title + (idx+1)"
               :key="'_'.repeat(idx+1) + repositories[repository].tabs['_ctrl'].url"
               :bcolor="repositories[repository].tabs['_ctrl'].bcolor"
               :fcolor="repositories[repository].tabs['_ctrl'].fcolor"
      >
      </bbn-tab>
      <bbn-tab v-for="(tab, idx) in repositories[repository].tabs"
               v-if="tab.url !== '_ctrl'"
               :static="true"
               :load="true"
               :url="tab.url"
               :title="tab.title"
               :key="tab.url"
               :style="{backgroundColor: tab.bcolor, color: tab.fcolor}"
               :selected="tab.default"
               :bcolor="tab.bcolor"
               :fcolor="tab.fcolor"
               :menu="getMenu(tab.url)"
      ></bbn-tab>
    </bbn-tabnav>
  </div>
</div>