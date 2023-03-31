<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use Exception;
use bbn\Appui\Project;
/** @var $model \bbn\Mvc\Model*/

if ($model->hasData('id_project')) {
  $project = new Project($model->db, $model->data['id_project']);
  $file = $project->urlToReal($model->data['url']);
  if (!empty($file)) {
    $ext = Str::fileExt($file);
    $content = file_get_contents($file);
  }
  else {
    $cfg = $project->urlToConfig($model->data['url']);
    $type = array_pop(X::split($model->data['url'], '/'));
    $row = X::getRow($cfg['typology']['tabs'], ['url' => $type]);
    $ext = $row['extensions'][0]['ext'];
    $content = $row['extensions'][0]['default'];
  }
  $title = basename($model->data['url']);
  return [
    "content" => $content,
    "ext" => $ext,
    "title" => $title,
    "url" => $model->data['url'],
    "id_project" => $model->data['id_project'],
  ];
}