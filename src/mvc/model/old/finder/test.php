<?php
/**
   * What is my purpose?
   *
   **/

/** @var $model \bbn\Mvc\Model*/


if ($model->hasData(['text', 'type'], true)) {
  if ($model->data['type'] !== 'local' && !$model->hasData(['host', 'user', 'pass'], true)) {
      return [
        'error' => 'incorrect arguments'
      ];
  }
  $fields = ['path', 'host', 'user', 'pass', 'type', 'text'];
  $cfg = [];
  foreach ( $fields as $f ){
    if ( isset($model->data[$f]) ){
      $cfg[$f] = $model->data[$f];
    }
  }

  $fs = new \bbn\File\System($cfg['type'], $cfg);
  return [
    'success' => $fs->check()
  ];
}