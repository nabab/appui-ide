<?php
/* @var $this \bbn\mvc */

$model = $this->get_model();
$list = [];
$current_dir = false;

if ( !isset($_SESSION[BBN_SESS_NAME]['ide']) ){
  $_SESSION[BBN_SESS_NAME]['ide'] = [
    'list' => $list
  ];
}

if ( (count($this->arguments) > 1) && isset($model['dirs'][$this->arguments[0]]) ){
  $current_dir = $this->arguments[0];
}

if ( empty($_SESSION[BBN_SESS_NAME]['ide']['list']) ){
  $_SESSION[BBN_SESS_NAME]['ide']['list'] = [];
}
foreach ( $_SESSION[BBN_SESS_NAME]['ide']['list'] as $l ){
  $this->data = $l;
  if ( $tmp = $this->get_model('./load') ){
    array_push($list, $tmp);
  }
}

$dirs = [];
foreach ( $model['dirs'] as $k => $v ){
  array_push($dirs, [
    'value' => $k,
    'text' => $v['name'],
    'bcolor' => $v['bcolor'],
    'fcolor' => $v['fcolor'],
    'files' => $v['files'],
    'def' => empty($v['def']) ? false : $v['def']
  ]);
}

// We define ide array in session
if ( !isset($_SESSION[BBN_SESS_NAME]['ide']) ){
  $_SESSION[BBN_SESS_NAME]['ide'] = [
    'list' => $list
  ];
}

if ( !$current_dir && isset($_SESSION[BBN_SESS_NAME]['ide']['dir']) ){
  $current_dir = $_SESSION[BBN_SESS_NAME]['ide']['dir'];
}

$ide_cfg = $this->inc->user->get_cfg('ide');

$this->data = \bbn\tools::merge_arrays($model, [
  'config' => json_encode($list),
  'url' => implode('/',$this->params),
  'current_dir' => $current_dir ? $current_dir : $model['default_dir'],
  'theme' => !empty($ide_cfg['theme']) ? $ide_cfg['theme'] : '',
  'font' => !empty($ide_cfg['font']) ? $ide_cfg['font'] : '',
  'font_size' => !empty($ide_cfg['font_size']) ? $ide_cfg['font_size'] : ''
]);

echo $this
  ->set_title("IDE")
  ->add_js('./functions', [
    'dirs' => $dirs,
    'root' => $this->say_dir().'/'
  ])
  ->add_js([
    'menu' => $model['menu'],
    'config' => $list,
    'dirs' => $dirs,
    'root' => $this->say_dir().'/',
    'url' => implode('/',$this->params),
    'current_dir' => $current_dir ? $current_dir : $model['default_dir'],
    'theme' => !empty($ide_cfg['theme']) ? $ide_cfg['theme'] : '',
    'font' => !empty($ide_cfg['font']) ? $ide_cfg['font'] : '',
    'font_size' => !empty($ide_cfg['font_size']) ? $ide_cfg['font_size'] : ''
  ])
  ->get_view();
