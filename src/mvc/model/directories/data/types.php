<?php
$res = ['success' => false];
if ( isset($model->inc->options) ){
  $types = $model->inc->options->full_options($model->inc->ide->get_types());  
  if ( !empty($types) ){
    $types = array_map(function($t){
      if ( !empty($t['tabs']) ){
        $t['tabs'] = json_encode($t['tabs']);
      }
      if ( !empty($t['extensions']) ){
        $t['extensions'] = json_encode($t['extensions']);
      }
      if ( !empty($t['types']) ){
        $t['types'] = json_encode($t['types']);
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
