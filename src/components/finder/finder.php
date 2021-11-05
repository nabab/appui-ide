<div :class="[componentClass, 'bbn-overlay']">
  <div v-if="mode === 'dual'" class="bbn-overlay">
    <bbn-splitter orientation="horizontal"
                  :resizable="true"
                  :collapsible="true">
      <bbn-pane :collapsible="true"
                :resizable="true">
          <bbn-tree v-if="dirs[0]"
                    :source="source"
                    :data="getData(dirs[0])"
                    :map="mapTree"
                    :menu="itemsContextMenu"
                    :key="'/' + dirs[0].path"
                    @load="updateInfo"
                    @select="select"
                    >
          </bbn-tree>
      </bbn-pane>
    </bbn-splitter>
  </div>
  <bbn-scroll v-else axis="x" :class="componentClass" ref="scroll">
    <!-- Each tree pane -->
    <div v-for="(p, i) in dirs"
         class="bbn-flex-height appui-ide-finder-pane bbn-bordered-right">

      <div v-if="uploading === p.path"
           class="bbn-flex-fill"
           >
        <div class="bbn-right">
          <bbn-button icon="nf nf-fa-close"
                      @click="uploading = false"
                      :title="_('Cancel upload')"
                      :notext="true"
                      class="bbn-xs"
                      ></bbn-button>
        </div>
        <bbn-upload v-model="uploaded" 
                    ref='upload'
                    :data="{
                           origin: origin, 
                           path: p.path
                           }"
                    :save-url="root + 'actions/finder/upload'"
                    @success="uploadSuccess"
                    :text="{
                           uploadOrDrop: 'Select files or drag & drop it here'
                           }"
                    ></bbn-upload>
      </div>
      <div class="bbn-flex-fill" v-else>
        <div class="bbn-overlay">
          <bbn-tree :source="source"
                    :data="getData(p)"
                    :map="mapTree"
                    :menu="itemsContextMenu"
                    :key="'/' + p.path"
                    @load="updateInfo"
                    @select="select"
                    >
          </bbn-tree>
        </div>
      </div>


      <div class="bbn-w-100 bbn-widget appui-ide-finder-info" style="height: 12em">
        <div :class="{
                     'bbn-overlay': true,
                     'bbn-state-default': true,
                     'bbn-state-active': i === (numCols - 1),
                     'bbn-padded': true,
                     'bbn-alt-background': true,
                     'bbn-alt-bordered-top': true
                     }"
             >
          <div class="bbn-grid-fields appui-ide-finder-info-dirs">
            <div class="bbn-grid-full bbn-l">
              <bbn-button class="bbn-xs bbn-p" @click="refresh(p.name)" :title="_('Refresh tree')" icon="nf nf-fa-refresh"></bbn-button>
              <bbn-context :source="contextMenuTree"
                           :data="{path: p.path}" 
                           :key="p.path"
                           >
                <bbn-button class="bbn-xs" @click="context" :title="_('New Folder/Add files to this folder')" icon="nf nf-fa-plus"></bbn-button>
              </bbn-context>
            </div>
            <div v-text="_('Number of childs')" v-if="p.num_dirs || p.num_files"></div>
            <div v-text="p.num_dirs + p.num_files" v-if="p.num_dirs || p.num_files"></div>

            <div v-text="_('Directories')" v-if="p.num_dirs"></div>
            <div v-text="p.num_dirs" v-if="p.num_dirs"></div>

            <div v-text="_('Files')" v-if="p.num_files"></div>
            <div v-text="p.num_files" v-if="p.num_files"></div>

            <div v-text="_('Size')"></div>
            <div v-if="!p.size">
              <bbn-button icon="nf nf-mdi-scale"
                          class="bbn-xs"
                          @click="get_size(p)" 
                          :title="_('Get dir size')"
                          ></bbn-button>         
            </div>
            <span v-text="p.size" v-else style="text-align:right!important"></span>

            <div class="bbn-grid-full bbn-c" v-if="isLoading && (i === (numCols - 1))">
              <bbn-button icon="nf nf-fa-hand_paper" 
                          @click="abortRequest(i)"
                          :text="_('Abort request')"
                          :title="_('Cancel the current request')"
                          ></bbn-button>               
            </div>
          </div>
        </div>          
      </div>
    </div>
    <!-- File detail / Image preview -->
    <div v-if="preview && currentFile"               
         class="appui-ide-finder-info-file-container bbn-flex-height"
         >
      <div class="bbn-grid-fields bbn-header bbn-widget bbn-spadded">
        <span v-text="_('Filename')"></span>
        <span v-text="currentFile ? currentFile.node.data.value : ''"></span>
        <span v-if="currentFile.info && currentFile.info.size" v-text="_('Size')"></span>
        <span v-text="(currentFile.info && currentFile.info.size) ? currentFile.info.size : ''"></span>
        <span v-if="(currentFile.info && currentFile.info.width)" v-text="_('Width')"></span>
        <span v-if="(currentFile.info && currentFile.info.width)" v-text="currentFile.info.width + 'px'"></span>
        <span v-if="(currentFile.info && currentFile.info.height)" v-text="_('Height')"></span>
        <span v-if="(currentFile.info && currentFile.info.height)" v-text="currentFile.info.height + 'px'"></span>
        <!--span v-if="currentFile.info && currentFile.info.creation" v-text="_('Creation')"></span>
                <span-- v-text="(currentFile.info && currentFile.info.creation) ? currentFile.info.creation : ''"></span-->
        <span v-if="currentFile.info && currentFile.info.mtime" v-text="_('Last modification')"></span>
        <span v-text="(currentFile.info && currentFile.info.mtime) ? currentFile.info.mtime : ''"></span>
        <span v-if="currentFile && currentFile.owner" v-text="_('Owner')"></span>
        <span v-if="currentFile && currentFile.owner" v-text="currentFile.owner"></span>
        <span v-if="currentFile && currentFile.gowner" v-text="_('Group owner')"></span>
        <span v-if="currentFile && currentFile.gowner" v-text="currentFile.gowner"></span>
        <div class="bbn-grid-full bbn-right">
          <bbn-button icon="nf nf-fa-hand_paper_o"
                      @click="abortRequest('file')"
                      :text="_('Abort request')"
                      :title="_('Cancel the current request')"
                      v-if="isLoading"

                      ></bbn-button>
          <bbn-button icon="nf nf-fa-save"
                      :text="_('Save')"
                      :notext="true"
                      @click="saveFile"></bbn-button>
          <bbn-button icon="nf nf-fa-close"
                      @click="closePreview"
                      :title="_('Close preview')"
                      :notext="true"
                      ></bbn-button>
        </div>
      </div>
      <bbn-code class="bbn-flex-fill"
                v-if="currentFile.info && currentFile.info.content && !isImage && !isText && !isJson && !isMarkdown && !isLoading"
                v-model="currentFile.info.content"
                ></bbn-code>
      <bbn-json-editor class="bbn-flex-fill"
                       v-else-if="currentFile.info && !isImage && !isText && isJson && !isMarkdown && !isLoading"
                       v-model="currentFile.info.content">
      </bbn-json-editor>
      <bbn-textarea class="bbn-flex-fill"
                    v-else-if="currentFile.info && !isImage && isText && !isJson && !isMarkdown && !isLoading"
                    v-model="currentFile.info.content">
      </bbn-textarea>
      <bbn-markdown class="bbn-flex-fill"
                    v-else-if="currentFile.info && !isImage && !isText && !isJson && isMarkdown && !isLoading"
                    v-model="currentFile.info.content">
      </bbn-markdown>
      <div v-else-if="isImage && !isLoading" 
           class="bbn-flex-fill bbn-c bbn-padded"
           >
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
  <bbn-popup ref="popup"></bbn-popup>
</div>

