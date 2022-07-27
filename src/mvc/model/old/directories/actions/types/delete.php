<?php
//delete type
$res = ['success' => false];
if ( isset($model->inc->options) &&
  !empty($model->data['id_type']) &&
  !empty($model->inc->options->remove($model->data['id_type']))
){
    $res = [ 'success' => true ];
}
return $res;
