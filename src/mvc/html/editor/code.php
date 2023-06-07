<!-- HTML Document -->

<appui-newide-editor-history v-if="source.isHistory"
														 :source="source"	/>
<appui-newide-coder v-else :source="source"></appui-newide-coder>
