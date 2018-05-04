<?php
//modify type
$res = ['success' => false];
if ( isset($model->inc->options) ){
  if ( !empty($model->data['id']) ){
    //$opt = $model->inc->options->option($model->data['id']);
    $type = [
      'code' => $model->data['code'],
      'id_alias' => $model->data['id_alias'],
      'id_parent' => $model->data['id_parent'],
      'num' => $model->data['num'],
      'num_children' => $model->data['num_children'],
      'text' => $model->data['text']
    ];
    if ( !empty($model->data['tabs']) ){
      $type['tabs'] = json_decode($model->data['tabs']);
    /*  if ( $opt['extensions'] ){
        return $res;
      }*/
    }
    if ( !empty($model->data['extensions']) ){
      $type['extensions'] = json_decode($model->data['extensions']);
      /*if ( $opt['tabs'] ){
        return $res;
      }*/
    }
    //die(var_dump($type));
    if ( !empty($model->inc->options->set($model->data['id'],$type)) ){
      $res = [ 'success' => true ];
    }
  }
}
return $res;
