<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\Mvc\Model*/
if ( isset($model->data['id']) ){
  return array_merge(
    $model->inc->pref->get($model->data['id']) ?? [],
    [
      'origin' => $model->data['id'],
      'root' => $model->pluginUrl('appui-ide').'/',
    ]);
}