<?php
/* @var $this \bbn\mvc */

if ( $this->inc->user->is_admin() ){
  $this->data = $this->post;
  $model = $this->get_model()['res'];

  // If present a error show the error
  if ( (count($model) === 1) && isset($model['error']) ) {
    $this->obj->error = $model['error'];
  }
  else {
    if ( !empty($model) ){
      if ( $this->data['act'] === 'export' ){
        $this->obj->file = $model;
        $this->delete_file = 1;
      }
      else{
        if ( $this->data['act'] === 'save' ){
          if ( $id_option = $this->inc->options->get_id($this->data['file'], BBN_ID_SCRIPT) ){
            $this->inc->pref->set($id_option, [
              'code' => md5($this->post['code']),
              'selections' => isset($this->post['selections']) ? $this->post['selections'] : [],
              'marks' => isset($this->post['marks']) ? $this->post['marks'] : []
            ], $this->inc->user->get_id());
          }
        }
        $this->obj->success = 1;
        if ( isset($model['path']) ) {
          $this->obj->path = $model['path'];
        }
        if ( isset($model['new_file']) ){
          $this->obj->new_file = $model['new_file'];
        }
        if ( isset($model['data']) ){
          $this->obj->data = $model['data'];
        }
        if ( isset($model['tab_url']) ){
          $this->obj->tab_url = $model['tab_url'];
        }
        if ( isset($model['sub_files']) ){
          $this->obj->sub_files = $model['sub_files'];
        }
      }
    }
  }
}
else {
  $this->obj->error = 'Error.';
}