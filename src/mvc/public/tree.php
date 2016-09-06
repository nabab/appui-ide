<?php
// Non mandatory, thew path to explore
if ( isset($ctrl->post['dir']) ){
  $ctrl->data['dir'] = $ctrl->post['dir'];
}
else if ( isset($ctrl->post['mode']) ){
  $ctrl->data['dir'] = $ctrl->post['mode'];
  $ctrl->data['onlydir'] = $ctrl->post['onlydir'];
}
if ( isset($ctrl->data['dir']) ){
  if ( isset($ctrl->post['path']) ){
    $ctrl->data['path'] = $ctrl->post['path'];
  }
  $ctrl->data['routes'] = $ctrl->get_routes();
  $ctrl->obj->data = $ctrl->get_model();
  $ctrl->inc->session->set($ctrl->data['dir'], 'ide', 'dir');
}