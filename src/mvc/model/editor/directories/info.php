<?php

if ( isset($model->inc->options) ){
  if ( !empty($model->data['id']) ){
    $infos = json_encode($model->inc->options->option($model->data['id']));
    $tree=[
      'text' => $model->data['name'],
      'icon' => "fa fa-folder",
      'numChildren' => count($model->inc->options->full_options($model->data['id'])),
      'num' => count($model->inc->options->full_options($model->data['id'])),
      'items' => $model->inc->options->full_options($model->data['id']),
    ];
    if ( !empty($infos) ){
      return [
        'informations' => $infos,
        'success' => true,
        'tree' => !empty($tree) ? $tree : []
      ];
    }
  }
}
return [
  'success' => false
];
