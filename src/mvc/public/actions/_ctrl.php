<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 24/02/2017
 * Time: 10:35
 *
 * @var $ctrl \bbn\mvc\controller
 */
return true;
if ( !empty($ctrl->post['repository']) &&
  !empty($ctrl->post['bbn_path']) &&
  !empty($ctrl->post['rep_path']) &&
  !empty($ctrl->post['extensions']) &&
  isset($ctrl->post['tab_path'], $ctrl->post['tab'])
){
  return true;
}
return false;