<!-- HTML Document -->

<div class="appui-ide-cls-method-new">
  <bbn-form :source="formData"
            :action="root + 'actions/new-method'"
            @success="updateClass"
            >
    <div class="bbn-grid-fields bbn-padding">
      <div v-if="!formData.name">
      	<label>Name</label>
        <bbn-input v-model="name"
                   :required="true"/>
        <br>
        <label>Position</label>
        <bbn-dropdown v-if="methods"
                      iconUp="nf nf-fa-caret_up"
                      iconDown="nf nf-fa-caret_down"
                      :source="['before', 'after', 'Eof']"
                      v-model="position"/>
        <bbn-dropdown v-if="methods && position !== 'Eof'"
                      iconUp="nf nf-fa-caret_up"
                      iconDown="nf nf-fa-caret_down"
                      :source="methodsArray"
                      v-model="curMeth"/>
        <bbn-button class="bbn-state-selected"
                    :text="_('Start writing your method')"
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