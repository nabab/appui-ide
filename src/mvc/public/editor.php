<?php
/** @var $ctrl \bbn\mvc\controller */
$routes = $ctrl->get_routes();
$model = $ctrl->get_model(['routes' => $routes]);
$list = [];
$sess = [];
$current_dir = false;
$dirs = new \bbn\ide\directories($ctrl->inc->options, $routes);

// We define ide array in session
if ( !$ctrl->inc->session->has('ide') ){
  $ctrl->inc->session->set([
    'list' => $list
  ], 'ide');
}

// Routes
foreach ( $model['dirs'] as $i => $dir ){
  foreach ( $routes as $k => $r ){
    if ( strpos($dirs->decipher_path($i), $r) === 0 ){
      $model['dirs'][$i]['route'] = $k;
    }
  }
}

// Restore files stored in session
foreach ( $ctrl->inc->session->get('ide', 'list') as $l ){
  $dirfile = $dirs->dir_from_url($l);
  if ( $tmp = $ctrl->get_model('./load', [
    'dir' => $dirfile,
    'file' => substr($l, strlen($dirfile), strlen($l)),
    'routes' => $routes
  ]) ){
    if ( !isset($tmp['error']) ){
      array_push($list, $tmp);
      array_push($sess, $l);
    }
  }
}

$ctrl->inc->session->set($sess, 'ide', 'list');

if ( !$current_dir && $ctrl->inc->session->has('ide', 'dir') ){
  $current_dir = $ctrl->inc->session->get('ide', 'dir');
}

$ide_cfg = $ctrl->inc->user->get_cfg('ide');

echo $ctrl
    ->set_title("IDE")
    ->add_js('./functions', [
      'dirs' => $model['dirs'],
      'root' => $ctrl->say_dir().'/',
      'baseURL' => $ctrl->say_path().'/',
      'theme' => empty($ide_cfg['theme']) ? '' : $ide_cfg['theme'],
      'font' => empty($ide_cfg['font']) ? '' : $ide_cfg['font'],
      'font_size' => empty($ide_cfg['font_size']) ? '' : $ide_cfg['font_size']
    ])
    ->add_js([
      'menu' => $model['menu'],
      'config' => $list,
      'dirs' => $model['dirs'],
      'root' => $ctrl->say_dir().'/',
      'url' => implode('/', $ctrl->params),
      'current_dir' => $current_dir ? $current_dir : $model['default_dir']
    ])
    ->get_view().$ctrl->get_less();
$ctrl->obj->url = 'ide/editor';