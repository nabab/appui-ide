<?php
//modify type
$res = ['success' => false];
if ( isset($model->inc->options) ){
  if ( !empty($model->data['row']) &&
    !empty($model->data['row']['id'])
  ){

    if ( !empty($model->inc->options->set($model->data['row']['id'],$model->data['row'])) ){
      $res = [ 'success' => true ];
    }
  }
}
return $res;
