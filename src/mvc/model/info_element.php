<?php


$res = [
  'list' => [],
  'exts' => []
];

if ( !empty($model->data['repository']['bbn_path']) &&
  !empty($model->data['repository']['path']) &&
  (!empty($model->data['is_mvc']) || !empty($model->data['is_component']))
){
  $path = $model->data['repository']['bbn_path'].$model->data['repository']['path'];

  if ( $model->data['is_mvc'] ){
    $path .= 'mvc/';
  }
  else if ( $model->data['is_component'] ){
    $path .= 'component/';
  }
/*
  //case folder
  if ( !$model->data['is_folder'] ){
    $path='';
  }//case file
  else{

  }
*/
}
$tabs = [];
foreach($model->data['repository']['tabs'] as $tab){
  if ( $tab['title'] !== "CTRL" ){
    $tabs[$tab['path']] = $tab['extensions'];
  }
};


$t = [];
$e = [];
foreach( $tabs as $tab => $exts){
  if ( $model->data['is_file'] ){
    foreach( $exts as $val ){
      $path = $model->inc->ide->decipher_path($model->data['repository']['bbn_path'] . '/' . $model->data['repository']['path']).$model->data['data']['type'].'/'.$tab.$model->data['data']['dir'].$model->data['data']['name'].'.'.$val['ext'];
      if ( file_exists($path) ){
        $t = [
          'text' => str_replace("/","",$tab),
          'value' => $tab
        ];

        if ( !in_array($t, $res['list']) ){
          $res['list'][] = $t;
        }

        $res['exts'][$tab] = [
          'text' => $val['ext'],
          'value' => '.'.$val['ext'],
        ];

      }
    }
  }
  else if ( empty($model->data['is_file']) && empty($model->data['is_component']) ){
    $path = $model->inc->ide->decipher_path($model->data['repository']['bbn_path'] . '/' . $model->data['repository']['path']).$model->data['data']['type'].'/'.$tab.$model->data['data']['dir'].$model->data['data']['name'];
    if ( is_dir($path) ){
      $t = [
        'text' => str_replace("/","",$tab),
        'value' => $tab
      ];

      if ( !in_array($t, $res['list']) ){
        $res['list'][] = $t;
      }
    }
  }
  else if ( !empty($model->data['is_component']) ){
      foreach( $exts as $val ){
        $path = $model->inc->ide->decipher_path($model->data['repository']['bbn_path'] . '/' . $model->data['repository']['path']).$model->data['data']['dir'].$model->data['data']['name'] . '/' . $model->data['data']['name'] . '.' .$val['ext'];
        if ( file_exists($path) ){
          $t = [
            'text' => str_replace("/","",$tab),
            'value' => $tab
          ];
          if ( !in_array($t, $res['list']) ){
            $res['list'][] = $t;
          }
          $res['exts'][$tab] = [
            'text' => $val['ext'],
            'value' => '.'.$val['ext'],
          ];
        }
      }

  }

}

return $res;
