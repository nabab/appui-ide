<!-- HTML Document -->

<div class="bbn-flex-height appui-ide-finder-pane bbn-border-right">
  <div v-if="cp.uploading === source.path"
       class="bbn-flex-fill">
    <div class="bbn-right">
      <bbn-button icon="nf nf-fa-close"
                  @click="cp.uploading = false"
                  :title="_('Cancel upload')"
                  :notext="true"
                  class="bbn-xs"/>
    </div>
    <bbn-upload v-model="cp.uploaded"
                ref='upload'
                :data="{
                       origin: cp.origin,
                       path: source.path
                       }"
                :save-url="root + 'actions/finder/upload'"
                @success="cp.uploadSuccess"
                :label="{
                       uploadOrDrop: 'Select files or drag & drop it here'
                       }"/>
  </div>
  <div class="bbn-flex-fill" v-else>
    <div class="bbn-overlay">
      <bbn-tree :source="cp.source"
                :data="cp.getData(source)"
                :map="cp.mapTree"
                :menu="cp.itemsContextMenu"
                :key="'/' + source.path"
                @load="updateInfo"
                @select="select"/>
    </div>
  </div>

  <div class="bbn-w-100 bbn-widget appui-ide-finder-info" style="height: 12em">
    <div :class="{
                 'bbn-overlay': true,
                 'bbn-state-default': true,
                 'bbn-state-active': active,
                 'bbn-padding': true,
                 'bbn-alt-background': true,
                 'bbn-alt-bordered-top': true
                 }">
      <div class="bbn-grid-fields appui-ide-finder-info-dirs">
        <div class="bbn-grid-full bbn-l">
          <bbn-button class="bbn-xs bbn-p" @click="cp.refresh(source.name)" :title="_('Refresh tree')" icon="nf nf-fa-refresh"></bbn-button>
          <bbn-context :source="cp.contextMenuTree"
                       :data="{path: source.path}"
                       :key="source.path">
            <bbn-button class="bbn-xs" @click="cp.context" :title="_('New Folder/Add files to this folder')" icon="nf nf-fa-plus"/>
          </bbn-context>
        </div>
        <div v-text="_('Number of childs')" v-if="source.num_dirs || source.num_files"/>
        <div v-text="source.num_dirs + source.num_files" v-if="source.num_dirs || source.num_files"/>

        <div v-text="_('Directories')" v-if="source.num_dirs"/>
        <div v-text="source.num_dirs" v-if="source.num_dirs"/>

        <div v-text="_('Files')" v-if="source.num_files"/>
        <div v-text="source.num_files" v-if="source.num_files"/>

        <div v-text="_('Size')"/>
        <div v-if="!source.size">
          <bbn-button icon="nf nf-md-scale"
                      class="bbn-xs"
                      @click="cp.get_size(p)"
                      :title="_('Get dir size')"/>
        </div>
        <span v-text="source.size" v-else style="text-align:right!important"/>

        <div class="bbn-grid-full bbn-c" v-if="cp.isLoading && active">
          <bbn-button icon="nf nf-fa-hand_paper"
                      @click="cp.abortRequest(index)"
                      :label="_('Abort request')"
                      :title="_('Cancel the current request')"/>
        </div>
      </div>
    </div>
  </div>
</div>
