<?php
use bbn\X;
use bbn\Str;
use bbn\Appui\Project;
use bbn\File\System;

/** @var bbn\Mvc\Model $model */

$isHistory = false;
if ($model->hasData('url', true)) {
  $bits = X::split($model->data['url'], '/');
  $type = array_pop($bits);
  $isHistory = array_pop($bits) === 'history';
}

if ($model->hasData('id_project')) {
  if (!$isHistory) {
    $project = new Project($model->db, $model->data['id_project']);
    $file = $project->urlToReal($model->data['url']);
    $config = $project->urlToConfig($model->data['url']);
    $model->inc->ide->setRecentFile($model->data['url']);

    if (!empty($file)) {
      $ext = Str::fileExt($file);
      $content = file_get_contents($file);
      $isEmpty = false;
    }
    else {
      $cfg = $project->urlToConfig($model->data['url']);
      $type = array_pop(X::split($model->data['url'], '/'));;
      $isEmpty = true;
      if ($type === 'code') {
        $ext = $cfg['typology']['extensions'][0]['ext'];
        $content =$cfg['typology']['extensions'][0]['default'];
      } else {
        $row = X::getRow($cfg['typology']['tabs'], ['url' => $type]);
        $ext = $row['extensions'][0]['ext'];
        $content = $row['extensions'][0]['default'];
      }
    }

    if ($type === 'html') {
      $ext = 'html';
    }
    $title = basename($model->data['url']);
    return [
      "isHistory" => false,
      "content" => $content,
      "ext" => $ext,
      "title" => $title,
      "url" => $model->data['url'],
      "id_project" => $model->data['id_project'],
      "isEmpty" => $isEmpty,
      "path" => $config['file']
    ];
  } else {
    $fs = new System();

    $files = $fs->getFiles($model->dataPath('appui-ide') . 'backup/' . $model->data['id_project'] . '/' . X::join($bytes, '/') . '/' .  $type);

    $files = array_reverse($files);
    $res = [];

    foreach ($files as $f) {
      $info = pathinfo($f);

      $filename = $info['filename']; // Replace with your actual filename
      $fileDate = new DateTime("@$filename");
      $currentDate = new DateTime();

      if ($fileDate->format('Y-m-d') == $currentDate->format('Y-m-d')) {
        // File was created today, so just get the hour
        $output = $fileDate->format('H:i:s');
      } else {
        // File was created on a different day, so get the date + hour
        $output = $fileDate->format('Y-m-d H:i:s');
      }

      $info['time'] = $output;

      $res[] = $info;
    }

    return [
      "isHistory" => true,
      "title" => 'History',
      'files' => $res,
      'path' => $model->dataPath('appui-ide') . 'backup/' . $model->data['id_project'] . '/' . X::join($bytes, '/') . '/' .  $type
    ];
  }
}