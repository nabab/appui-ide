<?php

if ( isset($model->inc->ide)  ){
  return[
    'success' =>  $model->inc->ide->set_theme($model->data['theme'])
  ];
}

return [
  'success' => false
];