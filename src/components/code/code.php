<bbn-code v-model="value"
          :mode="mode"
          :cfg="{
            selections: selections,
            marks: marks,
            save: save,
            test: test
          }"
          @ready="setState"
          @input="getLine"
          ref="editor"
></bbn-code>