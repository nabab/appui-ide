<?php
/** @var $ctrl \bbn\mvc\controller */

if ( !empty($ctrl->arguments) ){
  $step = $ctrl->arguments;
  $ctrl->data['url'] = implode('/', $ctrl->arguments);

  if ( $ctrl->obj->data = $ctrl->get_model(\bbn\x::merge_arrays($ctrl->data, $ctrl->post)) ){
    if ( !empty($ctrl->obj->data['error']) ){
      $ctrl->obj->error = $ctrl->obj->data['error'];
    }
  }
  echo $ctrl
    ->set_title($ctrl->arguments[count($ctrl->arguments)-1])
    ->add_js()
    ->get_view();
  if ( (end($ctrl->arguments) === "settings") ||
    ($ctrl->arguments[count($ctrl->arguments) - 2]  === "settings")
  ){
    //url tabnav settings
    $ctrl->obj->url = $ctrl->baseURL.'settings';
  }
  else{
    $ctrl->obj->url = $ctrl->baseURL.end($ctrl->arguments);
  }
}
