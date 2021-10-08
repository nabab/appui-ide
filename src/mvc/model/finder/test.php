<?php
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/


if ($model->hasData(['host', 'user', 'pass', 'text'], true)) {
   	$fs = new \bbn\File\System('ssh', [
      'path' => $model->data['path'] ?? '.',
      'host' => $model->data['host'],
      'user' => $model->data['user'],
      'pass' => $model->data['pass']
    ]);
  	return [
      'success' => $fs->check()
    ];
}