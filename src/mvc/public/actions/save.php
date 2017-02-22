<?php
/** @var \bbn\mvc\controller $ctrl */
if ( isset($ctrl->inc->ide) ){
  $ctrl->obj = $ctrl->inc->ide->save($ctrl->post);
}
