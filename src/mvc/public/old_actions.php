<?php
/* @var $ctrl \bbn\mvc */

if ( $ctrl->inc->user->is_admin() ){
  $ctrl->data = $ctrl->post;
  $model = $ctrl->get_model()['res'];

  // If present a error show the error
  if ( (\count($model) === 1) && isset($model['error']) ){
    $ctrl->obj->error = $model['error'];
  }
  else{
    if ( !empty($model) ){
      if ( $ctrl->data['act'] === 'export' ){
        $ctrl->obj->file = $model;
        $ctrl->delete_file = 1;
      }
      else{
        if ( $ctrl->data['act'] === 'save' ){
          if ( $id_option = $ctrl->inc->options->get_id($ctrl->data['file'], BBN_ID_SCRIPT) ){
            $ctrl->inc->pref->set($id_option, [
              'code' => md5($ctrl->post['code']),
              'selections' => isset($ctrl->post['selections']) ? $ctrl->post['selections'] : [],
              'marks' => isset($ctrl->post['marks']) ? $ctrl->post['marks'] : []
            ], $ctrl->inc->user->get_id());
          }
        }
        $ctrl->obj->success = 1;
        if ( isset($model['path']) ){
          $ctrl->obj->path = $model['path'];
        }
        if ( isset($model['new_file']) ){
          $ctrl->obj->new_file = $model['new_file'];
        }
        if ( isset($model['data']) ){
          $ctrl->obj->data = $model['data'];
        }
        if ( isset($model['tab_url']) ){
          $ctrl->obj->tab_url = $model['tab_url'];
        }
        if ( isset($model['sub_files']) ){
          $ctrl->obj->sub_files = $model['sub_files'];
        }
      }
    }
  }
}
else{
  $ctrl->obj->error = 'Error.';
}