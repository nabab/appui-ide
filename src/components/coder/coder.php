<!-- HTML Document -->
<div class="bbn-overlay bbn-padding">
  <bbn-dropdown v-model="myTheme"
                :source="themes"/>
  <luk-codemirror class="bbn-top-padding"
                  v-model="myCode"
                  :theme="myTheme"
                  :mode="myMode"/>
</div>