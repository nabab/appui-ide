      <!-- @tabLoaded="loadingTab" -->
<div class="bbn-100 component-mvc">
  <div class="bbn-h-100 code">
    <bbn-tabnav :autoload="false"
                :scrollable="false"
                ref="tabstrip"
                :source="routerSource"
                v-if="tabsReady"
    ></bbn-tabnav>
  </div>
</div>
