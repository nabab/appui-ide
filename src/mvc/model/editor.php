<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = ['success' => false];

if ($model->hasData('id_project')) {
  $project = new luk\Project($model->db, $model->data['id_project']);
  $action = array_shift($model->data['arguments']);
  switch ($action) {
    case 'content':
      $url = X::join($model->data['arguments'], '/');
      $file = $project->urlToReal($url);
      $ext = pathinfo($file)['extension'];
      $content = file_get_contents($file);
      $res['url'] = $url;
      $res['extension'] = $ext;
      $res['content'] = $content;
      $res['success'] = true;
      break;
    case 'file':
      return $model->getModel('newide/editor/file', $model->data);
      break;
  }
}

return $res;
