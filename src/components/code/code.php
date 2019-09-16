<bbn-code v-model="value"
          :mode="mode"
          :cfg="{
            selections: selections,
            marks: marks,
            save: save,
            test: test
          }"
          @ready="setState"
          ref="editor"
          @input="firstInput"
></bbn-code>