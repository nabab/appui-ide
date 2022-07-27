<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

if (X::hasProps($model->data['data'], ['id_project', 'id_path'], true)) {
  if (!empty($model->data['data']['type'])) {
    $project = new luk\Project($model->db, $model->data['data']['id_project']);
    $res = $project->openTree($model->data['data']['uid'] ?? '', $model->data['data']['id_path'], $model->data['data']['type']);
  }
  return [
    'data' => $res ?? []
  ];
}