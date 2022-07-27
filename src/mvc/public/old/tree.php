<?php
/** @var $ctrl \bbn\Mvc\Controller */
if ( !empty($ctrl->post['data']['repository']) &&
  !empty($ctrl->post['data']['repository_cfg']) &&
  isset($ctrl->post['data']['onlydirs'], $ctrl->post['data']['tab'])
){
  $ctrl->data = \bbn\X::mergeArrays($ctrl->data, $ctrl->post['data']);
  $ctrl->obj->data = $ctrl->getModel();
  $ctrl->obj->success = true;
  $ctrl->inc->session->set($ctrl->data['repository'], 'ide', 'repository');
}
