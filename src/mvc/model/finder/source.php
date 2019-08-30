<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\model*/
if ( isset($model->data['id']) ){
  return array_merge(
    $model->inc->pref->get($model->data['id']),
    [
      'origin' => $model->data['id'],
      'root' => $model->plugin_url('appui-ide').'/',
    ]);
}