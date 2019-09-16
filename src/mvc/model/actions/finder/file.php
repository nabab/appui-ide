<?php
$success = false;
$info = [];
if ( !empty($model->data['origin']) && !empty($model->data['node']) && isset($model->inc->fs) && $model->inc->fs->check() ){
  $finder = new \appui\finder($model->inc->fs);
  
  $info = $finder->get_info($model->data['path'].$model->data['node']['value'], $model->data['ext']);
  $success = !empty($info);
}

return [
  'success' => $success,
  'info' => $info
];