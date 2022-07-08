<?php


/*die(var_dump($model->data));
if ( !empty($model->data['path']) ){
  $success = false;
  $system = new \bbn\File\System();
  $info['size'] = \bbn\Str::saySize($system->filesize($model->data['path']));
  $info['mtime'] = \bbn\Date::format(filemtime($model->data['path']));
  $info['creation'] = \bbn\Date::format(filectime($model->data['path']));
  return [
    'info' => $info 
  ];
}*/
$img = $model->contentPath().'mails/img/logo-apst.jpg';
$max_width = 100;
$max_height = 200;
$i = new \bbn\File\Image($img);
$i->autoresize($max_width, $max_height);
//die();
$i->display();