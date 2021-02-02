<?php
/** @var $model \bbn\Mvc\Model */

if ( isset($model->data['routes'], $model->inc->ide) ){

  $repos = $model->inc->ide->getRepositories();
  $origin = $model->inc->ide->getOrigin();
  $project = $model->inc->ide->getNameProject();

  $prefix = $model->pluginUrl($model->inc->ide->getOrigin());
  if ( $origin !== 'appui-ide' ){
    $prefix .= '/router/'.$project.'/ide/editor';
  }


  $current_rep =  $model->inc->ide->getDefaultRepository();
  $types = [];
  $tabs = [];
  if ( isset($repos[$current_rep]['types']) ){
    $types = $repos[$current_rep]['types'];
  }
  if ( !empty($types) && is_array($types) ){
    foreach($types as $type){
      //temporaney
      $type['url'] = $type['url'] === 'lib' ? 'cls' : $type['url'];
      if ( $ptype = $model->inc->ide->getType($type['url']) ){
        if ( !empty($ptype['tabs']) ){
          $tabs[$type['url']][] = $ptype['tabs'];
        }
        elseif ( ($type['url'] === 'cls') && empty($ptype['tabs']) && !empty($ptype['extensions']) ){
          $tabs['lib']['extensions'] = $ptype['extensions'];
        }
        elseif ( ($type['url'] === 'cli') && empty($ptype['tabs']) && !empty($ptype['extensions']) ){
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
 // temporaney disabled
  /*if ( $model->inc->session->has('ide', 'repository') ){
    $current_rep = $model->inc->session->get('ide', 'repository');
  }*/
  $ide_cfg = $model->inc->user->getCfg('ide');
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

  $current_theme= $model->inc->ide->getTheme();

  return [
    'staticPath' => BBN_STATIC_PATH,
    'config' => [],
    'project' => $project,
    'prefix' => $prefix,
    'repositories' => $repos,
    'root' => APPUI_IDE_ROOT,
    'currentRep' => $current_rep,
    'projects' => $projects ?? [],
    'theme' => is_null(array_search($current_theme, $themes)) ? '' : $current_theme,
    'themes' => $themes,
    'font' => empty($ide_cfg['font']) ? '' : $ide_cfg['font'],
    'font_size' => empty($ide_cfg['font_size']) ? '' : $ide_cfg['font_size'],
    'default_repository' => 'app/main'
  ];
}