<component :is="(!isMVC || isMVC) && (source.permissions !== undefined) ?
                'appui-ide-settings' :
                'appui-ide-code'"
           :source="source"
           ref="content"
           :key="source.id"
></component>
