<!-- HTML Document -->
<div class="bbn-overlay">
  <bbn-router :nav="true"
              :autoload="true">
    <bbns-container url="list"
                    :label="_('List')"
                    :load="true"
                    :pinned="true"
                    :closable="false"/>
  </bbn-router>
</div>