<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 26/01/2017
 * Time: 17:43
 */

use bbn\X;
/**
 * @var $ctrl \bbn\Mvc\Controller
 */

if ( !empty($ctrl->arguments) ){
  if (substr($ctrl->baseURL, -7) === '/_end_/') {
		$ctrl->addToObj({
      // todo : call componenet coder with data
    })
  }
  else {
    // in this case a file is selected and we will show the router
    $url = 'newide/editor/';
    if ($ctrl->hasData('id_project')) {
      $url = $ctrl->pluginUrl('appui-project').'/ui/'.$ctrl->data['id_project'].'/ide/';
    }
    $ctrl->addData([
      'url' => implode('/', $ctrl->arguments),
      'routes' => $ctrl->getRoutes(),
      'root' => 'newide/',
      'baseURL' => $ctrl->baseURL
    ]);
    //$ctrl->data['url'] = $ctrl->inc->ide->set_origin_for_use($ctrl->arguments);
    $ctrl->combo('$url', true);
    if ($idx = array_search('_end_', $ctrl->arguments)) {
      $url = X::join(array_slice($ctrl->arguments, 0, $idx+1), '/');
      $ctrl->setUrl($ctrl->baseUrl.$url);
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
