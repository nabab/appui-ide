<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model */

use bbn\X;

if ($model->hasData(['id_project', 'branch'], true)) {
  X::log('toto', 'git');
  $branches = $model->getCachedModel('git/branches', $model->data, 24*3600);
  $branch = X::getRow($branches['branches'], ['name' => $model->data['branch']]);
  $tmp = X::curl(
    GITLAB_URL.'projects/'.$model->data['id_project'].'/repository/commits',
    ['access_token' => GITLAB_TOKEN, 'ref_name' => $model->data['branch']],
    []
  );
  //if ($tmp < $start) {
  //}
  //X::ddump($tmp);
  //$title['branch'] = $model->data['branch'];
  if ($tmp) {
    $commits = json_decode($tmp, true);
  }
  return [
    'commits' => $commits,
  ];
}
