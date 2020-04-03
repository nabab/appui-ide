<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/07/2017
 * Time: 15:04
 *
 * @var $model \bbn\mvc\model
 */

if ( !empty($model->data['url']) && isset($model->inc->ide) ){

  $url = $model->data['url'];
 
  //die(var_dump($model->data['url']));
  $rep = $model->inc->ide->repository_from_url($model->data['url']);
  
  $file = $model->inc->ide->url_to_real($model->data['url']);
  $route = '';

  //define the route for use in test code
  foreach ( $model->data['routes'] as $i => $r ){
    if ( strpos($file, $r['path']) === 0 ){
      $route = $i;
      break;
    }
  }
  $path = str_replace($rep, '' , $url);
  $path = substr($path, 0, strpos($path, '/_end_'));

  $repos = $model->inc->ide->get_repositories();
  $repository = $repos[$rep];

  $f = $model->inc->ide->decipher_path($model->data['url']);
  //die(var_dump($f,$file, $model->data['url']));
  if ( is_array($repository) &&
    !empty($model->inc->ide->is_project($model->data['url'])) ||
    !empty($repository['project'])
  ){
    $tabs = [];
    $styleTabType = [];
    $project = $model->inc->ide->get_type('bbn-project');
    if ( is_array($project) && (count($project) > 0) ){
      foreach( $project['types'] as $type ){
        $styleTabType[$type['url']] = [
          'bcolor' => $type['bcolor'],
          'fcolor' => $type['fcolor'],
          'icon' => $type['icon'],
          'menu' => [
            'text' => "ded",
            'icon' => 'nf nf fa-code',
            'items' => []
          ]
        ];
        //temporaney
        $typeRep = $type['url'] = $type['url'] === 'lib' ? 'cls' : $type['url'];

        if ( $ptype = $model->inc->ide->get_type($typeRep) ){
          if ( !empty($ptype['tabs']) ){
            $tabs[$type['url']][] = $ptype['tabs'];
          }
          elseif ( ($type['url'] === 'cls') && empty($ptype['tabs']) && !empty($ptype['extensions']) ){
            $tabs['lib']['extensions'] = $ptype['extensions'];
          }
        }
      }
      $repository['tabs'] = $tabs;
    }
  }

  //model->data['url'] = implode("/", $stepUrl);
  if ( strpos($model->data['url'],'_end_/settings') !== false ){
    $url_settings = substr($model->data['url'], 0, strpos($model->data['url'],'_end_/settings')).'_end_/'.($repository['alias_code'] !== 'components' ? "php" : 'js');
    $ctrl_file = $model->inc->ide->url_to_real($url_settings);
  }

  $res = [
    'isMVC' => $model->inc->ide->is_MVC_from_url(str_replace('/_end_', '', $url)),
    'isComponent' => $model->inc->ide->is_component_from_url(str_replace('/_end_', '', $url)),
    'isLib' => $model->inc->ide->is_lib_from_url(str_replace('/_end_', '', $url)),
    'isCli' => $model->inc->ide->is_cli_from_url(str_replace('/_end_', '', $url)),
    //'type' => !empty($type) ? $type : null,
    'title' => $path,
    'path' => $path,
    'repository' => $rep,
    'repository_content' => $repository,
    'url' => $rep.$path.'/_end_',
    'route' => $route,
    'settings' => !empty($ctrl_file) ? $model->inc->fs->is_file($ctrl_file) : false,
    'ext' => \bbn\str::file_ext($file),
    'styleTab' => isset($styleTabType) ? $styleTabType : []
  ];

  if ( $res['isComponent'] && !empty($repository['types']) ){
    $res['tabs'] = $model->inc->ide->tabs_of_type_project('components');
    $title = explode("/", $path);
    if ( is_array($title) ){
      array_pop($title);
      $res['title'] = implode('/', $title);
    }
  }
  if ( $res['isMVC'] && !empty($repository['types']) ){
    $res['tabs'] = $model->inc->ide->tabs_of_type_project('mvc');
  }
  // we check if some tab of the components or mvc do not contain any files
  if ( $res['isMVC'] === true ){
    $res['emptyTabs'] = $model->inc->ide->list_tabs_with_file('mvc', $path, $rep);
  }
  elseif ( $res['isComponent'] === true ){
    $res['emptyTabs'] = $model->inc->ide->list_tabs_with_file('components',  $path, $rep);
  }

  return $res;
}
return false;
