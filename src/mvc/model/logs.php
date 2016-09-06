<?php
/** @var $model \bbn\mvc\model */
//die(\bbn\file\dir::get_files(BBN_LOG_PATH));
$log_files = array_filter(\bbn\file\dir::get_files(BBN_DATA_PATH.'logs'), function($a){
  return substr($a, -3) === 'log';
});
if ( ($log_file = ini_get('error_log')) && (strpos($log_file, BBN_DATA_PATH.'logs') === false) ){
  array_unshift($log_files, $log_file);
}
$res = [];
foreach ( $log_files as $lf ){
  $res[basename($lf)] = $lf;
}
ksort($res);
if ( isset($model->data['log']) ){
  $output = [];
  if ( $model->data['clear'] ){
    file_put_contents($res[$model->data['log']], '');
  }
  else{
    $file = escapeshellarg($res[$model->data['log']]); // for the security concious (should be everyone!)
    $num_lines = isset($model->data['num_lines']) && \bbn\str::is_integer($model->data['num_lines']) && ($model->data['num_lines'] > 0) && ($model->data['num_lines'] <= 1000) ? $model->data['num_lines'] : 100;
    $line = "tail -n $num_lines $file";
    exec($line, $output);
    $res = [];
    $pid = 0;
  }
  return ['content' => implode("\n", $output)];
}
else{
  $data = ['logs' => []];
  foreach ( $res as $k => $v ){
    array_push($data['logs'], ['text' => $k]);
  }
  return $data;
}