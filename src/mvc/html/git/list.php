<!-- HTML Document -->
<div class="bbn-overlay">
  <bbn-table :pageable="true"
             :filterable="true"
             :sortable="true"
             :source="source.data"
             >
    <bbns-column field="date"
                 :title="_('Date')"
                 type="datetime"
                 :width="120"
                 ></bbns-column>
    <bbns-column field="short_id"
                 :title="_('Commit')"
                 :render="renderUrl"
                 :width="90"
                 ></bbns-column>
    <bbns-column field="project"
                 :title="_('Project Name')"
                 :render="renderProject"
                 ></bbns-column>
    <bbns-column field="author"
                 :title="_('Author')"
                 ></bbns-column>
    <bbns-column field="author_email"
                 :title="_('Author Email')"
                 type="email"
                 ></bbns-column>
    <bbns-column field="title"
                 :title="_('Title')"
                 ></bbns-column>
    <bbns-column field="message"
                 :title="_('Message')"
                 ></bbns-column>
  </bbn-table>
</div>
