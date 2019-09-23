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
    $ctrl->data['routes'] = $ctrl->get_routes();
    $ctrl->obj->data = $ctrl->get_model();    
    $ctrl->obj->data['root'] = APPUI_IDE_ROOT;
    $ctrl->obj->url = $ctrl->baseURL.'file/'.$ctrl->obj->data['url'];
    $title = $ctrl->obj->data['title'];

    //case MVC set Tab
    if ( ($ctrl->obj->data['isMVC']) &&
      is_array($ctrl->obj->data['styleTab'])
    ){
      if ( $start = stripos($ctrl->obj->data['title'],'/') ){
        $title = substr($ctrl->obj->data['title'],  $start+1);
      }
      $ctrl->obj->bcolor = $ctrl->obj->data['styleTab']['mvc']['bcolor'];
      $ctrl->obj->icon = $ctrl->obj->data['styleTab']['mvc']['icon'];
      $ctrl->obj->fcolor = $ctrl->obj->data['styleTab']['mvc']['fcolor'];
    }
    //case Components set Tab
    else if ( $ctrl->obj->data['isComponent'] &&
      is_array($ctrl->obj->data['styleTab'])
    ){
      if ( $start = stripos($ctrl->obj->data['title'],'/') ){
        $title = substr($ctrl->obj->data['title'],  $start+1);
      }
      $ctrl->obj->bcolor = $ctrl->obj->data['styleTab']['components']['bcolor'];
      $ctrl->obj->icon = $ctrl->obj->data['styleTab']['components']['icon'];
      $ctrl->obj->fcolor = $ctrl->obj->data['styleTab']['components']['fcolor'];
    }
    //case Lib set Tab
    else if ( empty($ctrl->obj->data['isComponent']) &&
      empty($ctrl->obj->data['isMVC']) &&
      ($ctrl->obj->data['repository_content']['code'] === "lib/") &&
      is_array($ctrl->obj->data['styleTab'])
    ){
      if ( $start = stripos($ctrl->obj->data['title'],'/') ){
        $title = substr($ctrl->obj->data['title'],  $start+1);
      }
      $ctrl->obj->bcolor = $ctrl->obj->data['styleTab']['lib']['bcolor'];
      $ctrl->obj->icon = $ctrl->obj->data['styleTab']['lib']['icon'];
      $ctrl->obj->fcolor = $ctrl->obj->data['styleTab']['lib']['fcolor'];
    }    
    unset($ctrl->obj->data['styleTab']);


    if ( !empty($title) && (strlen($title) > 20) ){
      $start = strlen($title) - 20;
      $start = ($start + 3);
      $title = '...'.substr($title,$start);
    }

    echo $ctrl
      ->set_title($title)
      //->set_ftitle($ctrl->obj->data['title'])
      ->add_js()
      ->get_view();
  }
  else {
    $ctrl->reroute(APPUI_IDE_ROOT.'editor/content', $ctrl->post, $ctrl->arguments);
  }
}
