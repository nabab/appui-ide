<?php

use bbn\X;
use bbn\Appui\Passwords;
use bbn\File\System;
//X::ddump($model->inc->pref->get($model->data['origin']));

if (
  isset($model->data['path'], $model->data['origin']) &&
  (strpos($model->data['path'], '../') === false) &&
  ($p = $model->inc->pref->get($model->data['origin']))
){
  $fields = ['path', 'host', 'user', 'type'];
  $cfg = [];
  foreach ( $fields as $f ){
    if ( isset($p[$f]) ){
      $cfg[$f] = $p[$f];
    }
  }

  if ($cfg['type'] !== 'local') {
    $pwd = new Passwords($model->db);
    $cfg['pass'] = $pwd->userGet($p['id'], $model->inc->user);
  }

  $fs = new System($cfg['type'], $cfg);
  if ( !empty($cfg['path']) ){
    $fs->cd($cfg['path']);
  }

  $finder = new \appui\finder($fs);
  $path = $model->data['path'] ?: '.';
  $res = $finder->explore($path, $model->hasData('mode') && ($model->data['mode'] === 'dir') ? true : false);
  $cur = $fs->getCurrent();
  $res['current'] = $cur;
  return $res;
}
else{
  $conn = $model->inc->pref->getAll($model->inc->options->fromCode('sources', 'finder', 'appui'));
  $connection = isset($conn[0], $conn[0]['value']) ? $conn[0]['value'] : '';
  $fav = $model->inc->pref->textValue($model->inc->options->fromCode('favourites', 'finder', 'appui'));
  return [
    //id doesn't exist
    //'connection' => $conn[0]['id'],
    'connection' => $connection,
    'connections' => $conn,
    'favourites' => $fav,
    'origin' => $model->dataPath(),
    'root' => $model->pluginUrl('appui-ide').'/',
    'pass' => base64_decode('YlRhb0wzQmo0TnBrVnA3aw=='),
  ];
}