<?php
/** @var $ctrl \bbn\mvc\controller */
if ( !empty($ctrl->post['repository']) &&
  !empty($ctrl->post['repository_cfg']) &&
  isset($ctrl->post['onlydirs'], $ctrl->post['tab'])
){
  $ctrl->data = \bbn\x::merge_arrays($ctrl->data, $ctrl->post);
  $ctrl->obj->data = $ctrl->get_model();
  $ctrl->inc->session->set($ctrl->data['repository'], 'ide', 'repository');
}