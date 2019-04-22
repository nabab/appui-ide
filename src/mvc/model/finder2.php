<?php


if ( isset($model->data['path']) && (strpos($model->data['path'], '../') === false)){
 
  if ( 0 ){
    $fs = new \bbn\file\system2('ssh', [
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
    $fs = new \bbn\file\system2('ftp', [
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
    $fs = new \bbn\file\system2();
    $fs->cd(BBN_DATA_PATH.$model->data['path']);
  }
  $fs = new \bbn\file\system2('nextcloud', [
    'path' => $model->data['path'],
    'host' => 'cloud.bbn.so',
    'user' => 'bbn',
    'pass' => 'bbnsolutionstest'
  ]);
  $finder = new \appui\finder($fs);
  return [
    'path' => $model->data['path'],
    'current' => $fs->get_current(),
    'data' => $finder->get_data($model->data['path']),
    'info_dir' => $finder->get_info_dir($model->data['path'])
  ];
}
else{
  return [
    'origin' => BBN_DATA_PATH,
    'root' => $model->plugin_url('appui-ide').'/',
    'pass' => base64_decode('YlRhb0wzQmo0TnBrVnA3aw=='),
  ];
}