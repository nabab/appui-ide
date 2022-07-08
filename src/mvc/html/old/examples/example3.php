<!-- HTML Document -->

<div class="bbn-padded bbn-lg">
  <p>
    This is an example of a Vue object receiving the data from the model.
  </p>
  <div class="example3">
    <h2 v-text="source.myTitle"></h2>
    <h3 v-text="myText"></h3>
    <ul>
      <li v-for="c in source.countries" v-text="c.country"></li>
    </ul>
  </div>
</div>

