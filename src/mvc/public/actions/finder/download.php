<?php

use bbn\X;
if ( isset($ctrl->post['value']) &&
    isset($ctrl->post['path'])
  ){

  $success = false;
  
  $path = $ctrl->post['path'].$ctrl->post['value'];
  
  $file = $ctrl->inc->finderfs->download($path);
  $ctrl->obj->file = $file;
  if ( $ctrl->inc->finderfs->getMode() === 'nextcloud'){
    
  }
}


