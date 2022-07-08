<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 11/12/17
 * Time: 16.09
 */


  $tree = [];

  $folder_log = BBN_DATA_PATH.'logs';

  if ( $model->inc->fs->isDir($folder_log) ){
    $tree = [
      'folder' => true,
      'file' => false,
      'nodePath' => $folder_log,
      'path' => [],
      'text' => basename($folder_log),
      'icon' => 'nf nf-custom-folder',
      'bcolor' => '#8d021f',
      'num' => 0,
      'items' =>[]
    ];

    $logs = $model->inc->fs->getFiles($folder_log, false, false, null, 'ms');

    if ( !empty($logs) ){
      $tree['num'] = count($logs);
      foreach($logs as $log){
        if ( $model->inc->fs->isFile($log['name']) &&
         ((\bbn\Str::fileExt($log['name'], 1)[1] === 'log') ||
          (\bbn\Str::fileExt($log['name'], 1)[1] === 'json') ||
          (\bbn\Str::fileExt($log['name'], 1)[1] === 'txt'))
        ){
          $ele = [
            'folder' => $model->inc->fs->isDir($log['name']),
            'file' => $model->inc->fs->isFile($log['name']),
            'fileName' => basename($log['name']),
            'extension' =>  \bbn\Str::fileExt($log['name'], 1)[1],
            'nodePath' => $folder_log.'/'. basename($log['name']),
            'size' => \bbn\Str::saySize($log['size']),
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