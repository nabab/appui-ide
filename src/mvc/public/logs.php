<?php
/* @var $ctrl \bbn\mvc */
if ( isset($ctrl->post['log']) ){
  $ctrl->data['log'] = $ctrl->post['log'];
  $ctrl->data['clear'] = !empty($ctrl->post['clear']);
  $ctrl->data['num_lines'] = isset($ctrl->post['num_lines']) && \bbn\str::is_integer($ctrl->post['num_lines']) ? $ctrl->post['num_lines'] : 100;
  $ctrl->obj = $ctrl->get_object_model();
}
else{
  $ctrl->obj->title = "Log files";
  $ctrl->data = $ctrl->get_model();
  echo $ctrl->add_js(['root' => $ctrl->say_dir().'/'])
            ->get_view();
}
