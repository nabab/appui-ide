<?php
/** @var $this \bbn\mvc\controller */

$model = $this->get_model();
$list = [];
$current_dir = false;

// We define ide array in session
if ( !isset($_SESSION[BBN_SESS_NAME]['ide']) ){
  $_SESSION[BBN_SESS_NAME]['ide'] = [
    'list' => $list
  ];
}

if ( count($this->arguments) && isset($model['dirs'][$this->arguments[0]]) ){
  $current_dir = $this->arguments[0];
  if ( isset($model['dirs'][$this->arguments[0]]['tabs']) ){
    $found = false;
    $def = false;
    foreach ( $model['dirs'][$this->arguments[0]]['tabs'] as $t ){
      if ( !empty($t['default']) ){
        $def = $t;
      }
      if ( isset($this->arguments[1]) && ($t['url'] === $this->arguments[1]) ){
        $current_dir .= '/'.$t['url'];
        $found = 1;
        break;
      }
    }
    if ( !$found && $def ){
      $current_dir .= '/'.$def;
    }
  }
}

if ( empty($_SESSION[BBN_SESS_NAME]['ide']['list']) ){
  $_SESSION[BBN_SESS_NAME]['ide']['list'] = [];
}
else{
  foreach ( $_SESSION[BBN_SESS_NAME]['ide']['list'] as $l ){
    $this->data = $l;
    if ( $tmp = $this->get_model('./load') ){
      array_push($list, $tmp);
    }
  }
}

if ( !$current_dir && isset($_SESSION[BBN_SESS_NAME]['ide']['dir']) ){
  $current_dir = $_SESSION[BBN_SESS_NAME]['ide']['dir'];
}

$ide_cfg = $this->inc->user->get_cfg('ide');

echo $this
    ->set_title("IDE")
    ->add_js('./functions', [
      'dirs' => $model['dirs'],
      'root' => $this->say_dir().'/',
      'theme' => !empty($ide_cfg['theme']) ? $ide_cfg['theme'] : '',
      'font' => !empty($ide_cfg['font']) ? $ide_cfg['font'] : '',
      'font_size' => !empty($ide_cfg['font_size']) ? $ide_cfg['font_size'] : ''
    ])
    ->add_js([
      'menu' => $model['menu'],
      'config' => $list,
      'dirs' => $model['dirs'],
      'root' => $this->say_dir().'/',
      'url' => implode('/', $this->params),
      'current_dir' => $current_dir ? $current_dir : $model['default_dir']
    ])
    ->get_view().$this->get_less();