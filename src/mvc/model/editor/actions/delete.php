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

// example of url : lib/appui-ide/mvc/editor/actions/rename

if ($model->hasData(['url', 'id_project'])) {

  $count = 0;
  $project = new Project($model->db, $model->data['id_project']);
  $fs = new System();
  $cfg = $project->urlToConfig($model->data['url']);
  $arr_path = X::split($cfg['file'], '/');
  $file = array_pop($arr_path);
  $path = X::join($arr_path, '/');

  if ($cfg['typology'] && $cfg['typology']['code'] === 'mvc') {
    foreach($cfg['typology']['tabs'] as $tab) {
      if ($model->data['data']['folder']) {
        $check = str_replace($model->data['data']['uid'], "", $cfg['file']);
        $check = $check . '/' .  $tab['path'] . $model->data['data']['uid'];
        $check = str_replace('//', '/', $check);
        if ($fs->isDir($check)) {
          $fs->delete($check);
          $count++;
        }
      } else {
        foreach($tab['extensions'] as $extension) {
          $check = str_replace($model->data['data']['uid'], "", $cfg['file']);

          if (!empty($tab['fixed'])) {
            continue;
            $check = $check . '/' . $tab['path'] . str_replace($model->data['data']['name'], "", $model->data['data']['uid']) . $tab['fixed'];

          } else {
            $check = $check . '/' . $tab['path'] . $model->data['data']['uid'] . '.' . $extension['ext'];
          }
          $check = str_replace('//', '/', $check);
          if ($fs->isFile($check)) {
            $fs->delete($check);
            $count++;
          }
        }
      }
    }
  } else {
    if ($model->data['data']['folder']) {
      if ($fs->isDir($cfg['file'])) {
        $fs->delete($cfg['file']);
        $count++;
      }
    } else {
      foreach($cfg['typology']['tabs'] as $tab) {
        foreach($tab['extensions'] as $extension) {
          $check = $path.'/'.$file.'.'.$extension['ext'];
          $check = str_replace('//', '/', $check);
          if ($fs->isFile($check)) {
            $fs->delete($check);
            $count++;
          }
        }
      }
    }
  }
  return [
    'success' => $count > 0
  ];
}
