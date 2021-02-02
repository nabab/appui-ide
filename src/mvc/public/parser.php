<?php
if ( !empty($ctrl->post['cls']) ){
  $ctrl->obj->data = $ctrl->getObjectModel($ctrl->post);
}

