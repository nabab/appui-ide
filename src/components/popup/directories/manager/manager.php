<!-- HTML Document -->

<bbn-table class="appui-ide-popup-directories-manager"
           :source="repositoriesArray"
           :tr-style="trStyle">
  <bbns-column field="title"
               title="Nom"
               cls="bbn-b"/>
  <bbns-column field="name"
               title="Root"/>
  <bbns-column field="alias_code"
               title="Type"/>
  <bbns-column field="bcolor"
               title="Color"/>
  <bbns-column field="path"
               title="Path"/>
</bbn-table>