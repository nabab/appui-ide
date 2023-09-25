<?php

/** @var $ctrl \bbn\Mvc\Controller */

if ( !empty($dir) ){
  $res = $dir->historyClear($ctrl->post['url']);
  if ( !empty($res) ){
    $ctrl->obj->data = $res;
  }
  else {
    $ctrl->obj->error = $dir->getLastError();
  }
}
else {
  $ctrl->obj->error = 'Empty variable(s).';
}