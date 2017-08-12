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
  $url = $model->data['url'];
  $rep = $model->inc->ide->repository_from_url($model->data['url']);
  $file = $model->inc->ide->url_to_real($model->data['url']);
  $route = '';
  foreach ( $model->data['routes'] as $i => $r ){
    if ( strpos($file, $r) === 0 ){
      $route = $i;
    }
  }
  $path = str_replace($rep, '' , $url);
  $path = substr($path, 0, strpos($path, '/_end_'));
  //$model->data['url'] = str_replace('/_end_', '', $model->data['url']);
  //$path = $model->inc->ide->file_from_url($model->data['url']);
  return [
    'isMVC' => $model->inc->ide->is_MVC_from_url(str_replace('/_end_', '', $url)),
    'title' => $path,
    'repository' => $rep,
    'url' => $rep.$path.'/_end_',
    'route' => $route,
    'ext' => \bbn\str::file_ext($file)
  ];
}
return false;