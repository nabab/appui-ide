<!-- HTML Document -->
<bbn-splitter class="appui-ide-service-worker-component bbn-overlay"
              orientation="vertical"
              :resizable="true"
              :collapsible="true">
	<bbn-pane :size="50"
            :resizable="false"
            :collapsible="false">
    <bbn-toolbar>
      <bbn-button label="Check info" @click="checkInfo"></bbn-button>
      <bbn-button label="Poll" @click="pollerSW"></bbn-button>
      <bbn-button label="Clear" @click="clear"></bbn-button>
      <bbn-button :class="{'bbn-state-active': followLog}"
                  :label="followLog ? _('Follow log') : _('Unfollow')"
                  @click="followLog = !followLog"></bbn-button>
      <div class="bbn-toolbar-separator"></div>
      <bbn-initial v-for="(w, i) in windows"
                   :key="w.id"
                   :letters="(i+1).toString()"
                   class="bbn-hsmargin"
                   :user-name="'ID: ' + w.id + '\nToken: ' + w.token"></bbn-initial>
    </bbn-toolbar>
  </bbn-pane>
	<bbn-pane>
    <div class="bbn-100">
      <bbn-splitter orientation="vertical">
      	<bbn-pane :size="50">
          <bbn-splitter orientation="horizontal">
            <bbn-pane>
              <h3 class="bbn-c">
                <?= _("Client") ?>
              </h3>
            </bbn-pane>
            <bbn-pane>
              <h3 class="bbn-c">
                <?= _("Request") ?>
              </h3>
            </bbn-pane>
            <bbn-pane>
              <h3 class="bbn-c">
                <?= _("Response") ?>
              </h3>
            </bbn-pane>
          </bbn-splitter>
        </bbn-pane>
        <bbn-pane>
          <bbn-splitter orientation="horizontal">
            <bbn-pane :size="120">
              <bbn-list :source="clientLogs"
                        source-text="time"
                        uid="tst"
                        @select="selectClient"></bbn-list>
            </bbn-pane>
            <bbn-pane>
              <bbn-json-editor v-model="clientJSON" readonly="readonly"></bbn-json-editor>
            </bbn-pane>
            <bbn-pane :size="120">
              <bbn-list :source="requestLogs"
                        source-text="time"
                        uid="tst"
                        @select="selectRequest"></bbn-list>
            </bbn-pane>
            <bbn-pane>
              <bbn-json-editor v-model="requestJSON" readonly="readonly"></bbn-json-editor>
            </bbn-pane>
            <bbn-pane :size="120">
              <bbn-list :source="responseLogs"
                        source-text="time"
                        uid="tst"
                        @select="selectResponse"></bbn-list>
            </bbn-pane>
            <bbn-pane>
              <bbn-json-editor v-model="responseJSON" readonly="readonly"></bbn-json-editor>
            </bbn-pane>
          </bbn-splitter>
        </bbn-pane>
      </bbn-splitter>
    </div>
  </bbn-pane>
	<bbn-pane>
    <bbn-code ref="code" type="ruby" v-model="log" class="bbn-100" readonly="readonly"></bbn-code>
  </bbn-pane>
</bbn-splitter>