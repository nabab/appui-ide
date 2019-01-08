<!--   @tabLoaded="loadingTab"-->
<div class="bbn-100">
  <div class="bbn-h-100 code">
    <bbn-tabnav :autoload="false"
                :scrollable="false"
                ref="tabstripComponents"
    >
      <bbns-tab v-for="(tab, idx) in tabsList"
               :load="true"
               :url="tab.url"
               :static= "true"
               :icon="tab.icon"
               :title="renderEmptyTab(tab)"
               :key="tab.url"
               :style="{backgroundColor: tab.bcolor, color: tab.fcolor}"
               :selected="tab.default"
               :bcolor="tab.bcolor"
               :fcolor="tab.fcolor"
               :menu="getMenu(tab.url)"
      ></bbns-tab>
    </bbn-tabnav>
  </div>
</div>
