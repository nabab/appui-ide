<div class="bbn-full-screen">
  <div class="bbn-h-100 code">
    <bbn-tabnav :autoload="false" :scrollable="false" ref="tabstrip" @tabLoaded="loadingTab">
      <bbns-tab :static="true"
               :load="true"
               url="code"
               :menu="getMenu()"
               title="<?=_('Code')?>"
      ></bbns-tab>
    </bbn-tabnav>
  </div>
</div>