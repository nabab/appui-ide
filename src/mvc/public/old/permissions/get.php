<?php
if ( !empty($ctrl->post['file']) && !empty($ctrl->post['path']) && isset($ctrl->inc->ide) ){
  $file = $ctrl->inc->ide->decipherPath($ctrl->post['path'].$ctrl->post['file']);
  $ctrl->obj = $ctrl->inc->ide->getFilePermissions($file);
}
return false;
