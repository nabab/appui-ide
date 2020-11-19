<?php
/*
 * Describe what it does!
 *
 **/
use bbn\x;

/** @var $model \bbn\mvc\model*/
if ($model->has_data('id', true)) {
  $profiler = new \bbn\appui\profiler($model->db);
  $data = $profiler->get($model->data['id']);
  return [
    'title' => $data['url'].' - '._('Results'),
    'data' => $data['data']
  ];
}