<!-- HTML Document -->
<bbn-splitter orientation="vertical" class="appui-ide-finder">
  <bbn-pane :size="40">
    <div class="bbn-overlay bbn-middle">
      <div class="bbn-flex-width">
        <div class="bbn-hpadded">
          <bbn-input placeholder="<?=_('Host')?>" v-model="host" ref="host"></bbn-input>
        </div>
        <div class="bbn-hpadded">
          <bbn-input placeholder="<?=_('User')?>" v-model="user" ref="user"></bbn-input>
        </div>
        <div class="bbn-hpadded">
          <bbn-input placeholder="<?=_('Password')?>" type="password" v-model="pass" ref="pass"></bbn-input>
        </div>
        <div class="bbn-hpadded">
          <bbn-button ftitle="<?=_('Is connected')?>"
                      :icon="'nf nf-fa-lightbulb bbn-' + (isConnected ? 'green' : 'red')"
                      @click="connect"></bbn-button>
        </div>
        <div class="bbn-flex-fill bbn-hpadded">
          <bbn-input placeholder="<?=_('Path')?>" v-model="origin" style="width: 100%" :readonly="true"></bbn-input>
        </div>
      </div>
    </div>
  </bbn-pane>
  <bbn-pane :scrollable="false">
    <bbn-scroll axis="x" ref="scroll" class="finder-scroll">
      <!-- Each tree pane -->
      <div v-for="(p, i) in dirs"
           class="bbn-flex-height"
           style="width: 25em; border-right: 2px dotted; float: left">
        <div class="bbn-flex-fill">
          <bbn-context :source="finderContextMenu" 
                        @click="select"
          >
            <div class="bbn-overlay">
              <bbn-tree :source="source.root + 'finder'"
                        :data="getData(p)"
                        :menu="itemsContextMenu"
                        :key="'/' + p.path"
                        @load="updateInfo"
                        @select="select"
              >
              </bbn-tree>
            </div>
          </bbn-context>
        </div>
        <div class="bbn-w-100 bbn-widget" style="height: 10em">
          <div :class="{
                       'bbn-overlay': true,
                       'bbn-state-default': true,
                       'bbn-state-active': i === (numCols - 1)
                       }"
          >
            <div class="bbn-grid-fields bbn-header bbn-widget info-dirs">
              <div v-text="_('Number of childs:')" v-if="p.num_dirs || p.num_files"></div>
              <div v-text="p.num_dirs + p.num_files" v-if="p.num_dirs || p.num_files"></div>

              <div v-text="_('Directories:')" v-if="p.num_dirs >= 0"></div>
              <div v-text="p.num_dirs"  v-if="p.num_dirs >= 0"></div>

              <div v-text="_('Files:')" v-if="p.num_files >= 0"></div>
              <div v-text="p.num_files" v-if="p.num_files >= 0"></div>

              <div v-text="_('Size:')"></div>
              <div v-if="!p.size">
                <bbn-button icon="nf nf-fa-database"
                            @click="get_size(p)" 
                            title="<?=_("Get dir size")?>"
                ></bbn-button>         
              </div>
              <span v-text="p.size" v-else></span>
              <div class="bbn-grid-full bbn-c@" v-if="(isLoading && i === (numCols - 1) )">
                <bbn-button icon="nf nf-fa-hand_paper" 
                            @click="abortRequest('dir')"
                            text="<?=_('Abort request')?>"
                            title="<?=_('Cancel the current request')?>"
                ></bbn-button>               
              </div>
            </div>
          </div>          
        </div>
      </div>
      <!-- File detail / Image preview -->
      <div v-if="currentFile"               
           class="info-file-container bbn-flex-height"
      >
        <div class="bbn-grid-fields bbn-header bbn-widget">
          <span><?=_('Filename:')?></span>             
          <span v-text="currentFile ? currentFile.node.data.value : ''"></span>             
          <span v-if="currentFile.info && currentFile.info.size"><?=_('Size:')?></span>   
          <span v-text="(currentFile.info && currentFile.info.size) ? currentFile.info.size : ''"></span>           
          <span v-if="(currentFile.info && currentFile.info.width)"><?=_('Width:')?></span>   
          <span v-if="(currentFile.info && currentFile.info.width)" v-text="currentFile.info.width + 'px'"></span>           
          <span v-if="(currentFile.info && currentFile.info.height)"><?=_('Height:')?></span>   
          <span v-if="(currentFile.info && currentFile.info.height)" v-text="currentFile.info.height + 'px'"></span>           
          <span v-if="currentFile.info && currentFile.info.creation"><?=_('Creation:')?></span>   
          <span v-text="(currentFile.info && currentFile.info.creation) ? currentFile.info.creation : ''"></span>           
          <span v-if="currentFile.info && currentFile.info.mtime"><?=_('Last modification:')?></span>   
          <span v-text="(currentFile.info && currentFile.info.mtime) ? currentFile.info.mtime : ''"></span>
          <div class="bbn-padded">
            <div v-if="isLoading">
              <bbn-button icon="nf nf-fa-hand_paper" 
                          @click="abortRequest('file')"
                          text="<?=_('Abort request')?>"
                          title="<?=_('Cancel the current request')?>"
                         
              ></bbn-button>
            </div>    
          </div>          
        </div>
        <bbn-code class="bbn-flex-fill" 
                  v-if="currentFile.info && currentFile.info.content && !isImage && !isLoading"
                  :value="currentFile.info.content"
        ></bbn-code>
        <div v-else-if="isImage && !isLoading" 
             class="bbn-flex-fill bbn-c bbn-padded"
        >
          <img :src="source.root + 'actions/finder/image/' +  encodedURL">
        </div>
        <div v-else-if="currentFile.info && !currentFile.info.content && !isImage && !isLoading"
             class="bbn-padded bbn-medium bbn-b"
        >
          <?=_('The content of this file cannot be shown')?>           
        </div>
        <div v-else-if="isLoading" 
             class="bbn-padded bbn-medium bbn-b"
        >
          <?=_('Loading file infos..')?>           
        </div>
      </div>
    </bbn-scroll>
  </bbn-pane>
</bbn-splitter>
<script type="text/x-template" id="form">
	<bbn-form :source="source"
            class="bbn-overlay" 
            :buttons=[]
            :action="source.root + 'actions/finder/edit'"
						@success="success"
  >
    <div class="bbn-vpadded bbn-grid-fields">
      <span><?=_('Name:')?></span>                 
  		<bbn-input v-model="source.node.value"></bbn-input>    
  	</div>
  </bbn-form>
</script>