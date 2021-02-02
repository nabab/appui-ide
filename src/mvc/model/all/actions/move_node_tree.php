<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 14/12/17
 * Time: 18.24
 */
$res['success'] = false;

if ( isset($model->data) &&
  !empty($model->data['orig']) &&
  !empty($model->data['dest'])
){
  $dest= explode('/', $model->data['dest']);
  $constantDest= $dest[0];
  $dest[0]= constant($constantDest);
  $pathDest = implode('/', $dest);
  str_replace('//','/',$pathDest);


  if ( $model->inc->fs->isDir($pathDest) ){
    $orig= explode('/', $model->data['orig']);
    $constantOrig= $orig[0];
    $orig[0]= constant($constantOrig);
    $pathOrig = implode('/', $orig);
    str_replace('//','/',$pathOrig);

    $pathDest = $pathDest.'/'.basename($pathOrig);
    if ( $model->inc->fs->move($pathOrig, $pathDest) ){
      $res['success'] =  true;
    }
  }
}
return $res;