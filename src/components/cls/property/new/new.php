<!-- HTML Document -->

<div class="appui-ide-cls-method-new">
  <bbn-form :source="formData"
            :action="root + 'actions/new-property'"
            @success="updateClass"
            >
    <p v-if="!formData.name" class="bbn-red">To add or edit promoted property edit the constructor with editor...</p>
    <div v-else>
      <p class="bbn-red">Hint: Readonly property cannot have a default value...</p>
      <p class="bbn-red">Hint: Static property cannot be readonly...</p>
    </div>
    <div class="bbn-grid-fields bbn-padding">
      <div v-if="!formData.name">
      	<label>Name</label>
        <bbn-input v-model="name"
                   :required="true"/>
        <bbn-button class="bbn-state-selected"
                    :label="_('Add your property')"
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