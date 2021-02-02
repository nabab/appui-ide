<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/08/2017
 * Time: 18:16
 *
 * @var $model \bbn\Mvc\Model
 */
if ( !empty($model->data['repository']) &&
  !empty($model->data['repository_cfg']) &&
  isset($model->inc->ide, $model->data['onlydirs'], $model->data['tab'])
){
  $rep_cfg = $model->data['repository'];

  // Get the repository's root path
  $path = $model->inc->ide->getRootPath($rep_cfg);

  return [
    'title' => './',
    'name' => './',
    'lazy' => false,
    'folder' => true,
    'icon' => 'folder-icon',
    'children' => $model->getModel('./tree', $model->data)
  ];
}