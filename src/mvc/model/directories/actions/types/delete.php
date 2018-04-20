<?php
//delete type
$res = ['success' => false];
if ( isset($model->inc->options) &&
  !empty($model->data['idType']) &&
  !empty($model->inc->options->remove($model->data['idType']))
){
    $res = [ 'success' => true ];
}
return $res;
