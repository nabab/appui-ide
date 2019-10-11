<?php

$folderCache = $model->cache_path();
$fullPath = $folderCache;

if ( !empty($model->data['path']) ){
  $fullPath .= $model->data['path'];
}


/*if ( !empty($model->data['cache']) && \bbn\str::check_path($model->data['path']) ){
  return [json_encode(unserialize(file_get_contents($folderCache.$model->data['cache'])))];
}*/

if ( !empty($model->data['cache'])  && \bbn\str::check_path($folderCache.$model->data['cache'])){  
  return [json_encode(unserialize(file_get_contents($folderCache.$model->data['cache'])))];
}



//case click button for delte all cache
else if( !empty($model->data['deleteAll']) ){
  if ( \bbn\file\dir::delete($folderCache, false) ){
    return [
      'success' => true
    ];
  }
  else{
    return [
      'success' => false
    ];
  }
}
//case delete a cache or file or folder in tree
else if ( !empty($model->data['deleteCache']) && \bbn\str::check_path($model->data['deleteCache']) ){  
  $ele = $folderCache.$model->data['deleteCache'];
  if ( \bbn\file\dir::delete($ele, $model->data['deleteContent'] ) ){
    return [
      'success' => true
    ];
  }
  else{
    return [
      'success' => false
    ];
  }
}//in this block retur tha data of all cache for tree
else{
  $content = \bbn\file\dir::get_files($fullPath, true);  
  $cache = \bbn\cache::get_engine();
  $all = [];
  if ( !empty($content) ){
    foreach($content as $i => $path){
      $arr = explode("/", $path);
      $element = $arr[count($arr)-1];      
      array_push($all, [
        'text' => $element,
        'path' =>  substr($path, strlen($folderCache)),        
        'items'=> [],
        'num' => is_dir($path) ? count(\bbn\file\dir::get_files($path, true)) : 0,
        'folder' => is_dir($path)
      ]);
    }
  }
  return $all;
}
