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
      // if ( $ptype = $model->inc->options->option($model->inc->options->from_code($type['url'],'PTYPES', 'ide', BBN_APPUI)) ){
      if ( $ptype = $model->inc->ide->get_type($type['url']) ){
        if ( !empty($ptype['tabs']) ){
          $tabs[$type['url']][] = $ptype['tabs'];
        }
        else if ( ($type['url'] === 'cls') && empty($ptype['tabs']) && !empty($ptype['extensions']) ){
          $tabs['lib']['extensions'] = $ptype['extensions'];
        }
        else if ( ($type['url'] === 'cli') && empty($ptype['tabs']) && !empty($ptype['extensions']) ){
          $tabs[$type['url']]['extensions'] = $ptype['extensions'];
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

  if ( $model->inc->session->has('ide2', 'repository') ){
    $current_rep = $model->inc->session->get('ide2', 'repository');
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
  $themes =  [
    'default',
    '3024-day',
    '3024-night',
    'abcdef',
    'ambiance',
    'ayu-dark',
    'ayu-mirage',
    'base16-dark',
    'base16-light',
    'bespin',
    'blackboard',
    'cobalt',
    'colorforth',
    'darcula',
    'dracula',
    'duotone-dark',
    'duotone-light',
    'eclipse',
    'elegant',
    'erlang-dark',
    'gruvbox-dark',
    'hopscotch',
    'icecoder',
    'idea',
    'isotope',
    'lesser-dark',
    'liquibyte',
    'lucario',
    'material',
    'material-darker',
    'material-palenight',
    'material-ocean',
    'mbo',
    'mdn-like',
    'midnight',
    'monokai',
    'moxer',
    'neat',
    'neo',
    'night',
    'nord',
    'oceanic-next',
    'panda-syntax',
    'paraiso-dark',
    'paraiso-light',
    'pastel-on-dark',
    'railscasts',
    'rubyblue',
    'seti',
    'shadowfox',
    'solarized dark',
    'solarized light',
    'the-matrix',
    'tomorrow-night-bright',
    'tomorrow-night-eighties',
    'ttcn',
    'twilight',
    'vibrant-ink',
    'xq-dark',
    'xq-light',
    'yeti',
    'yonce',
    'zenburn'
  ];

  return [
    'staticPath' => BBN_STATIC_PATH,
    'config' => [],
    'repositories' => $repos,
    'root' => APPUI_IDE_ROOT,
    'currentRep' => $current_rep,
    'projects' => $projects,
    'theme' => empty($ide_cfg['theme']) ? '' : $ide_cfg['theme'],
    'themes' => $themes,
    'font' => empty($ide_cfg['font']) ? '' : $ide_cfg['font'],
    'font_size' => empty($ide_cfg['font_size']) ? '' : $ide_cfg['font_size'],
    'default_repository' => 'BBN_APP_PATH/'
  ];
}
