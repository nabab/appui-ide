<?php
$res['success'] = false;
$arr = [];
$files = $model->inc->ide->get_recent_files();
if ( ($files !== null) && is_array($files) && (count($files) > 0) ){
  foreach( $files as $file ){
    $res['files'][] = [
      'file' => $file['file'],
      'repository' => $file['repository'],
      'path' => $file['path'],
      'cfg' => $file['cfg'], 
      'type' => $file['type'] 
    ];    
  }
  if ( !empty($res['files']) ){
    $res['success'] = true;
  }  
}
return $res;