<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\File\System;
use bbn\Appui\Project;
/** @var $model \bbn\Mvc\Model*/


if ($model->hasData(['url']['id_project'])) {
  $delete = false;
  $project = new Project($model->db, $model->data['id_project']);
  $fs = new System();
  $file = $project->urlToReal($model->data['url']);
  
  if (!empty($file)) {
    if (empty($model->data['content'])) {
      $fs->delete($file);
      $delete = true;
    }
    else {
      $fs->putContents($file, $model->data['content']);
    }
  } else {
    $cfg = $project->urlToConfig($model->data['url']);
    $file = $cfg['file'].'.'.$cfg['extensions'][0]['ext'];
    $fs->putContents($file, $model->data['content']);
  }
  if (!$fs->exists($model->dataPath('appui-newide') . '/backup')) {
    $fs->createPath($model->dataPath('appui-newide') . '/backup');
  } 
  return [
    'file' => basename($file),
    'content' => $model->data['content'],
    'delete' => $delete,
    'success' => true
  ];
}