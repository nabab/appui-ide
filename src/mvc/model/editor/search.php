<?php

/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 15/12/17
 * Time: 13.02
 */
$res['success'] = false;

if ( !empty($model->data['search']) &&
    !empty($model->data['nameRepository']) &&
    !empty($model->data['repository']) &&
    isset($model->data['typeSearch']) &&
    isset($model->inc->ide)
){
  $result = $model->inc->ide->search($model->data);
  if( !empty($result) ){
    return $result;
  }
}
return $res;
