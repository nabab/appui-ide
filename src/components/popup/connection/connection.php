<bbn-form :source="formSource"
          :buttons="buttons"
          :action="root + 'finder/save'"
          ref="form">
	<div class="bbn-flex-fill bbn-grid-fields bbn-padded">
     <label>Connection name</label>
     <bbn-input :required="true"
                v-model="formSource.text"
                :readonly="isTested"/>
    <label>Connection type</label>
    <bbn-dropdown :source="types"
                  v-model="type"
                  :readonly="isTested"
                  :required="true"/>
     <label v-if="formSource.type !== 'local'">Host</label>
     <bbn-input v-if="formSource.type !== 'local'"
                :required="true"
                v-model="formSource.host"
                :readonly="isTested"/>
     <label v-if="formSource.type !== 'local'">User</label>
     <bbn-input v-if="formSource.type !== 'local'"
                :required="true"
                v-model="formSource.user"
                :readonly="isTested"/>
     <label v-if="formSource.type !== 'local'">Password</label>
     <bbn-input v-if="formSource.type !== 'local'"
                :required="true"
                type="password"
                v-model="formSource.pass"
                :readonly="isTested"/>
     <label>Path</label>
     <bbn-input v-model="formSource.path"
                :readonly="isTested"/>
  </div>
</bbn-form>