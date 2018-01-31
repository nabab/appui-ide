<?php
/**
 * Created by PhpStorm.
 * User: Vito Fava
 * Date: 08/01/2018
 * Time: 12:58
 *
 * @var $ctrl \bbn\mvc\controller
 */

if (
  !empty($ctrl->post['content']) &&
  !empty($ctrl->post['repository']) &&
  !empty($ctrl->post['nameRepository'])
){

  $ctrl->obj->data = $ctrl->get_object_model($ctrl->post);
}
