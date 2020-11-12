<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 26/01/2017
 * Time: 17:43
 */

use bbn\x;
/**
 * @var $ctrl \bbn\mvc\controller
 */
if ( !empty($ctrl->arguments) ){

  if ( $ctrl->baseURL === APPUI_IDE_ROOT.'editor/' ){
    $ctrl->data['url'] = implode('/', $ctrl->arguments);
    //$ctrl->data['url'] = $ctrl->inc->ide->set_origin_for_use($ctrl->arguments);
    $ctrl->data['routes'] = $ctrl->get_routes();

    $ctrl->obj->data = $ctrl->get_model();

    $ctrl->obj->data['root'] = APPUI_IDE_ROOT;
    $ctrl->obj->url = $ctrl->baseURL.'file/'.$ctrl->obj->data['url'];
    $title = $ctrl->obj->data['title'];
    if (!empty($ctrl->obj->data['styleTab'])) {
      $idx = null;
      if (!empty($ctrl->obj->data['isMVC'])) {
        $idx = 'mvc';
      }
      elseif (!empty($ctrl->obj->data['isComponent'])) {
        $idx = 'components';
      }
      elseif (!empty($ctrl->obj->data['isLib'])) {
        $idx = 'lib';
      }
      elseif (empty($ctrl->obj->data['isMVC']) && empty($ctrl->obj->data['isComponent'])) {
        $idx = 'cli';
      }
      if ($idx && $ctrl->obj->data['styleTab'][$idx]) {
        if ($start = stripos($ctrl->obj->data['title'], '/')) {
          $title = substr($ctrl->obj->data['title'],  $start+1);
        }
        //die(var_dump($idx,$ctrl->obj->data['styleTab']));
        $ctrl->obj->bcolor = $ctrl->obj->data['styleTab'][$idx]['bcolor'];
        $ctrl->obj->icon = $ctrl->obj->data['styleTab'][$idx]['icon'];
        $ctrl->obj->fcolor = $ctrl->obj->data['styleTab'][$idx]['fcolor'];
      }
      unset($ctrl->obj->data['styleTab']);
    }


    if ( !empty($title) && (strlen($title) > 20) ){
      $ctrl->obj->ftitle = $title;
      $start = strlen($title) - 20;
      $start = ($start + 3);
      $title = '...'.substr($title,$start);
    }

    echo $ctrl
      ->set_title($title)
      ->add_js()
      ->get_view();
    }
  else {
    //$ctrl->reroute(APPUI_IDE_ROOT.'editor/content', $ctrl->post, $ctrl->arguments);
    $ctrl->reroute($ctrl->plugin_url('appui-ide').'/editor/content', $ctrl->post, $ctrl->arguments);
  }
}