<?php
if ( !empty($model->data) ){
  if ( !empty($model->inc->ide->copy($model->data)) ){
    return ['success' => true];
  }
  else {
    return [
      'success' => false,
      'error' => $model->inc->ide->get_last_error()
    ];
  }
}