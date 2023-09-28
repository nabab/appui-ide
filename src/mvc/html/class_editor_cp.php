<appui-ide-cls v-if="currentClass && data"
               :infos="tests_info"
               :methinfos="methods_info"
               :installed="libInstalled"
               :libroot="libRoot"
               :path="currentPath"
               :mode="currentMode"
               :source="data"/>
