<?php
if ( isset($this->post['session']) ){
  echo \bbn\tools::make_tree($this->inc->session->get()).'<p> </p><hr><p> </p>'.\bbn\tools::make_tree($_SERVER);
}
else{
  $this->set_title('Infos Session');
  echo
    '<h2><button class="k-button"
onclick="appui.f.post(\''.$this->say_dir().'/session\',
{session:1},
$(\'#info_session_container\'));"><i class="fa fa-refresh"> </i></button> &nbsp; &nbsp; &nbsp; Infos de session</h2>'.
    '<div
class="appui-line-break">'.
    '</div>'.
    '<div id="info_session_container" class="appui-nl"> </div>';
  $this->add_script("appui.f.post('".$this->say_dir()."/session', {session:1}, \$('#info_session_container'));");
}