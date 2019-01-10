<?php
/** @var $model \bbn\mvc\model */
if ( isset($model->data['routes'], $model->inc->ide) ){
  $repos = $model->inc->ide->repositories();
  $current_rep = 'BBN_APP_PATH/';
  $types = [];
  $tabs = [];
  if ( isset($repos[$current_rep]['types']) ){
    $types = $repos[$current_rep]['types'];
  }
  if ( !empty($types) && is_array($types) ){
    foreach($types as $type){
      //temporaney
      $type['url'] = $type['url'] === 'lib' ? 'cls' : $type['url'];
      if ( $ptype = $model->inc->options->option($model->inc->options->from_code($type['url'],'PTYPES', 'ide', BBN_APPUI)) ){

        if ( !empty($ptype['tabs']) ){
          $tabs[$type['url']][] = $ptype['tabs'];
        }
        else if ( ($type['url'] === 'cls') && empty($ptype['tabs']) && !empty($ptype['extensions']) ){
          $tabs['lib']['extensions'] = $ptype['extensions'];
        }
      }
    }


    $projects = [
      'tabs_type' => $tabs,
      'roots' => array_map( function($val){
        return [
          'text' => $val['url'],
          'value' => $val['url']
        ];
      },$types)
    ];

  }

  if ( $model->inc->session->has('ide', 'repository') ){
    $current_rep = $model->inc->session->get('ide', 'repository');
  }


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
    'projects' => $projects,
    'theme' => empty($ide_cfg['theme']) ? '' : $ide_cfg['theme'],
    'font' => empty($ide_cfg['font']) ? '' : $ide_cfg['font'],
    'font_size' => empty($ide_cfg['font_size']) ? '' : $ide_cfg['font_size'],
    'default_repository' => 'BBN_APP_PATH/'
  ];
}
