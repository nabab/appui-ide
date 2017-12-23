<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 14/12/17
 * Time: 18.24
 */
$res['success'] = false;
//die(var_dump($model->data));
if ( isset($model->data) &&
  !empty($model->data['orig']) &&
  !empty($model->data['dest'])
){
  $dest= explode('/', $model->data['dest']);
  $constantDest= $dest[0];
  $dest[0]= constant($constantDest);
  $pathDest = implode('/', $dest);
  str_replace('//','/',$pathDest);


  if ( is_dir($pathDest) ){
    $orig= explode('/', $model->data['orig']);
    $constantOrig= $orig[0];
    $orig[0]= constant($constantOrig);
    $pathOrig = implode('/', $orig);
    str_replace('//','/',$pathOrig);

    $pathDest = $pathDest.'/'.basename($pathOrig);
    if ( \bbn\file\dir::move($pathOrig, $pathDest) ){
      $res['success'] =  true;
    }
  }
}
return $res;