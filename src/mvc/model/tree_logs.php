<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 11/12/17
 * Time: 16.09
 */

use bbn\Str;
use bbn\File\System;

$tree       = [];
$success    = false;
$folder_log = BBN_DATA_PATH.'logs';
$fs = new System();
if ($fs->isDir($folder_log)) {
  $logs = $fs->getFiles($folder_log, false, false, null, 'ms');
  $tree = [
    'folder' => true,
    'file' => false,
    'nodePath' => $folder_log,
    'path' => [],
    'text' => basename($folder_log),
    'icon' => 'nf nf-custom-folder',
    'bcolor' => '#8d021f',
    'num' => 0,
    'items' => []
  ];
  if (!empty($logs)) {
    $success           = true;
    $allowedExtensions = ['log', 'json', 'txt'];
    $tree['num'] = count($logs);
    foreach($logs as $log) {
      if ($fs->isFile($log['name']) && in_array(Str::fileExt($log['name'], 1)[1], $allowedExtensions)) {
        $ele = [
          'folder' => $fs->isDir($log['name']),
          'file' => $fs->isFile($log['name']),
          'fileName' => basename($log['name']),
          'extension' =>  \bbn\Str::fileExt($log['name'], 1)[1],
          'nodePath' => $folder_log.'/'. basename($log['name']),
          'size' => $log['size'],
          'text' => basename($log['name']),
          'icon' => 'nf nf-fa-file_text',
          'bcolor' => '#005668',
          'num' => 0,
          'mtime' => $log['mtime'],
          'title' => date("d-m-Y H:i:s", $log['mtime']),
          'path' => []
        ];

        $ele['path'][] = $ele;
        $tree['items'][]= $ele;
      }
    }
  }

  $tree = [$tree];
}

return [
  'data' => $tree
];
