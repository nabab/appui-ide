<?php
use bbn\X;

/** @var bbn\Mvc\Model $model */
if ($model->hasData('id', true)) {
  $profiler = new \bbn\Appui\Profiler($model->db);
  $data = $profiler->get($model->data['id']);
  return [
    'title' => $data['url'].' - '._('Results'),
    'data' => $data['data']
  ];
}