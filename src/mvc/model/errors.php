<?php
/** @var $model \bbn\mvc\model */
$file = BBN_DATA_PATH.'logs/_php_error.json';
if ( is_file($file) ){
  // Cache name
  $ln = 'bbn-ide-error_log-';
  if ( !($res = json_decode(file_get_contents($file), 1)) ){
    $res = [];
  }
  return [
    'total' => count($res),
    'data' => $res
  ];
}
return [
  'total' => 0,
  'data' => []
];