<?php
/**
 * @var bbn\Mvc\Model $model
 */

$success = false;
$info = [];
$pwuidOwner = null;
$groupOwner = null;

if ($model->hasData(['origin', 'node'], true) && isset($model->inc->finderfs) && $model->inc->finderfs->check()) {
  $tmp_file = $model->userTmpPath().$model->data['node']['value'];
  $content = $model->inc->finderfs->getContents($model->data['path'].$model->data['node']['value']);
  $model->inc->fs->putContents($tmp_file, $content);
  $finder = new \appui\finder($model->inc->fs);
  $info = $finder->get_info($tmp_file, $model->data['ext']);
  $model->inc->fs->delete($tmp_file);
  $success = !empty($info);

  try {
    $fileOwner = @fileowner($model->data['path'].$model->data['node']['value']);
    if ($pwuidOwner = posix_getpwuid($fileOwner)) {
      $groupOwner = posix_getgrgid($pwuidOwner['gid']);
    }
  }
  catch (\Exception $e) {
  }
}

return [
  'success' => $success,
  'name' => $model->data['node']['value'],
  'info' => $info,
  'owner' => $pwuidOwner,
  'groupOwner' => $groupOwner,
];