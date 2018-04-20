<?php
/* @var $ctrl \bbn\mvc */
if ( isset($ctrl->post['log']) ){
  $ctrl->data['log'] = $ctrl->post['log'];
  $ctrl->data['clear'] = !empty($ctrl->post['clear']);
  $ctrl->data['num_lines'] = isset($ctrl->post['num_lines']) && \bbn\str::is_integer($ctrl->post['num_lines']) ? $ctrl->post['num_lines'] : 100;
  $ctrl->obj = $ctrl->get_object_model();
  
}
else if ( isset($ctrl->post['fileLog'], $ctrl->post['md5']) ){
  $ctrl->action();
}
else {
  $ctrl->data['root'] = $ctrl->say_dir().'/';
  $ctrl->obj->bcolor = '#333';
  $ctrl->obj->fcolor = '#FFF';
  $ctrl->obj->icon = 'fa fa-file-text';
  $ctrl->combo("Log files", true);
}
