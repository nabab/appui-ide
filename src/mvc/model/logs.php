<?php
/** @var $model \bbn\mvc\model */

$log_files = array_filter(\bbn\file\dir::get_files(BBN_DATA_PATH.'logs'), function($a){
  return substr($a, -4) !== '.old';
});
if ( ($log_file = ini_get('error_log')) && (strpos($log_file, BBN_DATA_PATH.'logs') === false) ){
  array_unshift($log_files, $log_file);
}
$res = [];
foreach ( $log_files as $lf ){
  $res[basename($lf)] = $lf;
}
ksort($res);

if( !empty($model->data['delete_file']) ){
  $path = BBN_DATA_PATH.'logs/'.$model->data['delete_file'];  
  if ( is_file($path) ){
    if ( !empty(\bbn\file\dir::delete($path)) ){
      return ['success' => true];
    }
  }  
}
else if ( !empty($res[$model->data['log']]) ){  
  $output = [];
  if ( $model->data['clear'] ){    
    file_put_contents($res[$model->data['log']], '');
  }
  else{

    $file = escapeshellarg($res[$model->data['log']]); // for the security concious (should be everyone!)
    $num_lines = isset($model->data['num_lines']) && \bbn\str::is_integer($model->data['num_lines']) && ($model->data['num_lines'] > 0) && ($model->data['num_lines'] <= 5000) ? $model->data['num_lines'] : 100;
    $line = "tail -n $num_lines $file";
    exec($line, $output);
    $res = [];
    $pid = 0;

  }

  return ['content' => implode("\n", $output)];

}
else {
  if( !empty($model->data['md5']) && !empty($model->data['fileLog']) ){
    $file = escapeshellarg($res[$model->data['fileLog']]); // for the security concious (should be everyone!)
    //for md5
    $output = [];
    $line = "tail -n 10 ".$file;
    exec($line, $output);
    //for content
    $output2=[];
    $num_lines = isset($model->data['num_lines']) && \bbn\str::is_integer($model->data['num_lines']) && ($model->data['num_lines'] > 0) && ($model->data['num_lines'] <= 5000) ? $model->data['num_lines'] : 100;
    $line2 = "tail -n $num_lines $file";
    exec($line2, $output2);

    if ( $model->data['md5'] === md5(implode("\n", $output)) ){
      return ['change' => false];
    }
    else{
      return [
        'change' => true,
        'md5' => md5(implode("\n", $output)),
        'content' => implode("\n", $output2)
      ];
    }
  }
  else{
    $data = ['logs' => []];
    foreach ( $res as $k => $v ){
      $output = [];
      $line = "tail -n 10 ".escapeshellarg($v);
      exec($line, $output);
      $res = [];
      array_push($data['logs'], [
        'text' => $k,
        'md5' => md5(implode("\n", $output))
      ]);
    }
    return $data;
  }
}