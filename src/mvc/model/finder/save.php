<?php

if ($model->hasData(['text', 'type'], true)) {
  if (($model->data['type'] !== 'local')
    && ($model->data['type'] !== 'googledrive')
    && !$model->hasData(['host', 'user', 'pass'], true)
  ) {
    return [
      'success' => true,
      'test' => _('Incorrect arguments')
    ];
  }

  $fields = ['path', 'host', 'pass', 'user', 'type', 'text'];
  $cfg = [];
  foreach ( $fields as $f ){
    if (!empty($model->data[$f]) ){
      $cfg[$f] = $model->data[$f];
    }
  }

  $fs = new \bbn\File\System($model->data['type'], $cfg);
  if ($fs->check()
    && ($idOption = $model->inc->options->fromCode('sources', 'finder', 'appui'))
  ) {
    if (($cfg['type'] !== 'local')
      && !empty($cfg['pass'])
    ) {
      $pwd = new bbn\Appui\Passwords($model->db);
      if ($cfg['type'] === 'googledrive') {
        $pass = json_encode([
          'credentials' => $cfg['user'],
          'token' => $cfg['pass']
        ]);
        unset($cfg['user'], $cfg['pass']);
      }
      else {
        $pass = $cfg['pass'];
        unset($cfg['pass']);
      }
    }

    if ($id = $model->inc->pref->addToGroup($idOption, $cfg)) {
      return [
        'success' => isset($pwd) ? $pwd->userStore($pass, $id, $model->inc->user) : true,
        'data' => [
          'value' => $id,
          'text' => $model->data['text']
        ]
      ];
    }



  }

  return [
    'model' => $model->data,
    'cfg' => $cfg,
    'fs' => $fs->check()
  ];
}
