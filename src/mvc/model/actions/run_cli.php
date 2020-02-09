<?php
$res = ['success' => false];
if ( $model->data['file'] ){
  $timer = new \bbn\util\timer();
  $timer->start();
  exec('cd '.$model->app_path().';php -f router.php '.$model->data['file'].';' );
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