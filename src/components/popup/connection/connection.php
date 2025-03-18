<bbn-form :source="formSource"
          :buttons="buttons"
          :action="root + 'finder/save'"
          ref="form"
          @success="onSuccess">
	<div class="bbn-flex-fill bbn-grid-fields bbn-padding">
     <label><?=_("Connection name")?></label>
     <bbn-input :required="true"
                bbn-model="formSource.text"
                :readonly="isTested"/>
    <label><?=_("Connection type")?></label>
    <bbn-dropdown :source="types"
                  bbn-model="type"
                  :readonly="isTested"
                  :required="true"/>
     <label bbn-if="formSource.type !== 'local'"><?=_("Host")?></label>
     <bbn-input bbn-if="formSource.type !== 'local'"
                :required="true"
                bbn-model="formSource.host"
                :readonly="isTested"/>
     <label bbn-if="formSource.type !== 'local'"><?=_("User")?></label>
     <bbn-input bbn-if="formSource.type !== 'local'"
                :required="true"
                bbn-model="formSource.user"
                :readonly="isTested"/>
     <label bbn-if="formSource.type !== 'local'"><?=_("Password")?></label>
     <bbn-input bbn-if="formSource.type !== 'local'"
                :required="true"
                type="password"
                bbn-model="formSource.pass"
                :readonly="isTested"/>
     <label><?=_("Path")?></label>
     <bbn-input bbn-model="formSource.path"
                :readonly="isTested"
                class="bbn-wider"/>
  </div>
</bbn-form>