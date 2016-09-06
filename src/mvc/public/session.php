<?php
if ( isset($ctrl->post['session']) ){
  echo \bbn\x::make_tree($ctrl->inc->session->get()).'<p> </p><hr><p> </p>'.\bbn\x::make_tree($_SERVER);
}
else{
  $ctrl->set_title('Infos Session');
  echo
    '<h2><button class="k-button"
onclick="appui.fn.post(\''.$ctrl->say_dir().'/session\',
{session:1},
$(\'#info_session_container\'));"><i class="fa fa-refresh"> </i></button> &nbsp; &nbsp; &nbsp; Infos de session</h2>'.
    '<div
class="appui-line-break">'.
    '</div>'.
    '<div id="info_session_container" class="appui-nl"> </div>';
  $ctrl->add_script("appui.fn.post('".$ctrl->say_dir()."/session', {session:1}, \$('#info_session_container'));");
}