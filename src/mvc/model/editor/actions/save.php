<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\File\System;
use bbn\Appui\Project;
/** @var bbn\Mvc\Model $model */

if ($model->hasData(['url', 'id_project'])) {
  $delete = false;
  $project = new Project($model->db, $model->data['id_project']);
  $fs = new System();
  $file = $project->urlToReal($model->data['url']);
  if (!$fs->isDir(dirname($file))) {
    $fs->createPath(dirname($file));
  }

  $success = false;
  if (!empty($file)) {
    if (empty($model->data['content'])) {
      $success = $fs->delete($file);
      $delete = true;
    }
    else {
      $success  = $fs->putContents($file, $model->data['content']);
    }
  } else {
    $cfg = $project->urlToConfig($model->data['url']);
    $file = $cfg['file'].'.'.$cfg['extensions'][0]['ext'];
    $fs->putContents($file, $model->data['content']);
  }
  if (!$fs->exists($model->dataPath('appui-ide') . 'backup/' . $model->data['id_project'] . '/' . $model->data['url'])) {
    $fs->createPath($model->dataPath('appui-ide') . 'backup/'  . $model->data['id_project'] . '/'. $model->data['url']);
  } else {
    $fs->putContents($model->dataPath('appui-ide') . 'backup/'  . $model->data['id_project'] . '/'. $model->data['url'] . '/' . time() . '.' . pathinfo($file)['extension'], $model->data['content']);
  }
  
  
  return [
    'success' => $success,
    'file' => basename($file),
    'content' => $model->data['content'],
    'delete' => $delete,
    'success' => true
  ];
}
