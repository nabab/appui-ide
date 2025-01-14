<!-- HTML Document -->

<div class="appui-ide-cls-method-new">
  <bbn-form :source="formData"
            :action="root + 'actions/new-constant'"
            @success="updateClass"
            >
    <div class="bbn-grid-fields bbn-padding">
      <div v-if="!formData.name">
      	<label>Name</label>
        <bbn-input v-model="name"
                   :required="true"/>
        <bbn-button class="bbn-state-selected"
                    :label="_('Add your constant')"
                    @click.stop="prepare"/>
      </div>

      <label v-if="formData.name">Code</label>
      <bbn-code v-if="formData.name"
                v-model="formData.code"
                mode="purephp"
                :fill="false"
                :required="true"/>
    </div>
  </bbn-form>
</div>