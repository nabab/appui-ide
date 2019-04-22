<?php
$success = false;
$size = false;
 
if ( isset($model->data['origin']) && isset($model->data['path'])){
  
  $path = $model->data['origin'].$model->data['path'];
  
  $system = new \bbn\file\system2('nextcloud',  [
    'path' => $path,
    'host' => 'cloud.bbn.so',
    'user' => 'bbn',
    'pass' => 'bbnsolutionstest'
  ]);
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