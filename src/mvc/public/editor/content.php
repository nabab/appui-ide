<?php
/** @var $ctrl \bbn\Mvc\Controller */
if (defined('BBN_BASEURL') && !empty($ctrl->arguments)) {
  $step = $ctrl->arguments;
  $ctrl->data['url'] = implode('/', $ctrl->arguments);
  if ( $ctrl->obj->data = $ctrl->getModel(\bbn\X::mergeArrays($ctrl->data, $ctrl->post)) ){
    if ( !empty($ctrl->obj->data['error']) ){
      $ctrl->obj->error = $ctrl->obj->data['error'];
    }
  }
  $title = $ctrl->arguments[count($ctrl->arguments)-1];
  if ( strpos($title, '_ctrl') !== false ){
    $title = "CTRL".($ctrl->obj->data['ssctrl']+1);
  }

 
  if ( (end($ctrl->arguments) === "settings") ||
    ($ctrl->arguments[count($ctrl->arguments) - 2]  === "settings")
  ){
    $title = 'settings';
    //url tabnav settings
    $ctrl->obj->url = BBN_BASEURL.'settings';
  }
  else{
    $ctrl->obj->url = BBN_BASEURL.end($ctrl->arguments);
  }
  echo $ctrl
  ->setTitle($title)
  ->addJs()
  ->getView();
}
