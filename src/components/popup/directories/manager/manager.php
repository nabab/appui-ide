<!-- HTML Document -->

<bbn-table class="appui-ide-popup-directories-manager"
           :source="repositoriesArray"
           :tr-style="trStyle">
  <bbns-column field="title"
               label="Nom"
               cls="bbn-b"/>
  <bbns-column field="name"
               label="Root"/>
  <bbns-column field="alias_code"
               label="Type"/>
  <bbns-column field="bcolor"
               label="Color"/>
  <bbns-column field="path"
               label="Path"/>
</bbn-table>