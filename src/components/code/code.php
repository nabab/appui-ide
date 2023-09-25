<div :class="[componentClass, 'bbn-reset', 'bbn-overlay']">
  <bbn-code v-model="value"
            :mode="source.mode"
            class="bbn-100"
            :cfg="{
              selections: source.selections,
              marks: source.marks,
              save: save,
              test: test
            }"
            @ready="setState"
            @input="getLine"
            ref="editor"
            :theme="theme"
  ></bbn-code>
</div>
