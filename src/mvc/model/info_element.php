<?php

$res = [
  'list' => [],
  'exts' => []
];

if ( !empty($model->data['repository']['name']) &&
  !empty($model->data['repository']['path']) &&
  (!empty($model->data['is_mvc']) || !empty($model->data['is_component']))
){
  $root = $model->inc->ide->get_root_path($model->data['repository']['name']);
  $path = $root.$model->data['repository']['path'];

  if ( $model->data['is_mvc'] ){
    $path .= 'mvc/';
  }
  elseif ( $model->data['is_component'] ){
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
      $path = $root.$model->data['data']['type'].'/'.$tab.$model->data['data']['dir'].$model->data['data']['name'].'.'.$val['ext'];
      if ( $model->inc->fs->exists($path) ){
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
  elseif ( empty($model->data['is_file']) && empty($model->data['is_component']) ){
    $path = $root.$model->data['data']['type'].'/'.$tab.$model->data['data']['dir'].$model->data['data']['name'];
    if ( $model->inc->fs->is_dir($path) ){
      $t = [
        'text' => str_replace("/","",$tab),
        'value' => $tab
      ];

      if ( !in_array($t, $res['list']) ){
        $res['list'][] = $t;
      }
    }
  }
  elseif ( !empty($model->data['is_component']) ){
      foreach( $exts as $val ){
        $path = $root.$model->data['data']['dir'].$model->data['data']['name'] . '/' . $model->data['data']['name'] . '.' .$val['ext'];
        if ( $model->inc->fs->exists($path) ){
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
