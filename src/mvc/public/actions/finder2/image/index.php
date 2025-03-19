<?php
//$img = BBN_DATA_PATH.'mails/img/logo-apst.jpg';
//$img = BBN_DATA_PATH.'test.png';
//$img = implode('/', $ctrl->arguments);
/*$tmp = ['BBN_DATA_PATH', 'test.png'];
$img = implode('/', $tmp);*/
$img = base64_decode($ctrl->arguments[0]);

$max_width = 450;
$max_height = 300;
$obj = new \bbn\File\Image($img);
$height = $obj->getHeight();
$width = $obj->getWidth();

if ( $obj->check() ){
  if ( ($width > $height) && ($width > $max_width) ){
    $obj->autoresize($max_width, $max_height);
  }
  elseif ( ($height > $width) && ($height > $max_height) ){
    $obj->autoresize($max_height, $max_width);
  }
  die($obj->display());
}
die(var_dump($img));