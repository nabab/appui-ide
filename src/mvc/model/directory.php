<?php
/** @var \bbn\mvc\model $model */
if ( isset($model->data['path']) ){
  $dirs = new \bbn\ide\directories($model->inc->options);
  return $dirs->dir($model->data['path']);
}
