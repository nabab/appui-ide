<?php
/** @var $model \bbn\mvc\model */


if ( !empty($model->data['url']) && isset($model->inc->ide) ){
  $model->data['url'] = str_replace('/_end_', '', $model->data['url']);
  if ( $ret = $model->inc->ide->load($model->data['url']) ){
    return $ret;
  }
  else {
    return ['error' => $model->inc->ide->get_last_error()];
  }
}
