<?php
/** @var $ctrl \bbn\mvc\controller */
if ( !empty($ctrl->post['data']['repository']) &&
  !empty($ctrl->post['data']['repository_cfg']) &&
  isset($ctrl->post['data']['onlydirs'], $ctrl->post['data']['tab'])
){
  $ctrl->data = \bbn\x::merge_arrays($ctrl->data, $ctrl->post['data']);
  $ctrl->obj->data = $ctrl->get_model();
  $ctrl->obj->success = true;
  $ctrl->inc->session->set($ctrl->data['repository'], 'ide', 'repository');
}
