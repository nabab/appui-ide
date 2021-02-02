<?php
//add type
$res = ['success' => false];
if ( isset($model->inc->options) ){
  if ( !empty($model->data['text']) &&
    $id_parent = $model->inc->options->fromCode('PTYPES', 'ide', BBN_APPUI)
){
    $type = [
      'text' => $model->data['text'],
      'id_parent' => $id_parent,
    ];

    if ( !empty($model->data['code']) ){
      $type['code'] =  $model->data['code'];
    }
    if ( !empty($model->data['tabs']) ){
      $type['tabs'] = json_decode($model->data['tabs']);
    }
    if ( !empty($model->data['extensions']) ){
      $type['extensions'] = json_decode($model->data['extensions']);
    }
    if ( !empty($model->inc->options->add($type)) ){
      $res = [ 'success' => true ];
    }
  }
}
return $res;
