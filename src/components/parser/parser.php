<div class="bbn-flex-height bbn-h-100">
  <div class="bbn-overlay bbn-padding"
       v-if="!errorParser">
    <!-- Switch all or not class parser -->
    <div v-if="parserClass !== false">
      <span class="bbn-b bbn-xl bbn-padding"
            v-text="_('Own')"
            :style="{color: showAllParser ? '#000000' : '#ff6b18'}"/>

      <bbn-switch v-model="showAllParser"
                  :novalue="false"
                  :value="true"/>

      <span class="bbn-b bbn-xl bbn-padding"
            v-text="_('All')"
            :style="{color: showAllParser ? '#ff6b18 ' : '#000000'}"/>
    </div>

    <!-- Name element -->
    <div v-if="parserClass !== false"
         class="bbn-vpadding">
      <i class="nf nf-fa-eye"/>
      <span class="bbn-left-smargin"
            v-text="source.class"/>
    </div>

    <!-- Legend -->
    <div class="bbn-flex-width" v-if="showAllParser">
      <div class="bbn-vmiddle bbn-spadding">
        <span class="bbn-b"
              v-text="_('Legend')+': '"/>
      </div>
      <div class="bbn-flex-fill bbn-c bbn-card bbn-grid-fields bbn-spadding">
        <label class="bbn-b"><?= _('Current') ?></label>
        <div class="bbn-w-100 bbn-vmiddle">
          <div class="bbn-w-90 bbn-h-50 bbn-bg-black"></div>
        </div>
        <label class="bbn-b"><?= _('Parent') ?></label>
        <div class="bbn-w-100 bbn-vmiddle">
          <div class="bbn-w-90 bbn-h-50 bbn-bg-green"></div>
        </div>
        <label class="bbn-b"><?= _('Trait') ?></label>
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
                :component="$options.components.item"/>
    </div>
  </div>

  <!--Title card-->
  <div v-else
       class="bbn-middle bbn-h-100">
    <div class="bbn-card bbn-vmiddle bbn-c bbn-lpadding">
      <span class="bbn-b bbn-xl bbn-c">
        <?= _("Parser class or file js in component") ?>
      </span>
    </div>
  </div>
</div>


<!--       <div v-else-if="!sourceParser && !errorTreeParser"
              class="bbn-middle bbn-h-100"
        >
          <div class="bbn-card bbn-vmiddle bbn-c bbn-lpadding">
            <span class="bbn-b bbn-xl bbn-c">
            <?= _("Empty Tree Parser") ?>
            </span>
          </div>
        </div>
        <div v-else-if="!sourceParser && errorTreeParser"
              class="bbn-middle bbn-h-100"
        >
          <div class="bbn-card bbn-vmiddle bbn-c bbn-lpadding">
            <span class="bbn-b bbn-xl bbn-c">
              <?= _("Parser class or file js in component") ?>
            </span>
          </div>
        </div>
      </div>
    </div>
</div>          -->