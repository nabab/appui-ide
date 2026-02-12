<?php
use bbn\Cache;
use bbn\Str;
use bbn\X;
use bbn\File\System;

/** @var bbn\Mvc\Model $model */
if (!$model->hasData('main')) {
  $cache = Cache::getEngine();
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
    return $cache->getFull($model->data['cache']);
  }
  elseif(!empty($model->data['user'])) {
    return [
      'success' => $model->inc->user->deleteAllCache()
    ];
  }
  elseif(!empty($model->data['users'])) {
    $root = $model->tmpPath() . 'users';
    $userFolders = $model->inc->fs->getDirs($root);
    foreach ($userFolders as $userFolder) {
      if ($model->inc->fs->isDir($userFolder . '/tmp/cache')) {
        $model->inc->fs->delete($userFolder . '/tmp/cache', false);
      }
    }

    return [
      'success' => true
    ];
  }
  //case click button for delte all cache
  elseif(!empty($model->data['deleteAll'])) {
    return [
      'success' => (bool)$cache->deleteAll()
    ];
  }
  //case delete a cache or file or folder in tree
  elseif (!empty($model->data['deleteCache']) && Str::checkPath($model->data['deleteCache'])) {
    return [
      'success' => $cache->deleteAll($model->data['deleteCache'])
    ];
  }//in this block retur tha data of all cache for tree
  else {
    $cache = Cache::getEngine();
    $all = $cache->browse($model->data['nodePath'] ?? '');

    return ['data' => $all];
  }
}
