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
  $rep = $model->inc->ide->repository_from_url($model->data['url']); 
  $file = $model->inc->ide->url_to_real($model->data['url']);  
  $route = '';
  foreach ( $model->data['routes'] as $i => $r ){
    if ( strpos($file, $r['path']) === 0 ){
      $route = $i;
    }
  }
  $path = str_replace($rep, '' , $url);
  $path = substr($path, 0, strpos($path, '/_end_'));
 
  $repos = $model->inc->ide->repositories();
  $repository = $repos[$rep];
  $f = $model->inc->ide->decipher_path($model->data['url']);
 
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
          'icon' => $type['icon']
        ];
        //temporaney
        $typeRep = $type['url'] = $type['url'] === 'lib' ? 'cls' : $type['url'];        
        // if ( $ptype = $model->inc->options->option($model->inc->options->from_code($typeRep,'PTYPES', 'ide', BBN_APPUI)) ){
        if ( $ptype = $model->inc->ide->get_type($typeRep) ){
          if ( !empty($ptype['tabs']) ){
            $tabs[$type['url']][] = $ptype['tabs'];
          }
          else if ( ($type['url'] === 'cls') && empty($ptype['tabs']) && !empty($ptype['extensions']) ){
            $tabs['lib']['extensions'] = $ptype['extensions'];
          }
        }
      }
      $repository['tabs'] = $tabs;
    }
  }
  $arr = explode("/",$model->data['url']);
  
  if ( is_array($arr) ){
    array_pop($arr);
    array_pop($arr);
    $arr[] = $repository['alias_code'] !== 'components' ? "php" : 'js';
    if (!empty($i = array_search('src', $arr)) ){
      $type= $arr[$i+1];
    }
    $ctrl_file = $model->inc->ide->url_to_real(implode("/", $arr));
  }

  $is_mvc = $model->inc->ide->is_MVC_from_url(str_replace('/_end_', '', $url));
  $is_component = $model->inc->ide->is_component_from_url(str_replace('/_end_', '', $url));  
  $res = [
    'isMVC' => $is_mvc,
    'isComponent' => $is_component,
    'type' => !empty($type) ? $type : null,
    'title' => $path,
    'path' => $path,
    'repository' => $rep,
    'repository_content' => $repository,
    'url' => $rep.$path.'/_end_',
    'route' => $route,
    'settings' => !empty($ctrl_file) ? is_file($ctrl_file) : false,
    'ext' => \bbn\str::file_ext($file),
    'styleTab' => isset($styleTabType) ? $styleTabType : []    
  ];

  if ( $res['isComponent'] && !empty($repository['types']) ){
    // $res['tabs'] = $model->inc->options->option($model->inc->options->from_code('components','PTYPES', 'ide', BBN_APPUI))['tabs'];
    $res['tabs'] = $model->inc->ide->tabs_of_type_project('components');
    $title = explode("/", $path);
    if ( is_array($title) ){
      array_pop($title);
      $res['title'] = implode('/', $title);
    }
  }
  if ( $res['isMVC'] && !empty($repository['types']) ){
    //$res['tabs'] = $model->inc->options->option($model->inc->options->from_code('mvc','PTYPES', 'ide', BBN_APPUI))['tabs'];
    $res['tabs'] = $model->inc->ide->tabs_of_type_project('mvc');
  }
  // we check if some tab of the components or mvc do not contain any files
  if ( $res['isMVC'] === true ){
    $res['emptyTabs'] = $model->inc->ide->list_tabs_with_file('mvc', $path, $rep);
  }
  else if ( $res['isComponent'] === true ){
    $res['emptyTabs'] = $model->inc->ide->list_tabs_with_file('components',  $path, $rep);
  }
  return $res;
}
return false;
