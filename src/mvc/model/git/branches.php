<?php
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/

use bbn\X;

if ($model->hasData('id_project', true)) {
  $tmp = X::curl(BBN_GITLAB_URL.'projects/'.$model->data['id_project'].'/repository/branches', ['access_token' => BBN_GITLAB_TOKEN], []);
  if ($tmp) {
    $branches = json_decode($tmp, true);
  }
  return [
    'branches' => $branches,
  ];
}
