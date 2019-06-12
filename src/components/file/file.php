<div class="bbn-overlay">
  <div class="bbn-h-100 code">
    <bbn-tabnav :autoload="false" :scrollable="false" ref="tabstrip">
      <bbns-container :static="true"
               :load="true"
               url="code"
               :menu="getMenu()"
               title="<?=_('Code')?>"
      ></bbns-container>
    </bbn-tabnav>
  </div>
</div>



 <!-- @tabLoaded="loadingTab"> -->
