<div class="bbn-overlay component-file">
  <bbn-router :autoload="false"
              :nav="true"
              :scrollable="false"
              ref="tabstrip"
  >
    <bbns-container :fixed="true"
                    :load="true"
                    url="code"
                    :menu="getMenu()"
                    icon="nf nf-fa-code"
    ></bbns-container>
  </bbn-router>
</div>
