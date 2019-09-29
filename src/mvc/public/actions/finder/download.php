<?php
if ( isset($ctrl->post['value']) &&
    isset($ctrl->post['path'])
  ){

  $success = false;
  
  $path = $ctrl->post['path'].$ctrl->post['value'];
  $file = $ctrl->inc->fs->download($path);
  $ctrl->obj->file = $file;
  if ( $ctrl->inc->fs->get_mode() === 'nextcloud'){
    
  }
}


