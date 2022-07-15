<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

if ($model->hasData('id_project')) {
  $project = new luk\Project($model->db, $model->data['id_project']);
  $file = $project->urlToReal($model->data['url']);
  X::ddump($file);
  $ext = Str::fileExt($file);
  $content = file_get_contents($file);
  $title = basename($model->data['url']);
  return [
    "content" => $content,
    "ext" => $ext,
    "title" => $title
  ];
}