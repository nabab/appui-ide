<appui-ide-mvc :source="source" v-if="isMVC" ref="file"></appui-ide-mvc>
<appui-ide-file :source="source" v-else ref="file"></appui-ide-file>