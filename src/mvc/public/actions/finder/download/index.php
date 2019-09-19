<?php


die('f');



  $success = false;
  $dest = $ctrl->tmp_path().$value;
  $path = $path.'/'.$value;
  
  $fs = new \bbn\file\system();
  
  $file = $fs->download($path);
  
  
  //$ctrl->obj->data = $file;
  $ctrl->obj->file = $file;



