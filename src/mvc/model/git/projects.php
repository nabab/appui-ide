<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model */

use bbn\X;


$res = X::curl(GITLAB_URL.'projects', ['access_token' => GITLAB_TOKEN, 'per_page' => 100], []);
//$res = X::curl($url.'projects/117/repository/branches', ['access_token' => $tok], []);
$projectList = json_decode($res, true);
/*
foreach ($projectList as &$p) {
  if ($tmp = $model->getCachedModel('git/branches', ['id_project' => $p['id']], 24*3600)) {
  	foreach ($tmp['branches'] as &$branch) {
      if ($tmp2 = $model->getCachedModel('git/commits', ['id_project' => $p['id'], 'branch' => $branch['name']], 24*3600)) {
        $branch['commits'] = $tmp2['commits'];
      }
    }
    $p['branches'] = $tmp['branches'];
  }
}
unset($p);*/

return [
  'projects' => $projectList,
];