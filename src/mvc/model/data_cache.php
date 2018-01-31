<?php
if ( empty($model->data['path']) ){
  $folderCache = "bbn_cache";
}
else{
  $folderCache = $model->data['path'];
}

if ( !empty($model->data['cache']) ){
  return [json_encode(unserialize(file_get_contents(BBN_DATA_PATH.$model->data['cache'])))];
}
//case click button for delte all cache
elseif( !empty($model->data['deleteAll']) ){
  if ( \bbn\file\dir::delete(BBN_DATA_PATH."bbn_cache", $model->data['deleteContent'] ) ){
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
elseif ( !empty($model->data['deleteCache']) ){
  if ( \bbn\file\dir::delete(BBN_DATA_PATH.$model->data['deleteCache'], $model->data['deleteContent'] ) ){
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
  $fullPath = BBN_DATA_PATH.$folderCache;
  $content = \bbn\file\dir::get_files($fullPath, true);
  $cache = \bbn\cache::get_engine();
  $all = [];
  foreach($content as $i => $v){
    $arr = explode("/", $v);
    $element = $arr[count($arr)-1];
    $path = empty($model->data['path']) ? BBN_DATA_PATH."bbn_cache/".$element :  BBN_DATA_PATH.$folderCache.'/'.$element;
    array_push($all, [
      'text'=> $element,
      'path' => empty($model->data['path']) ? "bbn_cache/".$element : $folderCache.'/'.$element,
      'items'=> [],
      'num' => is_dir($path) ? count(\bbn\file\dir::get_files($path, true)) : 0,
      'folder' => is_dir($path)
    ]);
  }
  return $all;
}
