<!-- HTML Document -->
<div class="bbn-overlay">
  <bbn-table :pageable="true"
             :filterable="true"
             :sortable="true"
             :source="source.data"
             >
    <bbns-column field="date"
                 :label="_('Date')"
                 type="datetime"
                 :width="120"
                 ></bbns-column>
    <bbns-column field="short_id"
                 :label="_('Commit')"
                 :render="renderUrl"
                 :width="90"
                 ></bbns-column>
    <bbns-column field="project"
                 :label="_('Project Name')"
                 :render="renderProject"
                 ></bbns-column>
    <bbns-column field="author"
                 :label="_('Author')"
                 ></bbns-column>
    <bbns-column field="author_email"
                 :label="_('Author Email')"
                 type="email"
                 ></bbns-column>
    <bbns-column field="title"
                 :label="_('Title')"
                 ></bbns-column>
    <bbns-column field="message"
                 :label="_('Message')"
                 ></bbns-column>
  </bbn-table>
</div>
