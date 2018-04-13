<?php
if ( $ctrl->post &&
    !empty($ctrl->post['id'])
){
  $ctrl->obj = $ctrl->get_object_model($ctrl->post);  
}
else{
  $ctrl->obj->error = _('error');
}
