<?php

//decode the url of the image
$img = base64_decode($ctrl->arguments[0]);

//the origin sent
$origin = $ctrl->arguments[1];

if ( isset($origin) && ( $p = $ctrl->inc->pref->get($origin)) ){
  $fields = ['path', 'host', 'user', 'pass'];
  $cfg = [];
  foreach ( $fields as $f ){
    if ( isset($p[$f]) ){
      $cfg[$f] = $p[$f];
    }
  }
  //need of $fs in the class file\image
  $fs = new \bbn\file\system($p['type'], $cfg);
  
  if ( isset($fs) ){
    $max_width = 450;
    $max_height = 300;
    if ( $fs->get_mode() === 'nextcloud' ){
      //if the mode of file system is nextcloud end the file exists in the file system die on the content of the file (base64)
      if ( $fs->exists($fs->get_real_path($img)) &&  ($content = $fs->get_contents( $fs->get_real_path($img))) ){
        die($content);
      }
    }
    else{
      $file = $cfg['path'].'/'.$img;
      $obj = new \bbn\file\image($file, $fs);
      $obj->display();
    }
    /*$height = $obj->get_height();
    $width = $obj->get_width();
    if ( ($width > $height) && ($width > $max_width) ){
      $obj->autoresize($max_width, $max_height);
    }
    else if ( ($height > $width) && ($height > $max_height) ){
      $obj->autoresize($max_height, $max_width);
    }
    */
  }
  
}

