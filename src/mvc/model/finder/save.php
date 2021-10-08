<?php
/**
     * What is my purpose?
     *
     **/

/** @var $model \bbn\Mvc\Model*/

if ($model->hasData(['host', 'user', 'pass', 'text'], true)) {
  
  $fs = new \bbn\File\System('ssh', [
    'path' => $model->data['path'] ?? '.',
    'host' => $model->data['host'],
    'user' => $model->data['user'],
    'pass' => $model->data['pass']
  ]);
  
  if ($fs->check()) {
    
    $idOption = $model->inc->options->fromCode('sources', 'finder', 'appui');
    
    $id = $model->inc->pref->addToGroup($idOption, [
      'path' => $model->data['path'] ?? '.',
      'host' => $model->data['host'],
      'user' => $model->data['user'],
      'text' => $model->data['text']
    ]);
    
    $pwd = new bbn\Appui\Passwords($model->db);

    
    return [
      'success' => $pwd->userStore($model->data['pass'], $id, $model->inc->user),
      'data' => [
        'value' => $id,
        'text' => $model->data['text']
      ]
    ];
  }
}