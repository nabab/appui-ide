<?php
/**
 * @var \bbn\mvc\controller $ctrl
 * @var \bbn\ide\directories $ctrl->inc->dir
 */
if ( isset($ctrl->inc->dir, $ctrl->post['dir'], $ctrl->post['path'], $ctrl->post['name'], $ctrl->post['type']) ){
  $res = $ctrl->inc->dir->create(
    $ctrl->post['dir'],
    $ctrl->post['tab'],
    $ctrl->post['path'],
    $ctrl->post['name'] . ( empty($ctrl->post['ext']) ? '' : '.' . $ctrl->post['ext'] ),
    $ctrl->post['type']
  );
  if ( is_string($res) ){
    if ( !empty($ctrl->post['code']) ){
      // Add file to page permissions table
      
    }
    $ctrl->obj->success = 1;
    $ctrl->obj->id = $res;
  }
  else{
    $ctrl->obj->error = $ctrl->inc->dir->get_last_error();
  }
}