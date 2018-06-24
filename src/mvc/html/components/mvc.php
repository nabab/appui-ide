<div class="bbn-100">
  <div class="bbn-h-100 code">
    <bbn-tabnav :autoload="false"
                :scrollable="false"
                ref="tabstrip"
                @tabLoaded="loadingTab"
    >
      <bbns-tab :static="true"
               :load="true"
               :url="repositories[repository].tabs[search(repositories[repository].tabs, 'url' ,'_ctrl')]['url']"
               :title="repositories[repository].tabs[search(repositories[repository].tabs, 'url' ,'_ctrl')]['title']"
               :bcolor="repositories[repository].tabs[search(repositories[repository].tabs, 'url' ,'_ctrl')]['bcolor']"
               :fcolor="repositories[repository].tabs[search(repositories[repository].tabs, 'url' ,'_ctrl')]['fcolor']"
      >
      </bbns-tab>
      <bbns-tab v-for="(tab, idx) in sctrl"
               :static="true"
               :load="true"
               :url="'_'.repeat(idx+1) + repositories[repository].tabs[search(repositories[repository].tabs, 'url' ,'_ctrl')]['url']"
               :title="repositories[repository].tabs[search(repositories[repository].tabs, 'url' ,'_ctrl')]['title'] + (idx+1)"
               :key="'_'.repeat(idx+1) + repositories[repository].tabs[search(repositories[repository].tabs, 'url' ,'_ctrl')]['url']"
               :bcolor="repositories[repository].tabs[search(repositories[repository].tabs, 'url' ,'_ctrl')]['bcolor']"
               :fcolor="repositories[repository].tabs[search(repositories[repository].tabs, 'url' ,'_ctrl')]['fcolor']"
      >
      </bbns-tab>
      <!--form permision-->
      <bbns-tab :static="true"
               :load="true"
               url="settings"
               :disabled="disabledSetting"
               title= "<?=_('Settings')?>"
               :selected="true"
      ></bbns-tab>
      <bbns-tab v-for="(tab, idx) in repositories[repository].tabs"
               v-if="tab.url !== '_ctrl'"
               :static="true"
               :load="true"
               :url="tab.url"
               :title="renderTitleTab(tab)"
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
