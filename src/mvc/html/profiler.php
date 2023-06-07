<!-- HTML Document -->
<div class="bbn-overlay">
  <bbn-router :nav="true"
              :autoload="true">
    <bbns-container url="home"
                    :title="_('Home')"
                    :notext="true"
                    icon="nf nf-cod-home"
                    :load="true"
                    :pinned="true"
                    :closable="false"/>
    <bbns-container url="list"
                    :title="_('List')"
                    :load="true"
                    :pinned="true"
                    :closable="false"/>
  </bbn-router>
</div>