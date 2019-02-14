<?php
$success = false;
$size = false;
 
if ( !empty($model->data['origin']) && isset($model->data['path'])){
  $path = $model->data['origin'].$model->data['path'];
  $system = new \bbn\file\system($path);
  $finder = new \appui\finder($system);
  $size = $finder->dirsize($path);
  if ( isset($size) ){
    $success = true;
  };
}
return [
  'success' => $success,
  'size' => $size,
];