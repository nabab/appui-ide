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

// example of src : lib/appui-ide/mvc/editor/actions/rename
// example of dest : lib/appui-ide/mvc
// example of name : Hello_world

if ($model->hasData(['url_src', 'url_dest', 'id_project', 'data_src', 'data_dest'])) {
  $project = new Project($model->db, $model->data['id_project']);
  $fs = new System();
  $cfg_src = $project->urlToConfig($model->data['url_src']);
  $cfg_dest = $project->urlToConfig($model->data['url_dest']);
  $res = [];
  $arr_path_src = X::split($cfg_src['file'], '/');
  $file_src = array_pop($arr_path_src);
  $path_src = X::join($arr_path_src, '/');
  $arr_path_dest = X::split($cfg_dest['file'], '/');
  $file_dest = array_pop($arr_path_dest);
  $path_dest = X::join($arr_path_dest, '/');
  $res = [];
  $res[] = [
    $path_src,
    $path_dest
  ];
  if ($cfg_src['typology'] && $cfg_src['typology']['code'] === 'mvc') {
    if ($model->data['data_src']['folder']) {
      foreach($cfg_src['typology']['tabs'] as $tab) {
        $check_src = str_replace($model->data['data_src']['uid'], "", $cfg_src['file']);
        $check_src = $check . '/' .  $tab['path'] . $model->data['data_src']['uid'];
        $check_dest = str_replace($model->data['data_dest']['uid'], "", $cfg_src['file']);
        $check_dest = $check . '/' .  $tab['path'] . $model->data['data_dest']['uid'];
        $check_dest = str_replace('//', '/', $check_dest);
        $check_src = str_replace('//', '/', $check_src);
        if ($fs->isDir($path_src . $check_src)) {
          return [
            'success' => $fs->move($path_src . $check_src, $path_dest . $check_dest)
          ];
        }
      }
    } else {
      foreach($cfg_src['typology']['tabs'] as $tab) {
        foreach($tab['extensions'] as $extension) {
          $check_src = str_replace($model->data['data_src']['uid'], "", $cfg_src['file']);
          $check_dest = str_replace($model->data['data_dest']['uid'], "", $cfg_dest['file']);


          if (!empty($tab['fixed'])) {
            continue;
            $check_src = $check . $tab['path'] . str_replace($model->data['data_src']['name'], "", $model->data['data_src']['uid']) . $tab['fixed'];
            $check_dest = $check . $tab['path'] . str_replace($model->data['data_dest']['name'], "", $model->data['data_dest']['uid']) . $tab['fixed'];
          } else {
            $check_src = $check_src .'/'. $tab['path'] . $model->data['data_src']['uid'] . '.' . $extension['ext'];
            $check_dest = $check_dest .'/'. $tab['path'] . $model->data['data_dest']['uid'];
          }
          $check_dest = str_replace('//', '/', $check_dest);
          $check_src = str_replace('//', '/', $check_src);
          $res[] = [
            $check_src,
            $check_dest
          ];
          if ($fs->isFile($check_src)) {
            $fs->move($check_src, $check_dest);
          }
        }
      }
    }
  } else {
    if ($model->data['data_src']['folder']) {
      if ($fs->isDir($cfg_src['file'])) {
        $fs->move($cfg_src['file'], $cfg_dest['file']);
      }
    } else {

      foreach($cfg_src['typology']['tabs'] as $tab) {
        foreach($tab['extensions'] as $extension) {
          if ($model->data['data_src']['isComponent']) {
            $check_src = $cfg_src['file'] . '/' . $model->data['data_src']['name'] . '.' .  $extension['ext'];
            $check_dest = $cfg_dest['file'];
          }
          $check_src = $path_src.'/'.$file_src.'.'.$extension['ext'];
          $check_dest = $cfg_dest['file'];
          $check_src = str_replace('//', '/', $check_src);
          $check_dest = str_replace('//', '/', $check_dest);
          if ($fs->isFile($check_src)) {
            $fs->move($check_src, $check_dest);
          }
        }
      }
    }
  }
  return [
    'success'=> true,
    'test' => $res
  ];
}
