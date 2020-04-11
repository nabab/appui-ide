<?php
$path = $model->inc->ide->get_data_path('appui-ide').'backup/'.$model->data['uid'];
$res = [];

// for tree
if ( isset($model->inc->ide) && !empty($model->data['uid']) ){
  if ( !isset($model->data['type']) ){
    $list = $model->inc->ide->history($model->data['uid'], $model->data['repository_cfg']);
    if ( !empty($list) ){
      foreach ( $list as $val ){
        array_push($res, [
          'text' => $val['text'],
          'numChildren' => $val['num_items'],
          'uid' => $model->data['uid']."/".$val['text'],
          'is_mvc' => $model->data['is_mvc']
        ]);
      }
    }
  }
  else {
    $files = $model->inc->ide->history($model->data['uid'],  $model->data['repository_cfg']);
    if ( !empty($files) ){
      foreach ( $files as $val ){
        array_push($res, [
          'text' => $val['text'],
          'numChildren' => \count($val['items']),
          'items' => !empty($val['items']) ? $val['items'] : [],
          'is_mvc' => $model->data['is_mvc'],
          'name_file' => $val['file'],
        ]);
      }
    }
  }
  if ( !empty($res) ){
    return ['data' => $res];
  }
  else {
    $error = $model->inc->ide->get_last_error();
    return ($error === null) ? [] : ['error' =>  $error];
  }
}
// for get content
else {
  if ( isset($model->inc->ide, $model->data['url']) &&
    !empty($model->data['url'])
  ){
    $path = $model->inc->ide->get_data_path('appui-ide').'backup/'.
      $model->data['repository_cfg']['root'].'/'.
      substr($model->data['url'], strpos($model->data['url'],$model->data['repository_cfg']['code'],1));
    if ( $model->inc->fs->is_file($path) ){
      $code= $model->inc->fs->get_contents($path);
    }
    if ( !empty($code) ){
      return [
        'data' => [
          'success' => true,
          'code' => $code
        ]
      ];
    }
    else {
      $error = $model->inc->ide->get_last_error();
      return ($error === null) ? ['data' => ['success' => false]] : ['data' => ['error' => $error]];
    }
  }
}

return [];

