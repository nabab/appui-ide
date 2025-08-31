<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model*/
use bbn\X;

if (isset($model->data['path']) && isset($model->data['content'])) {
  if ($model->inc->finderfs->exists($model->data['path'])) {
  	return [
    	'success' => $model->inc->finderfs->putContents($model->data['path'], $model->data['content']),
  	];
  } else {
    return [
      'success' => 	false,
      'message' => 'File not found'
    ];
  }
}
return [
  'success' => false,
  'message' => 'Error in post data'
];
