<?php
$old_path = getcwd();
chdir(BBN_ROOT_PATH);
if ( \count($ctrl->params) > 2 ){
  $p = \array_slice($ctrl->params, 2);
  $file = implode('/', $p);
  echo $file;
  if ( $ctrl->inc->fs->exists($file) ){
    global $bbn;
    if ( strpos(basename($file), '.') === false ){
      $ctrl->obj->ext = '';
    }
    else{
      $ctrl->obj->ext = strtolower(substr($file, strrpos($file, '.') + 1));
    }
    if ( \in_array($ctrl->obj->ext, $bbn->vars['viewable']) ){
      $ctrl->obj->file = basename($file);
      switch ( $ctrl->obj->ext ){
        default:
          $ctrl->obj->code = file_get_contents($file, TRUE);
          break;
        /*
        case 'php':
          $ctrl->obj->code = file_get_contents($file,TRUE);
          $ctrl->obj->code .= print_r(token_get_all($o->code),1);
          break;
        */
      }
    }
  }
}
else{
  echo "Fichier incorrect !";
}
chdir($old_path);
