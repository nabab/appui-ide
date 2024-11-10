<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model */

use bbn\X;

if ($model->hasData('id_project', true)) {
  X::log($model->data['id_project'], 'git');
  $tmp = X::curl(GITLAB_URL.'projects/'.$model->data['id_project'].'/repository/branches', ['access_token' => GITLAB_TOKEN], []);
  if ($tmp) {
    $branches = json_decode($tmp, true);
  }
  return [
    'branches' => $branches,
  ];
}
