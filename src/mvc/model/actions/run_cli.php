<?php
$res = ['success' => false];
if ( $model->data['file'] ){
  $timer = new \bbn\Util\Timer();
  $timer->start();
  exec('cd '.$model->appPath().';php -f router.php '.$model->data['file'].';' );
  $res['time'] = $timer->measure();
  $res['success'] = 1;
  $res['file'] = $model->data['file'];
  if ( \is_array($r) ){
    $res['output'] = '';
    foreach ( $r as $s ){
      $res['output'] .= '<div class="bbn-form-full">'.nl2br($s, false).'</div>'.PHP_EOL;
    }
  }

}

return $res;