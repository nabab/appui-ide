<?php
/** @var $model \bbn\mvc\model */
if ( isset($model->data['routes'], $model->inc->ide) ){
  $current_rep = 'BBN_APP_PATH/mvc/';
  if ( $model->inc->session->has('ide', 'repository') ){
    $current_rep = $model->inc->session->get('ide', 'repository');
  }

  $repos = $model->inc->ide->repositories();
  // Routes
  foreach ( $repos as $i => $dir ){
    foreach ( $model->data['routes'] as $k => $r ){
      if ( strpos($model->inc->ide->decipher_path($i), $r['path']) === 0 ){
        $repos[$i]['route'] = $k;
      }
    }
  }
  
  $ide_cfg = $model->inc->user->get_cfg('ide');
  
  return [
    'config' => [],
    'repositories' => $repos,
    'root' => APPUI_IDE_ROOT,
    'currentRep' => $current_rep,
    'theme' => empty($ide_cfg['theme']) ? '' : $ide_cfg['theme'],
    'font' => empty($ide_cfg['font']) ? '' : $ide_cfg['font'],
    'font_size' => empty($ide_cfg['font_size']) ? '' : $ide_cfg['font_size'],
    'default_repository' => $current_rep
  ];
}