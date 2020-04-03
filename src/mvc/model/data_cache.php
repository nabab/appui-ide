<?php
if ( !isset($model->inc->fs) ){
  $model->add_inc('fs',  new \bbn\file\system());
}

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
elseif( !empty($model->data['deleteAll']) ){
  if ( $model->inc->fs->delete($folderCache, false) ){
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
elseif ( !empty($model->data['deleteCache']) && \bbn\str::check_path($model->data['deleteCache']) ){
  $ele = $folderCache.$model->data['deleteCache'];
  if ( !empty($model->inc->fs->delete($ele, $model->data['deleteCache'])) ){
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
  $content = $model->inc->fs->get_files($fullPath, true);
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
        'num' => $model->inc->fs->is_dir($path) ? count($model->inc->fs->get_files($path, true)) : 0,
        'folder' => $model->inc->fs->is_dir($path)
      ];


      if ( (strpos($path, $fullPath) === 0)  && $model->inc->fs->is_dir($fullPath) ){
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