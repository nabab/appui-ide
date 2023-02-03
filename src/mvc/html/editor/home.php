<!-- HTML Document -->
<div class="bbn-padded">
  <h1>Welcome in appui IDE!</h1>
  <p>From here you can access:</p>
  <ul>
  	<li><a :href="root + 'doc'" v-text="_('The bbn framework documentation')"></a></li>
  	<li><a :href="root + 'iconology'" v-text="_('The icons')"></a></li>
  	<li><a :href="core + 'special_chars'" v-text="_('The special characters')"></a></li>
  	<li><a :href="root + 'constants'" v-text="_('The constants')"></a></li>
  	<li><a :href="root + 'logs'" v-text="_('The log viewer')"></a></li>
  	<li><a :href="root + 'finder'" v-text="_('The finder')"></a></li>
  	<li><a :href="root + 'profiler'" v-text="_('The profiler')"></a></li>
    <li><a :href="root + 'git/list'" v-text="_('Last commits')"></a></li>
  </ul>
</div>