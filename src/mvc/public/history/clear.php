<?php

/** @var $ctrl \bbn\mvc\controller */

if ( !empty($dir) ){
  $res = $dir->history_clear($ctrl->post['url']);
  if ( !empty($res) ){
    $ctrl->obj->data = $res;
  }
  else {
    $ctrl->obj->error = $dir->get_last_error();
  }
}
else {
  $ctrl->obj->error = 'Empty variable(s).';
}