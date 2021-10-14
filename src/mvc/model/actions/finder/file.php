<?php
$success = false;
$info = [];

if ( !empty($model->data['origin']) && !empty($model->data['node']) && isset($model->inc->finderfs) && $model->inc->finderfs->check() ){
  $finder = new \appui\finder($model->inc->finderfs);
  $info = $finder->get_info($model->data['path'].$model->data['node']['value'], $model->data['ext']);
  $success = !empty($info);
}

return [
  'success' => $success,
  'info' => $info
];