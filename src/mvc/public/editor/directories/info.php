<?php
if ( $ctrl->post &&
    !empty($ctrl->post)
){
  $ctrl->obj = $ctrl->get_object_model($ctrl->post);
}
else{
  $ctrl->obj->error = _('error');
}
