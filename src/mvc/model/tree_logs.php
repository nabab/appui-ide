<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 11/12/17
 * Time: 16.09
 */


  $tree = [];

  $folder_log = BBN_DATA_PATH.'logs';

  if ( $model->inc->fs->is_dir($folder_log) ){
    $tree = [
      'folder' => $model->inc->fs->is_dir($folder_log),
      'file' => $model->inc->fs->is_file($folder_log),
      'nodePath' => $folder_log,
      'path' => [],
      'text' => basename($folder_log),
      'icon' => 'nf nf-custom-folder',
      'bcolor' => '#8d021f',
      'num' => 0,
      'items' =>[]
    ];

    $logs = $model->inc->fs->get_files($folder_log, false, false, null, 'ms');

    if ( !empty($logs) ){
      $tree['num'] = count($logs);
      foreach($logs as $log){
        if ( $model->inc->fs->is_file($log['name']) &&
         ((\bbn\str::file_ext($log['name'], 1)[1] === 'log') ||
          (\bbn\str::file_ext($log['name'], 1)[1] === 'json') ||
          (\bbn\str::file_ext($log['name'], 1)[1] === 'txt'))
        ){
          $ele = [
            'folder' => $model->inc->fs->is_dir($log['name']),
            'file' => $model->inc->fs->is_file($log['name']),
            'fileName' => basename($log['name']),
            'extension' =>  \bbn\str::file_ext($log['name'], 1)[1],
            'nodePath' => $folder_log.'/'. basename($log['name']),
            'size' => \bbn\str::say_size($log['size']),
            'text' => basename($log['name']),
            'icon' => 'nf nf-fa-file_text',
            'bcolor' => '#005668',
            'num' => 0,
            'mtime' => $log['mtime'],
            'title' => date("d-m-Y H:i:s", $log['mtime']),
           // 'path' => []
          ];
          $ele['path'][] = $ele;
          $tree['items'][]= $ele;
        }
      };
    }
  }
  return [
    'data' => [$tree]
  ];