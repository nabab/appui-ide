<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/08/2017
 * Time: 18:16
 *
 * @var $model \bbn\mvc\model
 */
if ( !empty($model->data['repository']) &&
  !empty($model->data['repository_cfg']) &&
  isset($model->inc->ide, $model->data['onlydirs'], $model->data['tab'])
){
  $rep_cfg = $model->data['repository'];

  // Get the repository's root path
  $path = $model->inc->ide->get_root_path($rep_cfg);

  return [
    'title' => './',
    'name' => './',
    'lazy' => false,
    'folder' => true,
    'icon' => 'folder-icon',
    'children' => $model->get_model('./tree', $model->data)
  ];
}