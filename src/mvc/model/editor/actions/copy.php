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

// example of src : lib/appui-newide/mvc/editor/actions/rename
// example of dest : lib/appui-newide/mvc
// example of name : Hello_world

if ($model->hasData(['src', 'dest', 'name', 'id_project'])) {
  $project = new Project($model->db, $model->data['id_project']);
  $fs = new System();
  $cfg_src = $project->urlToConfig($model->data['src']);
  $cfg_dest = $project->urlToConfig($model->data['dest'], true);
  $arr_path = X::split($cfg_src['file'], '/');
  $file = array_pop($arr_path);
  $path = X::join($arr_path, '/');
  foreach($cfg_src['typology']['tabs'] as $tab) {
    foreach($tab['extensions'] as $extension) {
      $check = $path.'/'.$tab['path'].$file.'.'.$extension['ext'];
      $dest = $cfg_dest['root'].$cfg_dest['path'].$cfg_dest['info']['alias']['sourcePath'].$cfg_dest['typology']['code'].'/'.$tab['path'].$model->data['name'].'.'.$extension['ext'];
      if ($fs->isFile($check)) {
        $data = $fs->copy($check, $dest);
      }
    }
  }
  return [
    'success' => true,
    'data' => $data
  ];
}
