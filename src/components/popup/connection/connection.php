<bbn-form :source="formSource"
          :buttons="buttons"
          :action="root + 'finder/save'"
          ref="form">
	<div class="bbn-flex-fill bbn-grid-fields bbn-padded">
     <label>Connection name</label>
     <bbn-input :required="true"
                v-model="formSource.text"
                :readonly="isTested"/>
     <label>Host</label>
     <bbn-input :required="true"
                v-model="formSource.host"
                :readonly="isTested"/>
     <label>User</label>
     <bbn-input :required="true"
                v-model="formSource.user"
                :readonly="isTested"/>
     <label>Password</label>
     <bbn-input :required="true"
                type="password"
                v-model="formSource.pass"
                :readonly="isTested"/>
     <label>Path</label>
     <bbn-input v-model="formSource.path"
                :readonly="isTested"/>
  </div>
</bbn-form>