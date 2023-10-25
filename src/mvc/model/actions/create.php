<?php

use bbn\X;
use bbn\Appui\Project;
use bbn\File\System;

if ($model->hasData(['repository', 'path', 'name', 'type', 'id_project', 'is_file'])) {
  $count = 1;
  $url = $model->data['repository']['name'] . '/' . ($model->data['type'] === 'classes' ? 'lib' : $model->data['type'])  . ($model->data['path'] !== '/' ? '/' : '') . '/';

  $project = new Project($model->db, $model->data['id_project']);
  $fs = new System();
  $cfg = $project->urlToConfig($url);

  $path = $cfg['file'];

  $exist = false;



  if ($model->data['type'] === 'mvc') {
    //check if file exist
    if (!$model->hasData('tab') || !isset($cfg['typology']['tabs'][$model->data['tab']])) {
      return [
        'success' => false,
        'error' => X::_('Tab not found')
      ];
    }

    $tab = $cfg['typology']['tabs'][$model->data['tab']];
    foreach($tab['extensions'] as $ext) {
      $file_path = "";
      if ($model->data['is_file']) {
        $file_path = $path . $tab['path'] . ($model->data['path'] !== "/" ? $model->data['path'] : '') . $model->data['name'] . '.' . $ext['ext'];
        $file_path = str_replace('//', '/', $file_path);
      } else {
        $file_path = $path . $tab['path'] . ($model->data['path'] !== "/" ? $model->data['path'] : '') . $model->data['name'];
        $file_path = str_replace('//', '/', $file_path);
      }
      if ($fs->exists($file_path) && $model->data['is_file']) {
        $exist = true;
        break;
      } else if ($fs->isDir($file_path) && !$model->data['is_file']){
        $exist = true;
        break;
      }
    }

    if ($exist) {
      return [
        'file' => $file_path,
        'success' => "false",
        'error' => 'already exist'
      ];
    }



    if ($model->data['is_file']) {
      // create file
      if ($model->hasData('extension')) {
        $ext = X::getRow($tab['extensions'], ['ext' => $model->data['extension']]);
        if (!$ext) {
          return [
            'success' => false,
            'error' => X::_('Extension not found')
          ];
        }
      }
      else {
        $ext = $tab['extensions'][0];
      }

      $file_path = $path . $tab['path'] . ($model->data['path'] !== "/" ? $model->data['path'] : '') . $model->data['name'] . '.' . $ext['ext'];
      $file_path = str_replace('//', '/', $file_path);
      X::ddump($file_path, $ext);

      if ($fs->putContents($file_path, $ext['default'])) {
        return [
          'success' => true,
        ];
      }
    } else {
      // create directory
      foreach($cfg['typology']['tabs'] as $tab) {
        $file_path = "";

        $file_path = $path . $tab['path'] . ($model->data['path'] !== "/" ? $model->data['path'] : '') . $model->data['name'];
        $file_path = str_replace('//', '/', $file_path);
        $fs->createPath($file_path);
      }
    }
  } else if ($model->data['type'] === 'components') {
    $path = $cfg['file'] . ($model->data['path'] != 'components/' ? str_replace('components/', '', $model->data['path'], $count) : '') . $model->data['name'];
    $path = str_replace('//', '/', $path);
    if ($fs->exists($path) && !$model->data['is_file']) {
      return [
        'success' => false,
        'error' => 'already exist'
      ];
    } else {
      $fs->createPath($path);
    }

    if ($model->data['is_file']) {
      foreach($cfg['typology']['tabs'] as $tab) {
        $path = $path . '/' . $model->data['name'] . '.' . $tab['extensions'][0]['ext'];
        $path = str_replace('//', '/', $path);
        $fs->putContents($path, $tab['extensions'][0]['default']);
      }
    }
    return [
      'success' => true,
    ];
  } else if ($model->data['type'] === 'cli') {
    if ($model->data['is_file']) {

      foreach($cfg['typology']['tabs'] as $tab) {
        $path = $path . '/' . ($model->data['path'] != 'cli/' ? str_replace('/cli/', '', $model->data['path'], $count) : '') . $model->data['name'] . '.' . $tab['extensions'][0]['ext'];
        $path = str_replace('//', '/', $path);
        $fs->putContents($path, $tab['extensions'][0]['default']);
      }
    } else {
      if ($fs->exists($cfg['file'] . $model->data['name'])) {
        return [
          'success' => false,
          'error' => 'already exist'
        ];
      }

      $fs->createPath($cfg['file'] . $model->data['name']);
      return [
        'success' => true,
      ];
    }

  } else if ($model->data['type'] === 'classes') {
    
    if ($model->data['is_file']) {

      foreach($cfg['typology']['tabs'] as $tab) {
        $path = $path . '/' . ($model->data['path'] != 'lib/' ? str_replace('lib/', '', $model->data['path'], $count) : '') . $model->data['name'] . '.' . $tab['extensions'][0]['ext'];
        $path = str_replace('//', '/', $path);
        X::ddump($path);
        $fs->putContents($path, $tab['extensions'][0]['default']);
      }
    } else {
      if ($fs->exists($cfg['file'] . $model->data['name'])) {
        return [
          'success' => false,
          'error' => 'already exist'
        ];
      }

      $fs->createPath($cfg['file'] . $model->data['name']);
      return [
        'success' => true,
      ];
    }

  }

  X::ddump($cfg);
}

return [
  'success' => false,
  'error' =>  _('Impossible to create the element')
];
