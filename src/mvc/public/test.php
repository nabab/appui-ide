<?php
//$old_path = getcwd();
//chdir(BBN_ROOT_PATH);
if ( BBN_IS_DEV || $_SESSION[BBN_SESS_NAME]['user']['id'] === 38 ){
  if ( isset($this->post['code']) && strlen($this->post['code']) > 5 ){
    $c = $this->post['code'];
    $_SESSION[BBN_SESS_NAME]['code'] = $c;
    $opening = strpos($c, '<?php');
    $closing = strrpos($c, '?>');
    $num_open = preg_match_all('#<\\?php[\\s+]#', $c);
    $num_close = preg_match_all('#[\\s+]\\?>#', $c);
    if ( $opening === false ){
      $c = ' ?>'.$c.'<?php ';
    }
    else{
      if ( $opening > 0 ){
        $c = ' ?>'.$c;
      }
      else{
        $c = substr($c, 5);
      }
      if ( substr($c, -2) === '?>' ){
        $c = substr($c, 0, -2);
      }
      else{
        if ( $num_open === $num_close ){
          $c = $c.'<?php ';
        }
      }
    }
    if ( isset($s['dir']) && is_dir($s['dir']) ){
      chdir($s['dir']);
    }
    echo '<p>Current directory :'.getcwd().'</p>';
    echo '<p><a onclick="appui.f.closeAlert(); setTimeout(function(){appui.ide.test()}, 2000);" href="javascript:;">Refresh</a></p>';
    $t = new \bbn\util\timer();
    $t->start();
    ob_start();
    try{
      eval($c);
    }
    catch ( Exception $e ){
      die(var_dump($e));
      echo 'Error!';
    }
    $t->stop();
    $res = ob_get_contents();
    ob_end_clean();
    echo '<p>Time for processing: '.$t->result()['total'].' sec.</p>';
    echo $res;
    $this->set_title("Testing code...");
  }
  else{
    echo "Fichier incorrect !";
  }
}
else{
  echo "Impossible in production environment!";
}
