<?php


if ( isset($model->data['path']) && (strpos($model->data['path'], '../') === false)){
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
  $cur = $fs->get_current();
  //die(var_dump($finder->get_data($model->data['path'])));
  return [
    'path' => $model->data['path'],
    'current' => $cur,
    'data' => $finder->get_data($model->data['path'] ?: '.'),
    'info_dir' => $finder->get_info_dir($model->data['path'] ?: '.')
  ];
}
else{
  return [
    'origin' => BBN_DATA_PATH.'users/',
    'root' => $model->plugin_url('appui-ide').'/',
    'pass' => base64_decode('YlRhb0wzQmo0TnBrVnA3aw=='),
  ];
}