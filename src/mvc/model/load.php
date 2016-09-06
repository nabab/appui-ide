<?php
if ( !empty($model->data['file']) && !empty($model->data['dir']) && isset($model->data['routes']) ){
  $dirs = new \bbn\ide\directories($model->inc->options, $model->data['routes']);
  if ( $res = $dirs->load($model->data['file'], $model->data['dir'], (isset($model->data['tab']) ? $model->data['tab'] :
    false), $model->inc->pref) ){
    return $res;
  }
  return ['error' => $dirs->get_last_error()];
}
