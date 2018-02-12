<?php
/** @var \bbn\mvc\controller $ctrl */
if ( isset($ctrl->inc->ide, $ctrl->post['full_path']) ){
  $ctrl->post['full_path'] = str_replace('/_end_', '', $ctrl->post['full_path']);
  //\bbn\x::log($ctrl->post, "saveIde");
  $ctrl->obj->data = $ctrl->inc->ide->save($ctrl->post);
}
