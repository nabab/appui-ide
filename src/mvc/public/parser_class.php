<?php

if (
  !empty($ctrl->post['cls'])
){
  $ctrl->obj->data = $ctrl->get_object_model($ctrl->post);
}

