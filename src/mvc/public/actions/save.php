<?php
/** @var \bbn\mvc\controller $ctrl */
if ( isset($ctrl->inc->dir) ){
  $cfg = [];
  if ( isset($ctrl->post['selections']) ){
    $cfg['selections'] = $ctrl->post['selections'];
  }
  if ( isset($ctrl->post['marks']) ){
    $cfg['marks'] = $ctrl->post['marks'];
  }
  $res = $ctrl->inc->dir->save($ctrl->post['file'], $ctrl->post['code'], $cfg, $ctrl->inc->pref);
  $ctrl->obj = $res;
}
