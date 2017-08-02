<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 26/01/2017
 * Time: 17:43
 *
 * @var $ctrl \bbn\mvc\controller
 */

if ( !empty($ctrl->arguments) ){
  if ( $ctrl->baseURL === APPUI_IDE_ROOT.'editor/' ){
    $ctrl->data['url'] = implode('/', $ctrl->arguments);
    $ctrl->obj->data = $ctrl->get_model();
    $ctrl->obj->data['root'] = APPUI_IDE_ROOT;
    $ctrl->obj->url = $ctrl->baseURL.'file/'.$ctrl->obj->data['url'];
    echo $ctrl
      ->set_title($ctrl->obj->data['title'])
      ->add_js()
      ->get_view();
  }
  else if ( !empty($ctrl->arguments) ){
    $ctrl->reroute(APPUI_IDE_ROOT.'editor/code', $ctrl->post, $ctrl->arguments);
  }
}
