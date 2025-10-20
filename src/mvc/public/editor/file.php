<?php
use bbn\X;
/**
 * @var bbn\Mvc\Controller $ctrl
 */

if (defined('BBN_BASEURL') && !empty($ctrl->arguments)) {
  $base = constant('BBN_BASEURL');
  $root = $ctrl->pluginUrl('appui-ide') . '/';
  $ctrl->addData([
    'url' => implode('/', $ctrl->arguments),
    'routes' => $ctrl->getRoutes(),
    'root' => $root,
    'baseURL' => $base
  ]);

  if (substr($base, -7) === '/_end_/') {
    $ctrl->addToObj($root . 'editor/code', $ctrl->data, true);
  }
  else {
    // in this case a file is selected and we will show the router
    $url = $root . 'editor/';
    if ($ctrl->hasData('id_project')) {
      $url = $ctrl->pluginUrl('appui-project').'/ui/'.$ctrl->data['id_project'].'/ide/';
    }
    //X::ddump($ctrl->arguments, $ctrl->data['url']);
    //$ctrl->data['url'] = $ctrl->inc->ide->set_origin_for_use($ctrl->arguments);
    $ctrl->combo('$url', true);
    if ($idx = array_search('_end_', $ctrl->arguments)) {
      $url = X::join(array_slice($ctrl->arguments, 0, $idx+1), '/');
      $ctrl->setUrl($url);
    }

    if ($ctrl->obj->data['isMVC'] && (strpos($ctrl->obj->title, '/'.'mvc/') === 0)) {
      $ctrl->setTitle(substr($ctrl->obj->title, 5));
      $ctrl->setColor('var(--navy)', '#FFF');
    }
    elseif ($ctrl->obj->data['isComponent'] && (strpos($ctrl->obj->title, '/'.'components/') === 0)) {
      $ctrl->setTitle(substr($ctrl->obj->title, 12));
      $ctrl->setColor('var(--brown)', '#FFF');
    }
  }

  /*if ( !empty($title) && (strlen($title) > 20) ){
      $ctrl->obj->ftitle = $title;
      $start = strlen($title) - 20;
      $start = ($start + 3);
      $title = '...'.substr($title,$start);
    }

    echo $ctrl
      ->setTitle($title)
      ->addJs()
      ->getView();*/
}
