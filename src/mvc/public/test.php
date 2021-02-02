<?php
//$old_path = getcwd();
//chdir(BBN_ROOT_PATH);
if ( BBN_IS_DEV || $ctrl->inc->user->isDev() ){
  if ( isset($ctrl->post['code']) && (\strlen($ctrl->post['code']) > 5) ){
    $bbn_code = $ctrl->post['code'];
    $_SESSION[BBN_APP_NAME]['code'] = $bbn_code;
    $bbn_opening = strpos($bbn_code, '<?php');
    $bbn_closing = strrpos($bbn_code, '?>');
    $bbn_num_open = preg_match_all('#<\\?php[\\s+]#', $bbn_code);
    $bbn_num_close = preg_match_all('#[\\s+]\\?>#', $bbn_code);
    if ( $bbn_opening === false ){
      $bbn_code = ' ?>'.$bbn_code.'<?php ';
    }
    else{
      if ( $bbn_opening > 0 ){
        $bbn_code = ' ?>'.$bbn_code;
      }
      else{
        $bbn_code = substr($bbn_code, 5);
      }
      if ( substr($bbn_code, -2) === '?>' ){
        $bbn_code = substr($bbn_code, 0, -2);
      }
      else{
        if ( $bbn_num_open === $bbn_num_close ){
          $bbn_code = $bbn_code.'<?php ';
        }
      }
    }
    if ( isset($ctrl->post['dir']) && $ctrl->inc->fs->isDir($ctrl->post['dir']) ){
      chdir($ctrl->post['dir']);
    }
    echo '<p>'._("Current:"). ' '.(!empty($ctrl->post['file']) ? $ctrl->post['file'] : getcwd()).'</p>';
    echo '<p><a onclick="bbn.fn.closePopup(); setTimeout(function(){bbn.ide.test()}, 2000);" href="javascript:;">Refresh</a></p>';
    $bbn_timer = new \bbn\Util\Timer();
    $bbn_timer->start();
    ob_start();
    try{
      eval($bbn_code);
    }
    catch ( Exception $e ){
      die(var_dump($e));
      echo 'Error!';
    }
    $bbn_timer->stop();
    $bbn_res = ob_get_contents();
    ob_end_clean();
    echo '<p>Time for processing: '.$bbn_timer->result()['total'].' sec.</p>';
    echo $bbn_res;
    $ctrl->setTitle("Testing code...");
  }
  else{
    echo "Fichier incorrect !";
  }
}
else{
  echo "Impossible in production environment!";
}
