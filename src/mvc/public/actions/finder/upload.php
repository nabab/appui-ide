<?php

if ( !empty($ctrl->files) && !empty($ctrl->post['path']) ){
  $res = [];
  if ( $ctrl->inc->fs->upload($ctrl->files, $ctrl->post['path'])){
    $res = [
      'name' => str_replace(' ', '_', $ctrl->files['file']['name']), 
      'success' => true
    ];
    return $ctrl->obj->data = $res;
  }
}
