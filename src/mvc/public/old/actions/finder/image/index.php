<?php

//decode the url of the image
$img = base64_decode($ctrl->arguments[0]);

//the origin sent
$origin = $ctrl->arguments[1];

if ( isset($origin) && ( $p = $ctrl->inc->pref->get($origin)) ){
  $fields = ['path', 'host', 'user', 'type'];
  $cfg = [];
  foreach ( $fields as $f ){
    if ( isset($p[$f]) ){
      $cfg[$f] = $p[$f];
    }
  }
  if ($cfg['type'] !== 'local') {
  	$pwd = new bbn\Appui\Passwords($ctrl->db);
  	$cfg['pass'] = $pwd->userGet($p['id'], $ctrl->inc->user);
  }
  $fs = new \bbn\File\System($cfg['type'], $cfg);
  if ( !empty($cfg['path']) ){
    $fs->cd($cfg['path']);
  }

  if ( isset($fs) ){
    $max_width = 450;
    $max_height = 300;
    if ( $fs->getMode() === 'nextcloud' ){
      //if the mode of file system is nextcloud end the file exists in the file system die on the content of the file (base64)
      if ($content = $fs->getContents($img)){
        die($content);
      }
    }
    else{
      $file = $cfg['path'].'/'.$img;
      $obj = new \bbn\File\Image($file, $fs);
      $obj->display();
    }
    /*$height = $obj->getHeight();
    $width = $obj->getWidth();
    if ( ($width > $height) && ($width > $max_width) ){
      $obj->autoresize($max_width, $max_height);
    }
    elseif ( ($height > $width) && ($height > $max_height) ){
      $obj->autoresize($max_height, $max_width);
    }
    */
  }
}

