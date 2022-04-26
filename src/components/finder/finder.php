<div :class="[componentClass, 'bbn-overlay']">
  <div v-if="mode === 'dual'" class="bbn-overlay">
    <bbn-splitter orientation="horizontal"
                  :resizable="true"
                  :collapsible="true">
      <bbn-pane :collapsible="true"
                :resizable="true">
        <bbn-tree v-if="dirs[0]"
                  :source="source"
                  :data="dirTreeData"
                  :map="mapTree"
                  :menu="itemsContextMenu"
                  :key="'/' + dirs[0].path"
                  @beforeUnfold="onUnfold"
                  @load="updateInfo"
                  @select="select">
        </bbn-tree>
      </bbn-pane>
      <bbn-pane :collapsible="true"
                :resizable="true">
        <bbn-tree v-if="dirs[1]"
                  :source="source"
                  :data="getData(dirs[1])"
                  :map="mapTree"
                  :menu="itemsContextMenu"
                  :key="'/' + dirs[1].path"
                  @load="updateInfo"
                  @select="select">
        </bbn-tree>
      </bbn-pane>
    </bbn-splitter>
  </div>
  <bbn-scroll v-else
              axis="x"
              :class="componentClass"
              ref="scroll">
    <!-- Each tree pane -->
		<appui-ide-finder-pane v-for="(p, i) in dirs"
                           :key="p.path"
                           :source="p"
                           :active="i === (numCols - 1)"
													 :index="i"/>
    <!-- File detail / Image preview -->
    <div v-if="preview && currentFile"
         class="appui-ide-finder-info-file-container bbn-flex-height">
      <div class="bbn-grid-fields bbn-header bbn-widget bbn-spadded">
        <span v-text="_('Filename')"/>
        <span v-text="currentFile ? currentFile.node.data.value : ''"/>
        <span v-if="currentFile.info && currentFile.info.size"
              v-text="_('Size')"/>
        <span v-text="(currentFile.info && currentFile.info.size) ? currentFile.info.size : ''"/>
        <span v-if="(currentFile.info && currentFile.info.width)"
              v-text="_('Width')"/>
        <span v-if="(currentFile.info && currentFile.info.width)"
              v-text="currentFile.info.width + 'px'"/>
        <span v-if="(currentFile.info && currentFile.info.height)"
              v-text="_('Height')"/>
        <span v-if="(currentFile.info && currentFile.info.height)"
              v-text="currentFile.info.height + 'px'"/>
        <!--span v-if="currentFile.info && currentFile.info.creation" v-text="_('Creation')"></span>
                <span-- v-text="(currentFile.info && currentFile.info.creation) ? currentFile.info.creation : ''"></span-->
        <span v-if="currentFile.info && currentFile.info.mtime" v-text="_('Last modification')"/>
        <span v-text="(currentFile.info && currentFile.info.mtime) ? currentFile.info.mtime : ''"/>
        <span v-if="currentFile && currentFile.owner" v-text="_('Owner')"/>
        <span v-if="currentFile && currentFile.owner" v-text="currentFile.owner"/>
        <span v-if="currentFile && currentFile.gowner" v-text="_('Group owner')"/>
        <span v-if="currentFile && currentFile.gowner" v-text="currentFile.gowner"/>
        <div class="bbn-grid-full bbn-right">
          <bbn-button icon="nf nf-fa-hand_paper_o"
                      @click="abortRequest('file')"
                      :text="_('Abort request')"
                      :title="_('Cancel the current request')"
                      v-if="isLoading"/>
          <bbn-button icon="nf nf-fa-save"
                      :text="_('Save')"
                      :notext="true"
                      @click="saveFile"/>
          <bbn-button icon="nf nf-fa-close"
                      @click="closePreview"
                      :title="_('Close preview')"
                      :notext="true"/>
        </div>
      </div>
      <bbn-code class="bbn-flex-fill"
                v-if="currentFile.info && currentFile.info.content && !isImage && !isText && !isJson && !isMarkdown && !isLoading"
                v-model="currentFile.info.content"/>
      <bbn-json-editor class="bbn-flex-fill"
                       v-else-if="currentFile.info && !isImage && !isText && isJson && !isMarkdown && !isLoading"
                       v-model="currentFile.info.content"/>
      <bbn-textarea class="bbn-flex-fill"
                    v-else-if="currentFile.info && !isImage && isText && !isJson && !isMarkdown && !isLoading"
                    v-model="currentFile.info.content"/>
      <bbn-markdown class="bbn-flex-fill"
                    v-else-if="currentFile.info && !isImage && !isText && !isJson && isMarkdown && !isLoading"
                    v-model="currentFile.info.content"/>
      <div v-else-if="isImage && !isLoading"
           class="bbn-flex-fill bbn-c bbn-padded">
        <!--need of origin for the filesystem to recognize the environment-->
        <img :src="root + 'actions/finder/image/' +  encodedURL + '/' + origin" style="max-width:80%">
      </div>
      <div v-else-if="currentFile.info && !currentFile.info.content && !isImage && !isText && !isJson && !isMarkdown && !isLoading"
           class="bbn-padded bbn-medium bbn-b">
        <div v-if="sizeInfo > 200000000"
             v-text="_('The content of the file exceeds the authorized limit (2mb)')"/>
        <div v-else
             v-text="_('The content of this file cannot be shown')"/>
      </div>
      <div v-else-if="isLoading"
           class="bbn-padded bbn-medium bbn-b"
           v-text="_('Loading file infos..')">
      </div>
    </div>
  </bbn-scroll>
  <bbn-popup ref="popup"/>
</div>

