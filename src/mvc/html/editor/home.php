<!-- HTML Document -->
<div class="bbn-padded">
  <h1>Welcome in appui IDE!</h1>
  <p>From here you can access:</p>
  <ul>
  	<li><a :href="source.root + 'doc'" v-text="_('The bbn framework documentation')"></a></li>
  	<li><a :href="source.root + 'core/iconology'" v-text="_('The icons')"></a></li>
  	<li><a :href="source.root + 'core/special_chars'" v-text="_('The special characters')"></a></li>
  	<li><a :href="source.root + 'constants'" v-text="_('The constants')"></a></li>
  	<li><a :href="source.root + 'logs'" v-text="_('The log viewer')"></a></li>
  	<li><a :href="source.root + 'finder'" v-text="_('The finder')"></a></li>
  	<li><a :href="source.root + 'profiler'" v-text="_('The profiler')"></a></li>
  </ul>
</div>