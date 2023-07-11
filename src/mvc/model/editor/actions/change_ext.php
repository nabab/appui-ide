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

if ($model->hasData(['url', 'ext', 'id_project'])) {
  $fs = new System();
  $project = new Project($model->db, $model->data['id_project']);
  $file = $project->urlToReal($model->data['url']);
  $new_path = X::split($file, '/');
  $new_file = X::split(array_pop($new_path), '.');
  array_pop($new_file);
  array_push($new_file, $model->data['ext']);
  $new_file = X::join($new_file, '.');
  return [
    'data' => $fs->rename($file, $new_file),
    'success' => true
  ];
}