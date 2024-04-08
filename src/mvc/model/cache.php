<?php
use bbn\Cache;
use bbn\Str;
use bbn\X;
use bbn\File\System;

/** @var bbn\Mvc\Model $model */
if (!$model->hasData('main')) {
  if (!isset($model->inc->fs)) {
    $model->addInc('fs',  new System());
  }
  
  $folderCache = $model->cachePath();
  $fullPath = $folderCache;
  if (!empty($model->data['data'])) {
    $model->data = $model->data['data'];
  }
  
  if (!empty($model->data['nodePath'])) {
    $fullPath .= $model->data['nodePath'];
  }
  
  /*if ( !empty($model->data['cache']) && \bbn\Str::checkPath($model->data['path']) ){
    return [json_encode(unserialize(file_get_contents($folderCache.$model->data['cache'])))];
  }*/
  
  if (!empty($model->data['cache']) && Str::checkPath($folderCache.$model->data['cache'])) {
    return json_decode(file_get_contents($folderCache.$model->data['cache']));
  }
  //case click button for delte all cache
  elseif(!empty($model->data['deleteAll'])) {
    if ($model->inc->fs->delete($folderCache, false)) {
      return [
        'success' => true
      ];
    }
    else {
      return [
        'success' => false
      ];
    }
  }
  //case delete a cache or file or folder in tree
  elseif (!empty($model->data['deleteCache']) && Str::checkPath($model->data['deleteCache'])) {
    $ele = $folderCache.$model->data['deleteCache'];
    if (!empty($model->inc->fs->delete($ele, $model->data['deleteCache']))) {
      return [
        'success' => true
      ];
    }
    else {
      return [
        'success' => false
      ];
    }
  }//in this block retur tha data of all cache for tree
  else {
    $content = $model->inc->fs->getFiles($fullPath, true);
    $cache = Cache::getEngine();
    $all = [];
    $paths = [];
  
    if (!empty($content)) {
      foreach ($content as $i => $path) {
        $nodePath = substr($path, strlen($folderCache));
        $arr = explode("/", $path);
        $element = $arr[count($arr)-1];
  
        $ele =  [
          'text' => $element,
          //'path' => [],
          'nodePath' => $nodePath,
          'items'=> [],
          'num' => $model->inc->fs->isDir($path) ? count($model->inc->fs->getFiles($path, true)) : 0,
          'folder' => $model->inc->fs->isDir($path)
        ];
  
  
        if ((strpos($path, $fullPath) === 0)  && $model->inc->fs->isDir($fullPath)) {
          if (!empty($model->data['path'])) {
            $paths = $model->data['path'];
          }
          else {
            $paths = [];
          }

          if (!in_array($ele, $paths)) {
            $paths[] = $ele;
          }
        }

        $ele['path'] = $paths;
        array_push($all, $ele);
      }
    }

    return ['data' => $all];
  }
}
