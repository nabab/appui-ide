<?php
/* @var $ctrl \bbn\mvc\controller */
$ctrl->obj->title = "Constants";
$ctrl->data = ['names' => []];
$prefs = ['APST', 'BBN'];
foreach ( $prefs as $i => $p ){
  $ctrl->data['names'][$i] = $ctrl->get_model(['name' => $p]);
}
echo $ctrl->get_view().$ctrl->get_less();

?>