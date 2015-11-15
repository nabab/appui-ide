<?php
/* @var $this \bbn\mvc */
//die(\bbn\file\dir::get_files(BBN_LOG_PATH));
$log_files = \bbn\tools::merge_arrays(
  \bbn\file\dir::get_files(BBN_LOG_PATH),
  \bbn\file\dir::get_files(BBN_DATA_PATH.'logs')
);
$res = [];
foreach ( $log_files as $lf ){
  $res[basename($lf)] = $lf;
}
ksort($res);
if ( isset($this->data['log']) ){
  $output = [];
  if ( $this->data['clear'] ){
    file_put_contents($res[$this->data['log']], '');
  }
  else{
    $file = escapeshellarg($res[$this->data['log']]); // for the security concious (should be everyone!)
    $num_lines = isset($this->data['num_lines']) && \bbn\str\text::is_integer($this->data['num_lines']) && ($this->data['num_lines'] > 0) && ($this->data['num_lines'] <= 1000) ? $this->data['num_lines'] : 100;
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
?>