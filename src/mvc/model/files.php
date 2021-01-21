<?php

$res = [];
if (isset($model->data['data']['fpath'])) {
  $fs = new \bbn\file\system();
  $id_project = $model->data['data']['id_project'] ??
    $model->inc->options->from_code(BBN_APP_NAME, 'list', 'project', 'appui');
  if ($id_project) {
    $project = new \bbn\appui\project($model->db, $id_project);
    $fn = 'get_'.$model->data['data']['fpath'].'_path';
    if (method_exists($project, $fn)
       && ($root = $project->$fn())
    ) {
      $fs->cd($root.(empty($model->data['data']['item']) ? '' : '/'.$model->data['data']['item']));
      $res = $fs->get_files('.', true, true, null, 'tc');
    }
  }
}
return ['data' => $res];