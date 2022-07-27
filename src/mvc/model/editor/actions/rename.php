<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\File\System;
/** @var $model \bbn\Mvc\Model*/

if ($model->hasData(['url']['name']['id_project'])) {
  $project = new luk\Project($model->db, $model->data['id_project']);
  $fs = new System();
  $file = $project->urlToReal($model->data['url']);
  X::ddump($model->data['url']);
  if (!empty($file)) {
    $fs->rename($file, $model->data['name']);
    return [
      'success' => true
    ];
  }
}
