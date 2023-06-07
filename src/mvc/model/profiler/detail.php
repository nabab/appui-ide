<?php
use bbn\X;

/** @var $model \bbn\Mvc\Model*/
if ($model->hasData('id', true)) {
  $profiler = new \bbn\Appui\Profiler($model->db);
  $data = $profiler->get($model->data['id']);
  return [
    'title' => $data['url'].' - '._('Results'),
    'data' => $data['data']
  ];
}