<!-- HTML Document -->

<div class="appui-ide-cls-new">
  <bbn-form :source="formData"
            :action="root + 'actions/new-class'"
            @success="updateClasses"
            >
  <div class="bbn-grid-fields bbn-padding">
    <label>Namespace</label>
    <bbn-input v-model="formData.namespace"
               :required="true"/>
    <label>Class name</label>
    <bbn-input v-model="formData.classname"
               :required="true"/>
  </div>
  </bbn-form>
</div>