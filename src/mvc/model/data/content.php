<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\File\System;
/** @var bbn\Mvc\Model $model */


if ($model->data['path']) {
  $fs = new System();
  if ($fs->exists($model->data['path'])) {
    return [
      'success' => true,
      'content' => $fs->getContents($model->data['path'])
    ];
  }
  
  return [
    'success' => false,
    'error' => 'File not exist'
  ];
}

return [
  'success' => false,
  'error' => 'No path given'
];