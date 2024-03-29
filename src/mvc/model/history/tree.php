<?php
if (!isset($model->inc->ide)) {
  throw new \Exception(_("No IDE object!"));
}

$path = $model->inc->ide->getDataPath('appui-ide').'backup/'.$model->data['uid'];
$res = ['success' => false];
//die(var_dump($model->data));
// for tree
if (!empty($model->data['uid']) ){
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
        if ( empty($model->data['content_files']) ){
            array_push($res, [
              'text' => $val['text'],
              'numChildren' => \count($val['items']),
              //'currentData' => !empty($val['items']) ? $val['items'] : [],
              'is_mvc' => $model->data['is_mvc'],
              'content_files' => !empty($val['items']),
              'type' => $model->data['type'],
              'uid' => $model->data['uid']
            ]);
        }
        else{
          return ['data' => $val['items']];
        }
      }
    }
  }
  if ( !empty($res) ){
    return ['data' => $res];
  }
  else {
    $error = $model->inc->ide->getLastError();
    return ($error === null) ? [
      'data' => []
    ] : ['error' =>  $error];
  }
}
// for get content
elseif (isset($model->data['url'])
        && !empty($model->data['url'])
){
  $path = $model->inc->ide->getDataPath('appui-ide').'backup/'.
    $model->data['repository_cfg']['root'].'/'.
    substr($model->data['url'], Strpos($model->data['url'],$model->data['repository_cfg']['code'],1));
  
  if ( $model->inc->fs->isFile($path) ){
    $code= $model->inc->fs->getContents($path);
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
    $error = $model->inc->ide->getLastError();
    return ($error === null) ? ['success' => false, 'data' => []] : ['error' => $error, 'data' => []];
  }
}

return $res;
