      <!-- @tabLoaded="loadingTab" -->
<div class="bbn-100">
  <div class="bbn-h-100 code">
    <bbn-tabnav :autoload="false"
                :scrollable="false"
                ref="tabstrip"
    >
      <bbns-tab :static="true"
               :load="true"
               :url="countCtrl"
               :title="titleTabCtrl"
               :bcolor="tabsRepository[search(tabsRepository, 'url' ,'_ctrl')]['bcolor']"
               :fcolor="tabsRepository[search(tabsRepository, 'url' ,'_ctrl')]['fcolor']"
               :menu="listCtrls()"
      >
      </bbns-tab>

      <!--form permision-->
      <bbns-tab :static="true"
               :load="true"
               url="settings"
               :disabled="disabledSetting"
               title= "<?=_('Settings')?>"
               :selected="true"
               icon="fas fa-cogs"
      ></bbns-tab>
      <bbns-tab v-for="(tab, idx) in tabsRepository"
               v-if="tab.url !== '_ctrl'"
               :static="true"
               :load="true"
               :url="tab.url"
               :title="tab.title"
               :icon="tab.icon"
               :notext="true"
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
