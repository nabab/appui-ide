<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 26/01/2017
 * Time: 17:43
 *
 * @var $ctrl \bbn\mvc\controller
 */
if ( isset($ctrl->inc->ide) && !empty($ctrl->post['tab']) ){
  echo $ctrl
    ->add_js($ctrl->inc->ide->load($ctrl->post, $ctrl->inc->pref))
    ->get_view();
  $ctrl->obj->url = $ctrl->post['tab'];
}


