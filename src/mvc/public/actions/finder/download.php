<?php


if ( isset($ctrl->post['value']) &&
    isset($ctrl->post['path']) &&
    !empty($ctrl->post['origin'])
  ){
  
  $success = false;
  $dest = $ctrl->tmp_path().$ctrl->post['value'];
  $path = $ctrl->post['path'].$ctrl->post['value'];
 
  $ctrl->inc->fs->download($path);
  $ctrl->obj->file = $dest;
}


