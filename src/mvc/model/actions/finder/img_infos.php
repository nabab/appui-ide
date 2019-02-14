<?php


/*die(var_dump($model->data));
if ( !empty($model->data['path']) ){
  $success = false;
  $system = new \bbn\file\system();
  $info['size'] = \bbn\str::say_size($system->filesize($model->data['path']));
  $info['mtime'] = \bbn\date::format(filemtime($model->data['path']));
  $info['creation'] = \bbn\date::format(filectime($model->data['path']));
  return [
    'info' => $info 
  ];
}*/
$img = BBN_DATA_PATH.'mails/img/logo-apst.jpg';
$max_width = 100;
$max_height = 200;
$i = new \bbn\file\image($img);
$i->autoresize($max_width, $max_height);
//die();
$i->display();