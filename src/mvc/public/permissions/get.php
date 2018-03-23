<?php
if ( !empty($ctrl->post['file']) && !empty($ctrl->post['path']) && isset($ctrl->inc->ide) ){
  $file = $ctrl->inc->ide->decipher_path($ctrl->post['path'].$ctrl->post['file']);
  $ctrl->obj = $ctrl->inc->ide->get_file_permissions($file);
}
return false;
