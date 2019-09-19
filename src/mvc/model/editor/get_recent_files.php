<?php
$res['success'] = false;
$arr = [];
$files = $model->inc->ide->get_recent_files();
if ( !empty($files) ){
  foreach( $files as $file ){
    $res['files'][] = [
      'file' => $file['file'],
      'path' => $file['repository'].$file['file'] 
    ];    
  }
  if ( !empty($res['files']) ){
    $res['success'] = true;
  }  
}
return $res;