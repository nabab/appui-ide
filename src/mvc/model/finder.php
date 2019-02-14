<?php
if ( isset($model->data['path']) && (strpos($model->data['path'], '../') === false) ){
  if ( isset($model->data['host'], $model->data['user'], $model->data['pass']) ){
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
    $fs->cd(BBN_DATA_PATH.$model->data['path']);
    //die(var_dump('fdfda',$fs->get_current(), getcwd())); 
  }
  $finder = new \appui\finder($fs);
 // die(var_dump('dfa',$finder->get_data()));
  return [
    'path' => $model->data['path'],
    'current' => $fs->get_current(),
    'data' => $finder->get_data(),
    'info_dir' => $finder->get_info_dir()
  ];
}
else{
  return [
    'origin' => BBN_DATA_PATH,
    'root' => $model->plugin_url('appui-ide').'/',
    'pass' => base64_decode('YlRhb0wzQmo0TnBrVnA3aw==')
  ];
}