<?php
/**
   * What is my purpose?
   *
   **/

use bbn\X;
use bbn\Str;
use bbn\Appui\Project;
/** @var $model \bbn\Mvc\Model*/

if (X::hasProps($model->data['data'], ['id_project', 'id_path'], true)) {
  $path = $model->data['data']['uid'] ?? '';
  if (X::hasProps($model->data['data'], ['is_vue', 'name'], true)) {
    // find the position of the last occurrence of the string
    $last_occurrence_pos = strrpos($model->data['data']['uid'], $model->data['data']['name'] . '/' . $model->data['data']['name']);

    if ($last_occurrence_pos !== false) {
      // replace the last occurrence with the desired string
      $model->data['data']['uid'] = substr_replace($path, $model->data['data']['name'], $last_occurrence_pos, strlen($model->data['data']['name'] . '/' . $model->data['data']['name']));
    }
  }
  if (!empty($model->data['data']['type'])) {
    $project = new Project($model->db, $model->data['data']['id_project']);
    $res = $project->openTree($path, $model->data['data']['id_path'], $model->data['data']['type']);
    //X::ddump($path, $model->data['data']['uid'], $res);
  }
  return [
    'data' => $res ?? []
  ];
}