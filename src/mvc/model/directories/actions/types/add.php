<?php
//add type
$res = ['success' => false];
if ( isset($model->inc->options) ){
  if ( !empty($model->data['row'])){
     $model->data['row']['id_parent'] = $model->inc->options->from_code('PTYPES', 'ide', BBN_APPUI),
    if ( !empty($model->inc->options->add($model->data['row'])) ){
      $res = [ 'success' => true ];
    }    
  }
}
return $res;
