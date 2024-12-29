<component :is="source.permissions !== undefined ?
                'appui-ide-settings' :
                (source.isHistory ?
                    'appui-ide-editor-history' :
                    'appui-ide-coder')"
           :source="source"
           ref="content"
           :key="source.id"
></component>
