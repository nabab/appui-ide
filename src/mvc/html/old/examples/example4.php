<!-- HTML Document -->

<div class="bbn-padded bbn-lg">
  <p>
    This is an example of a Vue object receiving the data from the model.<br>
    It is using a component from the bbn-vue library (which will be autoloaded if not already defined).<br>
    This page uses classic CSS, not Less.
    
  </p>
  <div class="example4">
    <h2 v-text="source.myTitle"></h2>
    <h3 v-text="myText"></h3>
		<bbn-list :source="countries"></bbn-list>
  </div>
</div>

