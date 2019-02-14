<?php
$success = false;
$info = [];
if ( !empty($model->data['origin']) && !empty($model->data['node'])){
  $path = $model->data['origin'].$model->data['path'].$model->data['node']['value'];
  $system = new \bbn\file\system($path);
  $finder = new \appui\finder($system);
  $info = $finder->get_info($path, $model->data['ext']);
  $success = !empty($info);
}

return [
  'success' => $success,
  'info' => $info
];