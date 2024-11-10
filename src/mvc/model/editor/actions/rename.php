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

// example of url : lib/appui-ide/mvc/editor/actions/rename

if ($model->hasData(['url', 'name', 'id_project'])) {
  $project = new Project($model->db, $model->data['id_project']);
  $fs = new System();
  $cfg = $project->urlToConfig($model->data['url']);
  $arr_path = X::split($cfg['file'], '/');
  $file = array_pop($arr_path);
  $path = X::join($arr_path, '/');
  $res = [];
  if ($cfg['typology'] && $cfg['typology']['code'] === 'mvc') {
    if ($model->data['data']['folder']) {
      foreach($cfg['typology']['tabs'] as $tab) {
        $check = str_replace($model->data['data']['uid'], "", $cfg['file']);
        $check = $check . '/' .  $tab['path'] . $model->data['data']['name'];
        if ($fs->isDir($check)) {
          $fs->rename($check, $model->data['name']);
        }
      }
    } else {
      foreach($cfg['typology']['tabs'] as $tab) {
        foreach($tab['extensions'] as $extension) {
          $check = str_replace($model->data['data']['uid'], "", $cfg['file']);

          if (!empty($tab['fixed'])) {
            continue;
            $check = $check . $tab['path'] . str_replace($model->data['data']['name'], "", $model->data['data']['uid']) . $tab['fixed'];

          } else {
            $check = $check .'/'. $tab['path'] . $model->data['data']['uid'] . '.' . $extension['ext'];
          }
          $check = str_replace('//', '/', $check);
          if ($fs->isFile($check)) {
						$fs->rename($check, $model->data['name'] . '.' . $extension['ext']);
          }
        }
      }
    }
  } else {
    if ($model->data['data']['folder'] && !$model->data['data']['is_vue']) {
      if ($fs->isDir($cfg['file'])) {
        $fs->rename($cfg['file'], $model->data['name']);
      }
    } else {
      foreach($cfg['typology']['tabs'] as $tab) {
        foreach($tab['extensions'] as $extension) {
          $check = $path.'/'.$file.'.'.$extension['ext'];
          if ($model->data['data']['is_vue']) {
            $check = $cfg['file'] . '/' . $model->data['data']['name'] . '.' .  $extension['ext'];
          }
          $check = str_replace('//', '/', $check);
          if ($fs->isFile($check)) {
            $res[] = $check;
            $fs->rename($check, $model->data['name'] . '.' . $extension['ext']);
          }
        }
      }
      if ($model->data['data']['folder'] && $model->data['data']['is_vue']) {
        if ($fs->isDir($cfg['file'])) {
          $fs->rename($cfg['file'], $model->data['name']);
        }
      }
    }

  }

  return [
    'files' => $res,
    'success' => true
  ];
}
