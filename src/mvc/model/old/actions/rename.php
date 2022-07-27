<?php

if ( isset($model->inc->ide) &&
  !empty($model->inc->ide->rename($model->data))
){
  return ['success' => true];
}

return [
  'success' => false,
  'error' => _('Imposssibile rename the element')
];
