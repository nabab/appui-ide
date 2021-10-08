<?php

use bbn\X;

if (
  isset($model->data['path'], $model->data['origin']) &&
  (strpos($model->data['path'], '../') === false) &&
  ($p = $model->inc->pref->get($model->data['origin']))
){
  $fields = ['path', 'host', 'user', 'pass'];
  $cfg = [];
  foreach ( $fields as $f ){
    if ( isset($p[$f]) ){
      $cfg[$f] = $p[$f];
    }
  }
  $fs = new \bbn\File\System($p['type'], $cfg);
  if ( !empty($cfg['path']) ){
    $fs->cd($cfg['path']);
  }

  /*
  if ( 0 ){
    $fs = new \bbn\File\System('ssh', [
      'host' => '62.210.93.6',
      'user' => 'nabab',
      'private' => BBN_DATA_PATH.'test/cert10_rsa',
      'public' => BBN_DATA_PATH.'test/cert10_rsa.pub'
    ]);
    if ( !empty($model->data['path']) ){
      $fs->cd($fs->getCurrent().'/'.$model->data['path']);
    }
  }
  else if ( isset($model->data['host'], $model->data['user'], $model->data['pass']) ){
    
    $fs = new \bbn\File\System('ftp', [
      'host' => $model->data['host'],
      'user' => $model->data['user'],
      'pass' => $model->data['pass']
    ]);
    
    if ( $model->data['test'] ){
      return ['success' => $fs->check()];
    }
    if ( !empty($model->data['path']) ){
      $fs->cd($fs->getCurrent().'/'.$model->data['path']);
    }
  }
  else{
    $fs = new \bbn\File\System();
    $fs->cd(BBN_DATA_PATH);//.'users/'.$model->inc->user->getId());
  }
    $fs = new \bbn\File\System('nextcloud', [
    'path' => $model->data['path'] ?? '/',
    'host' => 'qr.dev.bbn.io',
    'user' => 'root',
    'pass' => 'B_QdU0/UfR2M1Apb'
  ]);
  */
  
  $finder = new \appui\finder($fs);
  $res = $finder->explore($model->data['path']);
  $cur = $fs->getCurrent();	
  $res['current'] = $cur;
  return $res;
}
else{
  $conn = $model->inc->pref->textValue($model->inc->options->fromCode('sources', 'finder', 'appui'));
  $connection = isset($conn[0], $conn[0]['value']) ? $conn[0]['value'] : '';
  $fav = $model->inc->pref->textValue($model->inc->options->fromCode('favourites', 'finder', 'appui'));
  return [
    //id doesn't exist
    //'connection' => $conn[0]['id'],
    'connection' => $connection,
    'connections' => $conn,
    'favourites' => $fav,
    'origin' => BBN_DATA_PATH,
    'root' => $model->pluginUrl('appui-ide').'/',
    'pass' => base64_decode('YlRhb0wzQmo0TnBrVnA3aw=='),
  ];
}