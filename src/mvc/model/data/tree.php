<?php
/**
   * What is my purpose?
   *
   **/

use bbn\X;
use bbn\Str;
use bbn\Appui\Project;
/** @var bbn\Mvc\Model $model */

if (X::hasProps($model->data['data'], ['id_project', 'id_path'], true)) {
  $path = $model->data['data']['uid'] ?? '';
  if (X::hasProps($model->data['data'], ['isComponent', 'name'], true)) {
    // find the position of the last occurrence of the string
    $last_occurrence_pos = Str::rpos($model->data['data']['uid'], $model->data['data']['name'] . '/' . $model->data['data']['name']);

    if ($last_occurrence_pos !== false) {
      // replace the last occurrence with the desired string
      $path = substr_replace($path, $model->data['data']['name'], $last_occurrence_pos, Str::len($model->data['data']['name'] . '/' . $model->data['data']['name']));
    }
  }
  if (!empty($model->data['data']['type'])) {
    $project = new Project($model->db, $model->data['data']['id_project']);
    $res = $project->openTree($path, $model->data['data']['id_path'], $model->data['data']['type']);
  }
  return [
    'data' => $res ?? []
  ];
}