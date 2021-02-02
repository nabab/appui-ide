ù<?php
/**
 * Created by BBN Solutions.
 * User: Loredana Bruno
 * Date: 07/02/2019
 * Time: 14:35
 *
 * @var $ctrl \bbn\Mvc\Controller
 */
if ( isset($ctrl->post['origin']) && 
    !empty($ctrl->post['node']) &&
    isset($ctrl->post['new_dir']) && 
    isset($ctrl->post['old_dir'])
    ){
  $ctrl->action();
}

