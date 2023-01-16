<?php
/* @var $ctrl \bbn\Mvc\Controller */
$ctrl->obj->title = "Constants";
$ctrl->data = ['names' => []];
$prefs = ['APST', 'BBN'];
foreach ( $prefs as $i => $p ){
  $ctrl->data['names'][$i] = $ctrl->getModel(['name' => $p]);
}
echo $ctrl->getView().$ctrl->getLess();

