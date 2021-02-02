<?php
if ( !empty($ctrl->post['id']) && !empty($ctrl->post['code']) ){
  if ( $ctrl->inc->options->remove($ctrl->inc->options->fromCode($ctrl->post['code'], $ctrl->post['id'])) ){
    $ctrl->obj->data->success = 1;
  }
  else {
    $ctrl->obj->error = 'Error.';
  }
}
return false;
