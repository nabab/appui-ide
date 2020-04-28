<?php

/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 15/12/17
 * Time: 13.02
 */



if ( !empty($model->data['search']) &&
  isset($model->data['all'])
){
  //search in all repositories
  if ( $model->data['all'] ){
    $result = $model->inc->ide->searchAll($model->data['search']);
    if( !empty($result) ){
      return  $result;
    }
  }
  //search in current repository
  elseif (!empty($model->data['nameRepository']) &&
    !empty($model->data['repository']) &&
    isset($model->data['typeSearch'])
  ){
    $result = $model->inc->ide->search($model->data);
    if( !empty($result) ){
      return $result;
    }
  }
}
return ['success' => false];
