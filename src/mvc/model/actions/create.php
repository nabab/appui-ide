<?php
if ( isset($model->inc->ide) &&
  !empty($model->inc->ide->create($model->data))
){
  return [ 'success' => true];
}

return [
  'success' => false,
  'error' =>  _('Impossible to create the element')
];
