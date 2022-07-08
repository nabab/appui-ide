<?php

$success = false;
if ( isset($ctrl->post['path'], $ctrl->post['new'], $ctrl->post['node']['value'], $ctrl->post['newDir'] ) ){
  
  if ( strpos( $ctrl->post['path'], './') === 0 ){
    $path = '';
  }
  else {
    $path = $ctrl->post['path'];
  }
  $finalPath = $path . $ctrl->post['node']['value'].'/'.$ctrl->post['newDir'];
  //before to create the new folder check if it exists 
  if ( !$ctrl->inc->finderfs->exists($finalPath) ){
    $success = $ctrl->inc->finderfs->mkdir($finalPath);
    $ctrl->obj->success = $success;
    $ctrl->obj->data['new_dir'] = $ctrl->post['newDir'];
  }
  
}

