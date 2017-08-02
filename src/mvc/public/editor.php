<?php
/** @var $ctrl \bbn\mvc\controller */

$model = $ctrl->get_model();
$list = [];
$sess = [];
$current_rep = false;

// We define ide array in session
if ( !$ctrl->inc->session->has('ide') ){
  $ctrl->inc->session->set([
    'list' => $list
  ], 'ide');
}

// Routes
foreach ( $model['repositories'] as $i => $dir ){
  foreach ( $ctrl->data['routes'] as $k => $r ){
    if ( strpos($ctrl->inc->ide->decipher_path($i), $r) === 0 ){
      $model['repositories'][$i]['route'] = $k;
    }
  }
}

/*
// Restore files stored in session
foreach ( $ctrl->inc->session->get('ide', 'list') as $l ){
  $dirfile = $dirs->dir_from_url($l);
  if ( $tmp = $ctrl->get_model('./load', [
    'dir' => $dirfile,
    'file' => substr($l, strlen($dirfile), strlen($l)),
    'routes' => $ctrl->data['routes']
  ])
  ){
    if ( !isset($tmp['error']) ){
      array_push($list, $tmp);
      array_push($sess, $l);
    }
  }
}
*/

$ctrl->inc->session->set($sess, 'ide', 'list');

if ( !$current_rep && $ctrl->inc->session->has('ide', 'repository') ){
  $current_rep = $ctrl->inc->session->get('ide', 'repository');
}

$ide_cfg = $ctrl->inc->user->get_cfg('ide');

$ctrl->data['shared_path'] = BBN_SHARED_PATH;

echo $ctrl
  ->set_title("IDE")
  ->add_js([
    'config' => $list,
    'repositories' => $model['repositories'],
    'root' => APPUI_IDE_ROOT,
    //'url' => implode('/', $ctrl->params),
    //'baseURL' => $ctrl->say_path().'/',
    'currentRep' => $current_rep ? $current_rep : $model['default_repository'],
    'theme' => empty($ide_cfg['theme']) ? '' : $ide_cfg['theme'],
    'font' => empty($ide_cfg['font']) ? '' : $ide_cfg['font'],
    'font_size' => empty($ide_cfg['font_size']) ? '' : $ide_cfg['font_size']
  ])
  ->get_view();
$ctrl->obj->css = $ctrl->get_less();
$ctrl->obj->url = APPUI_IDE_ROOT.'editor';