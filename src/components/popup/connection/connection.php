<bbn-form :source="formSource"
          :buttons="buttons"
          :action="root + 'finder/save'"
          ref="form"
          @sucess="onSuccess">
	<div class="bbn-flex-fill bbn-grid-fields bbn-padded">
    <label class="bbn-label">
      <?=_('Connection name')?>
    </label>
    <bbn-input :required="true"
               v-model="formSource.text"
               :readonly="isTested"/>
    <label class="bbn-label">
      <?=_('Connection type')?>
    </label>
    <bbn-dropdown :source="types"
                  v-model="formSource.type"
                  :readonly="isTested"
                  :required="true"/>
    <template v-if="hostFieldVisible">
      <label class="bbn-label">
        <?=_('Host')?>
      </label>
      <bbn-input :required="true"
                 v-model="formSource.host"
                 :readonly="isTested"/>
    </template>
    <template v-if="userFieldVisible">
      <label class="bbn-label">
        <?=_('User')?>
      </label>
      <bbn-input :required="true"
                 v-model="formSource.user"
                 :readonly="isTested"/>
    </template>
    <template v-if="passFieldVisible">
      <label class="bbn-label">
        <?=_('Password')?>
      </label>
      <bbn-input :required="true"
                 type="password"
                 v-model="formSource.pass"
                 :readonly="isTested"/>
    </template>
    <template v-if="formSource.type === 'googledrive'">
      <label class="bbn-label">
        <?=_('Credentials')?>
      </label>
      <bbn-textarea :required="true"
                 v-model="formSource.user"
                 :readonly="isTested"
                 :resizable="false"/>
      <label class="bbn-label">
        <?=_('Token')?>
      </label>
      <div class="bbn-flex-width">
        <bbn-textarea :required="true"
                      v-model="formSource.pass"
                      :readonly="isTested"
                      :resizable="false"
                      class="bbn-flex-fill"/>
        <bbn-button class="bbn-left-space"
                    v-text="_('Generate')"
                    @click="generateGoogleDriveToken"
                    :disabled="!formSource.user"/>
      </div>
    </template>
    <label class="bbn-label">
      <?=_('Path')?>
    </label>
    <bbn-input v-model="formSource.path"
               :readonly="isTested"/>
  </div>
</bbn-form>