<?php
$success = false;
$info = [];

if ( !empty($model->data['origin']) && !empty($model->data['node']) && isset($model->inc->finderfs) && $model->inc->finderfs->check() ){
  $tmp_file = $model->userTmpPath().$model->data['node']['value'];
  $content = $model->inc->finderfs->getContents($model->data['path'].$model->data['node']['value']);
  $model->inc->fs->putContents($tmp_file, $content);
  $finder = new \appui\finder($model->inc->fs);
  $info = $finder->get_info($tmp_file, $model->data['ext']);
  $model->inc->fs->delete($tmp_file);
  $success = !empty($info);
  $fileOwner = fileowner($model->data['path'].$model->data['node']['value']);
  $pwuidOwner = posix_getpwuid($fileOwner);

}

return [
  'success' => $success,
  'info' => $info,
  'owner' => $pwuidOwner,
  'groupOwner' => posix_getgrgid($pwuidOwner['gid']),
];