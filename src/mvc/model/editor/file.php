<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/07/2017
 * Time: 15:04
 *
 * @var $model \bbn\mvc\model
 */

if ( !empty($model->data['url']) && isset($model->inc->ide) ){
  $model->data['url'] = str_replace('/_end_', '', $model->data['url']);
  $rep = $model->inc->ide->repository_from_url($model->data['url']);
  $path = $model->inc->ide->file_from_url($model->data['url']);
  return [
    'isMVC' => $model->inc->ide->is_MVC_from_url($model->data['url']),
    'title' => $path,
    'repository' => $rep,
    'url' => $rep.$path.'/_end_'
  ];
}
return false;