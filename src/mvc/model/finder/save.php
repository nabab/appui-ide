<?php

/** @var $model \bbn\Mvc\Model*/



if ($model->hasData(['text', 'type'], true)) {
  if ($model->data['type'] !== 'local' && !$model->hasData(['host', 'user', 'pass'], true)) {
    return [
      'success' => true,
      'test' => 'incorrect arguments'
    ];
  }
  $fields = ['path', 'host', 'pass', 'user', 'type', 'text'];
  $cfg = [];
  foreach ( $fields as $f ){
    if ( isset($model->data[$f]) ){
      $cfg[$f] = $model->data[$f];
    }
  }
  $fs = new \bbn\File\System($model->data['type'], $cfg);
  if ($fs->check()) {

    $idOption = $model->inc->options->fromCode('sources', 'finder', 'appui');

    $id = $model->inc->pref->addToGroup($idOption, $cfg);

    if ($cfg['type'] !== 'local') {
      $pwd = new bbn\Appui\Passwords($model->db);
    }


    return [
      'success' => isset($pwd) ? $pwd->userStore($model->data['pass'], $id, $model->inc->user) : true,
      'data' => [
        'value' => $id,
        'text' => $model->data['text']
      ]
    ];
  }

  return [
    'model' => $model->data,
    'cfg' => $cfg,
    'fs' => $fs->check()
  ];
}
