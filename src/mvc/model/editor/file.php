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
  $step_url = explode("/", $url);
  $rep = $model->inc->ide->repository_from_url($url);
  $file = $model->inc->ide->url_to_real($url);
  $route = '';
  foreach ( $model->data['routes'] as $i => $r ){
    if ( strpos($file, $r['path']) === 0 ){
      $route = $i;
    }
  }
  $path = str_replace($rep, '' , $url);
  $path = substr($path, 0, strpos($path, '/_end_'));

  //$model->data['url'] = str_replace('/_end_', '', $model->data['url']);
  //$path = $model->inc->ide->file_from_url($model->data['url']);

  $repos = $model->inc->ide->repositories();
  $repository = $repos[$rep];
  $f = $model->inc->ide->decipher_path($url);

  if ( !empty($repository['tabs']) && (strpos( $f, $repository['path']) > 0) ){
    $arr = explode("/", $url);
    array_pop($arr);
    array_pop($arr);
    array_push($arr, "php");
    $ctrl_file = $model->inc->ide->url_to_real(implode("/", $arr));
  }

  return [
    'isMVC' => $model->inc->ide->is_MVC_from_url(str_replace('/_end_', '', $url)),
    'title' => $path,
    'repository' => $rep,
    'url' => $rep.$path.'/_end_',
    'route' => $route,
    'settings' => is_file($ctrl_file),
    'ext' => \bbn\str::file_ext($file),
    'tab' => $step_url[array_search('_end_', $step_url) + 1]
  ];

}
return false;
