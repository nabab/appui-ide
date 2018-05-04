<?php
$res = ['success' => false];
if ( isset($model->inc->options) ){
  $types = $model->inc->options->full_options($model->inc->options->from_code('PTYPES', 'ide', BBN_APPUI));
  if ( !empty($types) ){
    $types = array_map(function($t){
      if ( $t['tabs'] ){
        $t['tabs'] = json_encode($t['tabs']);
      }
      if ( $t['extensions'] ){
        $t['extensions'] = json_encode($t['extensions']);
      }
      return $t;
    }, $types);
    $res = [
      'success' => true,
      'types' => $types
    ];
  }
}
return $res;
