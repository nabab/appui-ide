<div class="bbn-flex-height bbn-h-100 bbn-middle">
  <div class=" bbn-overlay bbn-padded"
       v-if="!errorParser"
  >
    <!-- Switch all or not class parser -->
    <div v-if="parserClass !== false">
      <span class="bbn-b bbn-xl bbn-padded"
            v-text="_('Own')"
            :style="{'color': !showAllParser ? '#ff6b18 ' : '#000000'}"
      ></span>

      <bbn-switch v-model="showAllParser"
                  :novalue="false"
                  :value="true"
      ></bbn-switch>

      <span class="bbn-b bbn-xl bbn-padded"
            v-text="_('All')"
            :style="{'color': showAllParser ? '#ff6b18 ' : '#000000'}"
      ></span>
    </div>

    <!-- Name element -->
    <div v-if="parserClass !== false"
          class="bbn-vpadded"
    >
      <i class="nf nf-fa-eye"></i>
      <span v-text="source.class"></span>
    </div>

    <!-- Legend -->
    <div class="bbn-flex-width" v-if="showAllParser">
      <div class="bbn-vmiddle bbn-spadded">
        <span class="bbn-b"
              v-text="_('Legend')+': '"
        ></span>
      </div>
      <div class="bbn-flex-fill bbn-c bbn-card bbn-grid-fields bbn-spadded">
        <label class="bbn-b"><?=_('Current')?></label>
        <div class="bbn-w-100 bbn-vmiddle">
          <div class="bbn-w-90 bbn-h-50 bbn-bg-black"></div>
        </div>
        <label class="bbn-b"><?=_('Parent')?></label>
        <div class="bbn-w-100 bbn-vmiddle">
          <div class="bbn-w-90 bbn-h-50 bbn-bg-green"></div>
        </div>
        <label class="bbn-b"><?=_('Trait')?></label>
        <div class="bbn-w-100 bbn-vmiddle">
          <div class="bbn-w-90 bbn-h-50 bbn-bg-red"></div>
        </div>
      </div>
    </div>

    <!-- Tree Parser -->
    <div class="bbn-flex-fill bbn-h-100">
      <bbn-tree :source="sourceParser"
                v-if="!errorParser"
                class="tree"
                :component="$options.components.item"
      ></bbn-tree>
  </div>
  </div>

  <!--Title card-->
  <div v-else
        class="bbn-middle bbn-h-100"
  >
    <div class="bbn-card bbn-vmiddle bbn-c bbn-lpadded">
      <span class="bbn-b bbn-xl bbn-c">
        <?=_("Parser class or file js in component")?>
      </span>
    </div>
  </div>
</div>


 <!--       <div v-else-if="!sourceParser && !errorTreeParser"
              class="bbn-middle bbn-h-100"
        >
          <div class="bbn-card bbn-vmiddle bbn-c bbn-lpadded">
            <span class="bbn-b bbn-xl bbn-c">
            <?=_("Empty Tree Parser")?>
            </span>
          </div>
        </div>
        <div v-else-if="!sourceParser && errorTreeParser"
              class="bbn-middle bbn-h-100"
        >
          <div class="bbn-card bbn-vmiddle bbn-c bbn-lpadded">
            <span class="bbn-b bbn-xl bbn-c">
              <?=_("Parser class or file js in component")?>
            </span>
          </div>
        </div>
      </div>
    </div>
</div>          -->