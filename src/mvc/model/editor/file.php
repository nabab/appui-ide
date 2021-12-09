<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/07/2017
 * Time: 15:04
 */

use bbn\X;

/**
 * @var $model \bbn\Mvc\Model
 */
if ( !empty($model->data['url']) && isset($model->inc->ide) ){


  $url = $model->data['url'];
 
  //die(var_dump($model->data['url']));
  $rep = $model->inc->ide->repositoryFromUrl($model->data['url']);
  
  $file = $model->inc->ide->urlToReal($model->data['url']);
  $route = '';
  //X::ddump("FILE", $file, $model->data['url'], $rep);

  //define the route for use in test code
  foreach ( $model->data['routes'] as $i => $r ){
    if ( strpos($file, $r['path']) === 0 ){
      $route = $i;
      break;
    }
  }
  $path = str_replace($rep, '' , $url);
  $path = substr($path, 0, Strpos($path, '/_end_'));

  $repos = $model->inc->ide->getRepositories();
  $repository = $repos[$rep];

  $f = $model->inc->ide->decipherPath($model->data['url']);
  //die(var_dump($f,$file, $model->data['url']));
  if ( is_array($repository) &&
    !empty($model->inc->ide->isProject($model->data['url'])) ||
    !empty($repository['project'])
  ){
    $tabs = [];
    $styleTabType = [];
    $project = $model->inc->ide->getType('bbn-project');
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

        if ( $ptype = $model->inc->ide->getType($typeRep) ){
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
    $url_settings = substr($model->data['url'], 0, Strpos($model->data['url'],'_end_/settings')).'_end_/'.($repository['alias_code'] !== 'components' ? "php" : 'js');
    $ctrl_file = $model->inc->ide->urlToReal($url_settings);
  }

  $res = [
    'isMVC' => $model->inc->ide->isMVCFromUrl(str_replace('/_end_', '', $url)),
    'isComponent' => $model->inc->ide->isComponentFromUrl(str_replace('/_end_', '', $url)),
    'isLib' => $model->inc->ide->isLibFromUrl(str_replace('/_end_', '', $url)),
    'isCli' => $model->inc->ide->isCliFromUrl(str_replace('/_end_', '', $url)),
    //'type' => !empty($type) ? $type : null,
    'title' => $path,
    'path' => $path,
    'repository' => $rep,
    'repository_content' => $repository,
    'url' => $rep.$path.'/_end_',
    'route' => $route,
    'settings' => !empty($ctrl_file) ? $model->inc->fs->isFile($ctrl_file) : false,
    'ext' => \bbn\Str::fileExt($file),
    'styleTab' => isset($styleTabType) ? $styleTabType : []
  ];

  if ( $res['isComponent'] && !empty($repository['types']) ){
    $res['tabs'] = $model->inc->ide->tabsOfTypeProject('components');
    $title = explode("/", $path);
    if ( is_array($title) ){
      array_pop($title);
      $res['title'] = implode('/', $title);
    }
  }
  if ( $res['isMVC'] && !empty($repository['types']) ){
    $res['tabs'] = $model->inc->ide->tabsOfTypeProject('mvc');
  }
  // we check if some tab of the components or mvc do not contain any files
  if ( $res['isMVC'] === true ){
    $res['emptyTabs'] = $model->inc->ide->listTabsWithFile('mvc', $path, $rep);
  }
  elseif ( $res['isComponent'] === true ){
    $res['emptyTabs'] = $model->inc->ide->listTabsWithFile('components',  $path, $rep);
  }

  return $res;
}
return false;
