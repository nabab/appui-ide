<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 11/12/17
 * Time: 16.09
 */

  $tree = [];

  $folder_log = BBN_DATA_PATH.'logs';

  if ( is_dir($folder_log) ){
    $tree = [
      'folder' => is_dir($folder_log),
      'file' => is_file($folder_log),
      'path' => $folder_log,
      'text' => basename($folder_log),
      'icon' => 'nf nf-custom-folder',
      'bcolor' => '#8d021f',
      'num' => 0,
      'items' =>[]
    ];
    $fs = new \bbn\file\system();
    $logs = $fs->get_files($folder_log, false, false, null, 'ms');

    if ( !empty($logs) ){
      $tree['num'] = count($logs);
      foreach($logs as $log){
        if ( is_file($log['path']) && (\bbn\str::file_ext($log['path'], 1)[1] === 'log') ){
          $tree['items'][]= [
            'folder' => is_dir($log['path']),
            'file' => is_file($log['path']),
            'fileName' => basename($log['path']),
            'extension' =>  \bbn\str::file_ext($log['path'], 1)[1],
            'path' => $log['path'],
            'size' => \bbn\str::say_size($log['size']),
            'text' => basename($log['path']),
            'icon' => 'nf nf-fa-file_text',
            'bcolor' => '#005668',
            'num' => 0,
            'mtime' => $log['mtime']
          ];
        }
      };
    }
  }
  return [
    'data' => [$tree]
  ];
