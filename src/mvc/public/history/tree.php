<?php
if ( !empty($ctrl->inc->ide) ){
  if ( !empty($ctrl->post['data']) ){
    $data = $ctrl->post['data'];
  }
  elseif ( !empty($ctrl->post['url']) ){
    $data = $ctrl->post;
  }
  if ( isset($data) ){
    $ctrl->obj = $ctrl->get_object_model($data);
  }
}

