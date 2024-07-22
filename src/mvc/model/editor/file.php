<?php
use bbn\X;
use bbn\Str;
use bbn\File\System;
use bbn\Appui\Project;
/**
 * @var $model bbn\Mvc\Model
 */


//$timer = new Timer();
if (!empty($model->data['url']) && isset($model->inc->ide)) {
  $timer->start('1st');
  $fs = new System();
  $id_project = $model->inc->options->fromCode(BBN_APP_NAME, "list", "project", "appui");
  $project = new Project($model->db, $id_project);
  $url = $model->data['url'];

  //die(var_dump($model->data['url']));
  $rep = $model->inc->ide->repositoryFromUrl($model->data['url']);

  $file = $model->inc->ide->urlToReal($model->data['url']);
  $route = '';

  //$timer->stop('1st');
  //$timer->start('2nd');
  //define the route for use in test code
  foreach ($model->data['routes'] as $i => $r) {
    if (strpos($file, $r['path']) === 0) {
      $route = $i;
      break;
    }
  }
  $path = str_replace($rep, '' , $url);
  $path = substr($path, 0, Strpos($path, '/_end_'));

  //$timer->stop('2nd');
  //$timer->start('3rd');
  $repository = $model->inc->ide->repository($rep);

  $f = $model->inc->ide->decipherPath($model->data['url']);
  //$timer->stop('3rd');
  //$timer->start('4th');
  //die(var_dump($f,$file, $model->data['url']));
  if ( is_array($repository) &&
      !empty($model->inc->ide->isProject($model->data['url'])) ||
      !empty($repository['project'])
     ){
    $tabs = [];
    $styleTabType = [];
    $project_cfg = $model->inc->ide->getType($repository['alias_code']);
    if (!empty($project_cfg)) {
      foreach( $project_cfg['types'] as $type) {
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
  //$timer->stop('4th');
  //$timer->start('5th');

  //model->data['url'] = implode("/", $stepUrl);
  if ( strpos($model->data['url'],'_end_/settings') !== false ){
    $url_settings = substr($model->data['url'], 0, Strpos($model->data['url'],'_end_/settings')).'_end_/'.($repository['alias_code'] !== 'components' ? "php" : 'js');
    $ctrl_file = $model->inc->ide->urlToReal($url_settings);
  }
  //$timer->stop('5th');
  //$timer->start('52nd');
  $title = array_pop(X::split($path, '/'));
  //X::log(["ext", Str::fileExt($file)], "idefile");
  $urlWithoutEnd = str_replace('/_end_', '', $url);
  $res = [
    'isMVC' => $model->inc->ide->isMVCFromUrl($urlWithoutEnd),
    // isComponent is understood by a single repo with components
    // while isComponentByUrl is understood by the BBN project
    'isComponent' => $model->inc->ide->isComponent($repository) || $model->inc->ide->isComponentFromUrl($urlWithoutEnd),
    'isLib' => $model->inc->ide->isLibFromUrl($urlWithoutEnd),
    'isCli' => $model->inc->ide->isCliFromUrl($urlWithoutEnd),
    //'type' => !empty($type) ? $type : null,
    'title' => $title,
    'path' => $path,
    'repository' => $rep,
    'repository_content' => $repository,
    'url' => $rep.$path.'/_end_',
    'route' => $route,
    'settings' => !empty($ctrl_file) ? $model->inc->fs->isFile($ctrl_file) : false,
    'ext' => Str::fileExt($file),
    'styleTab' => $styleTabType ?? [],
    'files' => [],
    'id_project' => $id_project
  ];

  //$timer->stop('52nd');
  //$timer->start('6th');
  if ($res['isComponent'] && !empty($repository['types'])) {
    $res['tabs'] = $model->inc->ide->tabsOfTypeProject('components');
    $title = explode("/", $path);
    if (is_array($title)) {
      array_pop($title);
      $res['title'] = implode('/', $title);
    }
  }

  //$timer->stop('6th');
  //$timer->start('7th');
  if ($res['isMVC'] && !empty($repository['types'])) {
    $res['tabs'] = $model->inc->ide->tabsOfTypeProject('mvc');
  }
  // we check if some tab of the components or mvc do not contain any files

  //$timer->stop('7th');
  //$timer->start('9th');

  $real = substr($url, 0, strpos($url, "_end_") + strlen("_end_"));
  foreach ($res['tabs'] as &$tab) {
    $tab['file'] = $project->urlToReal($real . '/' . $tab['url']);
  }
  
  //$timer->stop('9th');
  //$timer->start('10th');
  $res['url'] = $path;
  if (!empty($model->data['styleTab'])) {
    $idx = null;
    if (!empty($model->data['isMVC'])) {
      $idx = 'mvc';
    }
    elseif (!empty($model->data['isComponent'])) {
      $idx = 'components';
    }
    elseif (!empty($model->data['isLib'])) {
      $idx = 'lib';
    }
    elseif (empty($model->data['isMVC']) && empty($model->data['isComponent'])) {
      $idx = 'cli';
    }
    if ($idx && $model->data['styleTab'][$idx]) {
      if ($start = stripos($model->data['title'], '/')) {
        $title = substr($model->data['title'],  $start + 1);
      }
    }
  }

  //$timer->stop('10th');
  //X::log($timer->results(), 'ide_timing');
  return $res;
}
