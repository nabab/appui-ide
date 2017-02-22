<?php
/** @var $ctrl \bbn\mvc\controller */
if ( empty($ctrl->baseURL) ){
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
  foreach ( $model['dirs'] as $i => $dir ){
    foreach ( $ctrl->data['routes'] as $k => $r ){
      if ( strpos($ctrl->inc->ide->decipher_path($i), $r) === 0 ){
        $model['dirs'][$i]['route'] = $k;
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

  if ( !$current_rep && $ctrl->inc->session->has('ide', 'dir') ){
    $current_rep = $ctrl->inc->session->get('ide', 'dir');
  }

  $ide_cfg = $ctrl->inc->user->get_cfg('ide');

  $ctrl->data['shared_path'] = BBN_SHARED_PATH;

  echo $ctrl
      ->set_title("IDE")
      /*->add_js('./functions', [
        'dirs' => $model['dirs'],
        'root' => $ctrl->data['root'],
        'baseURL' => $ctrl->say_path().'/',
        'theme' => empty($ide_cfg['theme']) ? '' : $ide_cfg['theme'],
        'font' => empty($ide_cfg['font']) ? '' : $ide_cfg['font'],
        'font_size' => empty($ide_cfg['font_size']) ? '' : $ide_cfg['font_size']
      ])*/
      ->add_js([
        'config' => $list,
        'repositories' => $model['dirs'],
        'root' => $ctrl->data['root'],
        'url' => implode('/', $ctrl->params),
        'baseURL' => $ctrl->say_path().'/',
        'currentRep' => $current_rep ? $current_rep : $model['default_dir'],
        'theme' => empty($ide_cfg['theme']) ? '' : $ide_cfg['theme'],
        'font' => empty($ide_cfg['font']) ? '' : $ide_cfg['font'],
        'font_size' => empty($ide_cfg['font_size']) ? '' : $ide_cfg['font_size']
      ])
      ->get_view().$ctrl->get_less();
  $ctrl->obj->url = $ctrl->data['root'].'editor';
}
else{
  /*
  $dirs = new \bbn\ide\directories($ctrl->inc->options, $ctrl->get_routes());
  //$dir = array_shift($ctrl->arguments);
  $tab = array_pop($ctrl->arguments);
  $url = implode('/', $ctrl->arguments);
  // Case where it's a new file and we need to provide the tabNav info
  if ( strpos($url, $ctrl->baseURL) === false ){
    if ( $dir = $dirs->dir_from_url($url) ){
      $info = $dirs->dir($dir);
      $ctrl->obj = $dirs->load($url, $dir, $tab, $ctrl->inc->pref);
    }
  }
  // Case where the tabnav is already loaded and we just provide the data
  else{
    $res = $dirs->load($url, $dir, $tab, $ctrl->inc->pref);
  }
  */
  /*
  \bbn\x::hdump(
    $res,
    $ctrl->arguments,
    $ctrl->baseURL,
    $ctrl->say_path(),
    $ctrl->say_dir(),
    $ctrl->say_local_path(),
    $ctrl->say_local_route(),
    $ctrl->say_controller(),
    $ctrl->say_all()
  );
  if ( $res = $dirs->load($ctrl->post['file'], $ctrl->post['dir'], (empty($ctrl->post['tab']) ? false : $ctrl->post['tab']), $ctrl->inc->pref) ){
    $ctrl->obj = $res;
  }
  else{
    $ctrl->obj->data = ['error' => $dirs->get_last_error()];
  }
  */
}