<!-- HTML Document -->

<div class="custom-home">
  <div class="bbn-padding h-container">
    <div class="bbn-flex-width">
      <div class="bbn-flex-fill bbn-padding bbn-margin nav1">
        <h1>Welcome to Bbn Appui IDE <i class="nf nf-dev-code"></i></h1>
        <h2 class="starter">Starter Guide <i class="nf nf-md-television_guide"></i></h2>
        <br><br>
        <h3 class="quick">Quick Access</h3>
        <ul class="start">
          <li>
            <i class="nf nf-fa-image"></i>  <a :href="root + 'iconology'" v-text="_('Iconology')"></a><br>
          	<span>Access all bbn ide icons font</span>
          </li>
          <li>
            <i class="nf nf-fa-font"></i>  <a :href="core + 'special_chars'" v-text="_('Chartology')"></a><br>
          	<span>Access all bbn ide special characters</span>
          </li>
          <li>
            <i class="nf nf-fa-info_circle"></i>  <a :href="root + 'constants'" v-text="_('Constants')"></a><br>
          	<span>Access all bbn ide constants variables</span>
          </li>
          <li>
            <i class="nf nf-fa-file_text"></i>  <a :href="root + 'logs'" v-text="_('Log Viewer')"></a><br>
          	<span>Access bbn ide logs to debug errors or more</span>
          </li>
          <li>
            <i class="nf nf-mdi-apple_finder bbn-large"></i>  <a :href="root + 'finder'" v-text="_('Finder')"></a><br>
          	<span>Access bbn ide file finder</span>
          </li>
          <li>
            <i class="nf nf-seti-php"></i>  <a :href="root + 'profiler'" v-text="_('PHP Profiler')"></a><br>
          	<span>Access php profiler to profile and benchmark your php scripts</span>
          </li>
        </ul>
        <br><br>
        <h3 class="recent-files">Recents Files</h3>
        <ul class="recent">
          <li><i class="nf nf-cod-file_code"></i>  <a href="#">easdsqxas</a></li>
          <li><i class="nf nf-cod-file_code"></i>  <a href="#">easdsqxas</a></li>
          <li><i class="nf nf-cod-file_code"></i>  <a href="#">easdsqxas</a></li>
          <li><i class="nf nf-cod-file_code"></i>  <a href="#">easdsqxas</a></li>
          <li><i class="nf nf-cod-file_code"></i>  <a href="#">easdsqxas</a></li>
          <li><i class="nf nf-cod-file_code"></i>  <a href="#">easdsqxas</a></li>
          <li><i class="nf nf-cod-file_code"></i>  <a href="#">easdsqxas</a></li>
          <li><i class="nf nf-cod-file_code"></i>  <a href="#">easdsqxas</a></li>
        </ul>
      </div>
      <div class="bbn-flex-fill bbn-padding bbn-margin nav2">
        <br><br>
        <h2>Documentation  <i class="nf nf-md-file_document_edit"></i></h2>
        <a :href="root + 'bbn-readme'">
          <div class="doc-container">
            <br><br>
            <p class="doc">Here you can find all BBN Ide documentation to get familiar with usage and more.</p>
          </div>
        </a>
        <h2>Featured Tools <i class="nf nf-fae-tools"></i></h2>
        <div class="tool-container">
          <div class="bbn-flex-fill bbn-ratio">
            <a :href="root + 'dns'">
              <div class="bbn-block bbn-space bbn-c bbn-padding dns">
                <i class="nf nf-mdi-dns"></i>
                Dns Tool
              </div>
            </a>
            <a :href="root + 'session'">
              <div class="bbn-block bbn-space bbn-c bbn-padding session">
                <i class="nf nf-fa-user_secret"></i>
                Sesssion Infos
              </div>
            </a>
            <a :href="root + 'service-worker'">
              <div class="bbn-block bbn-space bbn-c bbn-padding service-worker">
                <i class="nf nf-cod-dashboard"></i>
                Service Worker
              </div>
            </a>
            <a href="#">
              <div class="bbn-block bbn-space bbn-c bbn-padding file-explorer">
                <i class="nf nf-md-file_cabinet"></i>
                File Explorer
              </div>
            </a>
          </div>
        </div>
        <h2>Upcomming Tools <i class="nf nf-dev-mootools_badge"></i></h2>
        <div class="untool-container">
          <div class="bbn-flex-fill bbn-ratio">
            <a href="#">
              <div class="bbn-block bbn-space bbn-c bbn-padding class-editor">
                <i class="nf nf-seti-php"></i>
                Class Editor
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>