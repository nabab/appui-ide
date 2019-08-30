<?php


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
  $fs = new \bbn\file\system($p['type'], $cfg);
  if ( !empty($cfg['path']) ){
    $fs->cd($cfg['path']);
  }

  /*
  if ( 0 ){
    $fs = new \bbn\file\system('ssh', [
      'host' => '62.210.93.6',
      'user' => 'nabab',
      'private' => BBN_DATA_PATH.'test/cert10_rsa',
      'public' => BBN_DATA_PATH.'test/cert10_rsa.pub'
    ]);
    if ( !empty($model->data['path']) ){
      $fs->cd($fs->get_current().'/'.$model->data['path']);
    }
  }
  else if ( isset($model->data['host'], $model->data['user'], $model->data['pass']) ){
    
    $fs = new \bbn\file\system('ftp', [
      'host' => $model->data['host'],
      'user' => $model->data['user'],
      'pass' => $model->data['pass']
    ]);
    
    if ( $model->data['test'] ){
      return ['success' => $fs->check()];
    }
    if ( !empty($model->data['path']) ){
      $fs->cd($fs->get_current().'/'.$model->data['path']);
    }
  }
  else{
    $fs = new \bbn\file\system();
    $fs->cd(BBN_DATA_PATH);//.'users/'.$model->inc->user->get_id());
  }
  /*
  $fs = new \bbn\file\system('nextcloud', [
    'path' => $model->data['path'],
    'host' => 'cloud.bbn.so',
    'user' => 'bbn',
    'pass' => 'bbnsolutionstest'
  ]);
  */
  $finder = new \appui\finder($fs);
  $res = $finder->explore($model->data['path']);
  $cur = $fs->get_current();
  $res['current'] = $cur;
  return $res;
}
else{
  $conn = $model->inc->pref->text_value($model->inc->options->from_code('sources', 'finder', 'appui'));
  $fav = $model->inc->pref->text_value($model->inc->options->from_code('favourites', 'finder', 'appui'));
  return [
    'connection' => $conn[0]['id'],
    'connections' => $conn,
    'favourites' => $fav,
    'origin' => BBN_DATA_PATH,
    'root' => $model->plugin_url('appui-ide').'/',
    'pass' => base64_decode('YlRhb0wzQmo0TnBrVnA3aw=='),
  ];
}