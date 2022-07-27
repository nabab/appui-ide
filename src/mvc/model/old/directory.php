<?php
/** @var \bbn\Mvc\Model $model */
if ( isset($model->data['path']) ){
  $dirs = new \bbn\Ide\Directories($model->inc->options);
  return $dirs->dir($model->data['path']);
}
