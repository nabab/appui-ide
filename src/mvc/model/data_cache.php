<?php

$folderCache = $model->cache_path();
$fullPath = $folderCache;

if ( !empty($model->data['nodePath']) ){
  $fullPath .= $model->data['nodePath'];
}

/*if ( !empty($model->data['cache']) && \bbn\str::check_path($model->data['path']) ){
  return [json_encode(unserialize(file_get_contents($folderCache.$model->data['cache'])))];
}*/

if ( !empty($model->data['cache'])  && \bbn\str::check_path($folderCache.$model->data['cache'])){
  return json_decode(file_get_contents($folderCache.$model->data['cache']));
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
  $paths = [];

  
  if ( !empty($content) ){
    foreach( $content as $i => $path ){
      $nodePath = substr($path, strlen($folderCache));
      $arr = explode("/", $path);
      $element = $arr[count($arr)-1];

      $ele =  [
        'text' => $element,
        //'path' => [],
        'nodePath' => $nodePath,
        'items'=> [],
        'num' => is_dir($path) ? count(\bbn\file\dir::get_files($path, true)) : 0,
        'folder' => is_dir($path)
      ];


      if ( (strpos($path, $fullPath) === 0)  && is_dir($fullPath) ){
        if ( !empty($model->data['path']) ){
          $paths = $model->data['path'];
        }
        else{
          $paths = [];
        }
        if ( !in_array($ele, $paths) ){
          $paths[] = $ele;
        }
  
      }
      $ele['path'] = $paths;
      array_push($all, $ele);
    }
  }
  return ['data' => $all];
}