<?php
$path = $ctrl->data_path('appui-ide').'backup/'.$ctrl->post['uid'];
$res = [];
if ( isset($ctrl->inc->ide, $ctrl->post['is_mvc']) &&
  !empty($ctrl->post['uid'])
){
  if ( !isset($ctrl->post['type']) ){
    $list = $ctrl->inc->ide->history($ctrl->post['uid']);
   // die(var_dump($list));
    if ( !empty($list) ){
      foreach ( $list as $val ){
        array_push($res, [
          'text' => $val['text'],
          'numChildren' => $val['num_items'],
          //'icon' => $val['icon'],
          'uid' => $ctrl->post['uid']."/".$val['text'],
          'is_mvc' => $ctrl->post['is_mvc']
        ]);
      }
    }
  }
  else {
    $files = $ctrl->inc->ide->history($ctrl->post['uid']);
    if ( !empty($files) ){
      foreach ( $files as $val ){
        array_push($res, [
          'text' => $val['text'],
          'numChildren' => \count($val['items']),
          'items' => $val['items'],
          'is_mvc' => $ctrl->post['is_mvc'],
          'name_file' => $val['file'],
        ]);
      }
    }
  }
  if ( !empty($res) ){
    $ctrl->obj->data = $res;
  }
  else {
    $error = $ctrl->inc->ide->get_last_error();
    if ( $error === null ){
      $ctrl->obj->data = [];

    }
    else{
      $ctrl->obj->error = $error;
    }
  }
}
else{
  if ( isset($ctrl->inc->ide, $ctrl->post['url']) && !empty($ctrl->post['url']) ){
    $path = $ctrl->data_path('appui-ide').'backup/'.$ctrl->post['url'];
    $code= file_get_contents($path);

    if ( !empty($code) ){
      $ctrl->obj->data =[
        'success' => true,
        'code' => $code
      ];
    }
    else {
      $error = $ctrl->inc->ide->get_last_error();
      if ( $error === null ){
        $ctrl->obj->data =[
          'success' => false
        ];
      }
      else{
        $ctrl->obj->error = $error;
      }
    }
  }
}

