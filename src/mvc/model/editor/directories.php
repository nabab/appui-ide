<?php
  $res = ['success' => false];
  if ( isset($model->inc->options) ){
    $repositories = $model->inc->options->full_options($model->inc->options->from_code('PATHS', 'ide', BBN_APPUI));
    $type = $model->inc->options->full_options($model->inc->options->from_code('PTYPES', 'ide', BBN_APPUI));
    if ( !empty($repositories) && !empty($repositories) ){
      $res = [
        'success' => true,
        'repositories' => $repositories,
        'type' => $type
      ];
    }
  }
  return $res;
