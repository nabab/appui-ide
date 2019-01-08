<component :is="source.isComponent ? 'appui-ide-components' : (source.isMVC ? 'appui-ide-mvc' : 'appui-ide-file')"
           :source="source"
           ref="file"
></component>
