<?php
$success = false;
$info = [];

if ( !empty($model->data['origin']) && !empty($model->data['node'])){
  $path = $model->data['origin'].$model->data['path'].$model->data['node']['value'];
 
  //WE NEED A WAY TO SEND THE MODE 'NEXTCLOUD' OR OTHER FROM THE JS -- IN NEXTCLOUD MODE DON'T NEED OF $model->data['origin']
  
  $path = $model->data['path'].$model->data['node']['value'];
 
  $system = new \bbn\file\system2('nextcloud',  [
    'path' => $path,
    'host' => 'cloud.bbn.so',
    'user' => 'bbn',
    'pass' => 'bbnsolutionstest'
  ]);
  $finder = new \appui\finder($system);

  $info = $finder->get_info($path, $model->data['ext']);

  $success = !empty($info);
}

return [
  'success' => $success,
  'info' => $info
];