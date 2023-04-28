<component :is="source.permissions !== undefined ?
                'appui-newide-settings' :
                'appui-newide-code'"
           :source="source"
           ref="content"
           :key="source.id"
></component>
