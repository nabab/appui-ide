<?php
/** @var $ctrl \bbn\mvc\controller */

if ( !empty($ctrl->arguments) ){

/*$id = $ctrl->inc->options->from_code('files', 'ide', 'appui');
  $options = $ctrl->inc->options->full_options($id);
*/
  $ctrl->data['url'] = implode('/', $ctrl->arguments);
  if ( $ctrl->obj->data = $ctrl->get_model(\bbn\x::merge_arrays($ctrl->data, $ctrl->post)) ){

    if ( !empty($ctrl->obj->data['error']) ){
      $ctrl->obj->error = $ctrl->obj->data['error'];
    }
  }
  echo $ctrl
    ->add_js()
    ->get_view();
  $ctrl->obj->url = $ctrl->baseURL.end($ctrl->arguments);
}
