<!-- HTML Document -->
<div class="bbn-overlay bbn-flex-height appui-finder">
  <bbn-toolbar>
    <div class="bbn-xl bbn-hpadded bbn-vspadded">
      <i class="nf nf-mdi-apple_finder bbn-large"></i> &nbsp;
      File finder
    </div>
    <div>
    </div>
    <div>
  		<bbn-dropdown :source="menu" v-model="froot"></bbn-dropdown>
    </div>
  </bbn-toolbar>
  <div class="bbn-flex-fill">
    <bbn-splitter orientation="horizontal"
                  :expandible="true"
                  :collapsible="true"
    > 
      <bbn-pane size="25%">
        <bbn-tree ref="tree"
                  :data="{fpath: froot}"
                  :source="root + '/files'"
                  :map="mapper"
                  @beforeLoad="beforeLoad"
                  @select="select"
                  @unselect="unselect"
          ></bbn-tree>
      </bbn-pane>
      <bbn-pane :scrollable="true">
        <div v-if="!isFile"
             class="bbn-middle">
          <h2 v-text="_('Select a file to edit its content')"></h2>
        </div>
        <bbn-loader v-else-if="!fileContent"></bbn-loader>
        <div v-else
             class="bbn-overlay bbn-flex-height">
          <bbn-toolbar class="bbn-padded">
            <bbn-button :text="_('Save')"
                         @click="save" 
            ></bbn-button>
            <bbn-button :text="_('Cancel')"
                         @click="cancel" 
            ></bbn-button>
          </bbn-toolbar>
          <div class="bbn-flex-fill">
            <div class="bbn-overlay">
              <component :is="componentTag"
                         v-bind="componentOptions"
                         v-model="fileContent"
                         class="bbn-100">
              </component>
            </div>
          </div>
        </div>
      </bbn-pane>
    </bbn-splitter>
  </div>
</div>