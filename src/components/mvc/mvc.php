<!-- @tabLoaded="loadingTab" -->
<div class="bbn-100 component-mvc">
  <div class="bbn-h-100 code">
    <bbn-router :autoload="false"
                :nav="true"
                :scrollable="false"
                ref="tabstrip"
                :source="routerSource"
                v-if="tabsReady"
    ></bbn-router>
  </div>
</div>
