<bbn-code v-model="value"
          :mode="source.mode"
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