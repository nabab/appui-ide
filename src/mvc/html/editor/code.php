<!-- HTML Document -->

<appui-ide-editor-history v-if="source.isHistory"
                             :source="source" />
<appui-ide-coder v-else
                    :source="source"></appui-ide-coder>