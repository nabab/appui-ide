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

// example of url : lib/appui-newide/mvc/editor/actions/rename

if ($model->hasData(['url', 'id_project'])) {
  $project = new Project($model->db, $model->data['id_project']);
  $fs = new System();
  $cfg = $project->urlToConfig($model->data['url']);
  $arr_path = X::split($cfg['file'], '/');
  $file = array_pop($arr_path);
  $path = X::join($arr_path, '/');
  foreach($cfg['typology']['tabs'] as $tab) {
    foreach($tab['extensions'] as $extension) {
      $check = $path.'/'.$tab['path'].$file.'.'.$extension['ext'];
      if ($fs->isFile($check)) {
        $fs->delete($check);
      }
    }
  }
  return [
    'success' => true
  ];
}