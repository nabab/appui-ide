<component :is="source.isComponent ? 'appui-ide-component' : (source.isMVC ? 'appui-ide-mvc' : 'appui-ide-file')"
           :source="source"
           class="bbn-overlay appui-ide-source-holder"
           ref="file"
></component>