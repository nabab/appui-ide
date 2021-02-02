<?php
  $res = ['success' => false];
  if ( isset($model->inc->options) ){  
    $repositories = $model->inc->options->fullOptions($model->inc->options->fromCode('PATHS', 'ide', BBN_APPUI));
    $type = $model->inc->options->fullOptions($model->inc->options->fromCode('PTYPES', 'ide', BBN_APPUI));
    if ( !empty($repositories) && !empty($repositories) ){
      $res = [
        'success' => true,
        'repositories' => $repositories,
        'type' => $type
      ];
    }
  }
  return $res;
